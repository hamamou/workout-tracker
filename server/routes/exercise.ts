import {Hono} from 'hono';
import {z} from 'zod';
import {db} from '../db';
import {exercises as exercisesTable} from '../db/schema/exercises';

const exerciseSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().min(3),
});

export type Exercise = z.infer<typeof exerciseSchema>;

const exercisesData = [
    {
        name: 'Bench Press',
    },
    {
        name: 'Squat',
    },
    {
        name: 'Deadlift',
    },
    {
        name: 'Overhead Press',
    },
    {
        name: 'Barbell Row',
    },
    {
        name: 'Pull Up',
    },
];

export const ExerciseRoutes = new Hono().get('/', async (c) => {
    let exercises = await db.select().from(exercisesTable);
    if (exercises.length === 0) {
        exercises = await db.insert(exercisesTable).values(exercisesData).returning();
    }
    return c.json(exercises);
});
