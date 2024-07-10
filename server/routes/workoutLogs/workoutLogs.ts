import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {createWorkoutLogSchema, WorkoutLog} from './types';

const workoutLogs: WorkoutLog[] = [
    {
        id: 1,
        workoutId: 1,
        loggedAt: new Date(),
        exerciseLogs: [
            {
                exerciseId: 1,
                setLogs: [
                    {
                        weight: 100,
                        repetition: 10,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        workoutId: 2,
        loggedAt: new Date(),
        exerciseLogs: [
            {
                exerciseId: 2,
                setLogs: [
                    {
                        weight: 200,
                        repetition: 20,
                    },
                ],
            },
        ],
    },
];
export const workoutLogsRoutes = new Hono()
    .get('/', (c) => {
        return c.json(workoutLogs);
    })
    .get('/:id', (c) => {
        const id = parseInt(c.req.param('id'));
        const workoutLog = workoutLogs.find((workoutLog) => workoutLog.id === id);
        if (!workoutLog) {
            return c.notFound();
        }
        return c.json(workoutLog);
    })
    .post('/', zValidator('json', createWorkoutLogSchema), (c) => {
        const workoutLog = c.req.valid('json');
        workoutLogs.push({...workoutLog, id: workoutLogs.length + 1});
        return c.json(workoutLog);
    });
