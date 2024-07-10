import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';

import {eq} from 'drizzle-orm';
import {db} from '../../db';
import {workouts as workoutTable} from '../../db/schema/workouts';
import {getUser} from '../../kinde';
import {createWorkoutSchema} from './types';

export const workoutsRoutes = new Hono()
    .get('/', getUser, async (c) => {
        const user = c.var.user;
        const workouts = await db.select().from(workoutTable).where(eq(workoutTable.userId, user.id));
        return c.json({workouts});
    })
    .get('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const workout = await db.select().from(workoutTable).where(eq(workoutTable.id, id));

        if (!workout) {
            return c.notFound();
        }

        return c.json({workout});
    })
    .post('/', getUser, zValidator('json', createWorkoutSchema), async (c) => {
        const result = await db
            .insert(workoutTable)
            .values({...c.req.valid('json'), userId: c.var.user.id})
            .returning();

        return c.json({result}, 201);
    })

    .delete('/:id{[0-9]+}', getUser, async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        await db.delete(workoutTable).where(eq(workoutTable.id, id));
        return c.json({message: 'Workout deleted'}, 204);
    });
