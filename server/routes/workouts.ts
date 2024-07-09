import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {z} from 'zod';

const workouts: Workout[] = [
    {
        id: 1,
        name: 'workout 1',
        description: 'description 1',
        exerciseSets: [
            {
                exerciseId: 1,
                name: 'exercise 1',
                sets: [
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
        name: 'workout 2',
        description: 'description 2',
        exerciseSets: [
            {
                exerciseId: 2,
                name: 'exercise 2',
                sets: [
                    {
                        weight: 200,
                        repetition: 20,
                    },
                ],
            },
        ],
    },
];

const workoutSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().min(3),
    description: z.string(),
    exerciseSets: z.array(
        z.object({
            exerciseId: z.number(),
            name: z.string(),
            sets: z.array(
                z.object({
                    weight: z.number(),
                    repetition: z.number(),
                }),
            ),
        }),
    ),
});

export type Workout = z.infer<typeof workoutSchema>;

const createWorkoutSchema = workoutSchema.omit({id: true});

export const workoutsRoutes = new Hono()
    .get('/', (c) => {
        return c.json({workouts});
    })
    .get('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const workout = workouts.find((w) => w.id === id);

        if (!workout) {
            return c.notFound();
        }

        return c.json({workout});
    })
    .post('/', zValidator('json', createWorkoutSchema), async (c) => {
        const workout = c.req.valid('json');
        workouts.push({...workout, id: workouts.length + 1});

        return c.json({workout}, 201);
    })

    .delete('/:id{[0-9]+}', (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const index = workouts.findIndex((w) => w.id === id);

        if (index === -1) {
            return c.notFound();
        }

        const deletedWorkout = workouts.splice(index, 1)[0];

        return c.json({deletedWorkout});
    });