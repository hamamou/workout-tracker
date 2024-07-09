import {Hono} from 'hono';
import {z} from 'zod';

const exerciseSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().min(3),
});

type Exercise = z.infer<typeof exerciseSchema>;

const exercises: Exercise[] = [
    {
        id: 1,
        name: 'exercise 1',
    },
    {
        id: 2,
        name: 'exercise 2',
    },
];

export const ExerciseRoutes = new Hono().get('/', (c) => {
    return c.json(exercises);
});
