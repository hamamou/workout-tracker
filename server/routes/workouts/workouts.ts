import {zValidator} from '@hono/zod-validator';
import {and, eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {db} from '../../db';
import {exercises} from '../../db/schema/exercises';
import {
    exercisesSets as exercisesSetsTable,
    sets as setsTable,
    workouts as workoutsTable,
} from '../../db/schema/workouts';
import {getUser} from '../../kinde';
import {insertWorkoutSchema, selectBasicWorkout, WorkoutWithExerciseNames} from '../../types/workout';
import {groupedByWorkoutId} from './helpers';

export const workoutsRoutes = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;
        const workouts = await db
            .select()
            .from(workoutsTable)
            .where(eq(workoutsTable.userId, user.id))
            .orderBy(workoutsTable.lastLoggedAt);
        return c.json({workouts});
    })
    .get('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const workout: WorkoutWithExerciseNames = await db
            .select()
            .from(exercisesSetsTable)
            .innerJoin(workoutsTable, eq(exercisesSetsTable.workoutId, workoutsTable.id))
            .innerJoin(setsTable, eq(exercisesSetsTable.id, setsTable.exerciseSetId))
            .innerJoin(exercises, eq(exercisesSetsTable.exerciseId, exercises.id))
            .where(and(eq(workoutsTable.id, id), eq(workoutsTable.userId, c.var.user.id)))
            .then((value) => groupedByWorkoutId(value));

        return c.json({workout});
    })
    .post('/', getUser, zValidator('json', insertWorkoutSchema), async (c) => {
        const validWorkout = insertWorkoutSchema.parse(c.req.valid('json'));
        let workout: selectBasicWorkout = {} as selectBasicWorkout;

        await db.transaction(async (tx) => {
            workout = await tx
                .insert(workoutsTable)
                .values({...validWorkout, userId: c.var.user.id})
                .returning()
                .then((value) => value[0]);

            for (const exerciseSet of validWorkout.exerciseSets) {
                const exercisesSets = await tx
                    .insert(exercisesSetsTable)
                    .values({workoutId: workout.id, exerciseId: exerciseSet.exerciseId})
                    .returning();

                const insertedExerciseSet = exercisesSets[0];
                for (const set of exerciseSet.sets) {
                    await tx
                        .insert(setsTable)
                        .values({...set, exerciseSetId: insertedExerciseSet.id})
                        .returning();
                }
            }
        });

        return c.json({...workout}, 201);
    })

    .delete('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        await db.delete(workoutsTable).where(eq(workoutsTable.id, id));
        return c.json({message: 'Workout deleted'}, 200);
    });
