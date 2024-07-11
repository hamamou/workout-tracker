import {zValidator} from '@hono/zod-validator';
import {and, eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {db} from '../db';
import {
    exerciseLogs as exerciseLogsTable,
    setLogs as setLogsTable,
    workoutLogs as workoutLogsTable,
} from '../db/schema/workoutLogs';
import {workouts} from '../db/schema/workouts';
import {getUser} from '../kinde';
import {insertWorkoutLogsSchema, selectBasicWorkoutLogs} from '../types/workoutLog';

export const workoutLogsRoutes = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;
        const workoutLogs = await db.select().from(workoutLogsTable).where(eq(workoutLogsTable.userId, user.id));
        return c.json(workoutLogs);
    })
    .get('/:workoutId{[0-9]+}', getUser, async (c) => {
        const workoutId = parseInt(c.req.param('workoutId'));
        const user = c.var.user;
        const workoutLogs = await db
            .select()
            .from(workoutLogsTable)
            .where(and(eq(workoutLogsTable.workoutId, workoutId), eq(workoutLogsTable.userId, user.id)));

        return c.json(workoutLogs);
    })
    .get('/:id', getUser, async (c) => {
        const id = parseInt(c.req.param('id'));
        const user = c.var.user;
        const workoutLog = await db
            .select()
            .from(workoutLogsTable)
            .where(and(eq(workoutLogsTable.id, id), eq(workoutLogsTable.userId, user.id)))
            .then((res) => res[0]);

        if (!workoutLog) {
            return c.notFound();
        }
        return c.json(workoutLog);
    })
    .post('/', getUser, zValidator('json', insertWorkoutLogsSchema), async (c) => {
        const validWorkout = c.req.valid('json');

        let workoutLog: selectBasicWorkoutLogs = {} as selectBasicWorkoutLogs;
        await db.transaction(async (tx) => {
            workoutLog = await tx
                .insert(workoutLogsTable)
                .values({
                    ...validWorkout,
                    loggedAt: new Date().toISOString(),
                    userId: c.var.user.id,
                })
                .returning()
                .then((res) => res[0]);

            for (const exerciseSet of validWorkout.exerciseLogs) {
                const exercisesSets = await tx
                    .insert(exerciseLogsTable)
                    .values({workoutLogId: workoutLog.id, exerciseId: exerciseSet.exerciseId})
                    .returning();

                const insertedExerciseSet = exercisesSets[0];
                for (const set of exerciseSet.setLogs) {
                    await tx
                        .insert(setLogsTable)
                        .values({...set, exerciseLogsId: insertedExerciseSet.id})
                        .returning();
                }
            }
            const workout = await tx
                .select()
                .from(workouts)
                .where(eq(workouts.id, validWorkout.workoutId))
                .then((res) => res[0]);

            await tx.update(workouts).set({lastLoggedAt: new Date().toISOString()}).where(eq(workouts.id, workout.id));
        });

        return c.json(workoutLog);
    });
