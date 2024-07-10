import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';

import {and, eq} from 'drizzle-orm';
import {db} from '../../db';
import {
    exercisesSets as exercisesSetsTable,
    sets as setsTable,
    workouts as workoutsTable,
} from '../../db/schema/workouts';
import {getUser} from '../../kinde';
import {createWorkoutSchema} from './types';

export const workoutsRoutes = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;
        const workouts = await db.select().from(workoutsTable).where(eq(workoutsTable.userId, user.id));
        return c.json({workouts});
    })
    .get('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const workout = await db
            .select()
            .from(workoutsTable)
            .where(and(eq(workoutsTable.id, id), eq(workoutsTable.userId, c.var.user.id)));

        if (!workout) {
            return c.notFound();
        }

        return c.json(workout[0]);
    })
    .post('/', getUser, zValidator('json', createWorkoutSchema), async (c) => {
        const createWorkoutData = c.req.valid('json');
        let workout;
        await db.transaction(async (tx) => {
            workout = await tx
                .insert(workoutsTable)
                .values({...createWorkoutData, userId: c.var.user.id})
                .returning();

            const insertedWorkout = workout[0];
            for (const exerciseSet of createWorkoutData.exerciseSets) {
                const exercisesSets = await tx
                    .insert(exercisesSetsTable)
                    .values({workoutId: insertedWorkout.id, exerciseId: exerciseSet.exerciseId})
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

        return c.json({workout}, 201);
    })

    .delete('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        await db.delete(workoutsTable).where(eq(workoutsTable.id, id));
        return c.json({message: 'Workout deleted'}, 204);
    });
