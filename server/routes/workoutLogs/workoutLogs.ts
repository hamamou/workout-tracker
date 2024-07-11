import {zValidator} from '@hono/zod-validator';
import {and, eq} from 'drizzle-orm';
import {Hono} from 'hono';
import {db} from '../../db';
import {
    exerciseLogs as exerciseLogsTable,
    setLogs as setLogsTable,
    workoutLogs as workoutLogsTable,
} from '../../db/schema/workoutLogs';
import {getUser} from '../../kinde';
import {createWorkoutLogSchema} from './types';

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
            .limit(1)
            .then((res) => res[0]);

        if (!workoutLog) {
            return c.notFound();
        }
        return c.json(workoutLog);
    })
    .post('/', getUser, zValidator('json', createWorkoutLogSchema), async (c) => {
        const createWorkoutLog = c.req.valid('json');

        console.log(createWorkoutLog);

        let workoutLog;
        await db.transaction(async (tx) => {
            workoutLog = await tx
                .insert(workoutLogsTable)
                .values({...createWorkoutLog, userId: c.var.user.id, loggedAt: new Date().toString()})
                .returning();

            const insertedWorkout = workoutLog[0];
            for (const exerciseSet of createWorkoutLog.exerciseLogs) {
                const exercisesSets = await tx
                    .insert(exerciseLogsTable)
                    .values({workoutLogId: insertedWorkout.id, exerciseId: exerciseSet.exerciseId})
                    .returning();

                const insertedExerciseSet = exercisesSets[0];
                for (const set of exerciseSet.setLogs) {
                    await tx
                        .insert(setLogsTable)
                        .values({...set, exerciseLogsId: insertedExerciseSet.id})
                        .returning();
                }
            }
        });

        return c.json(workoutLog);
    });
