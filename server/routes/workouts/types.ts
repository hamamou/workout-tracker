import {z} from 'zod';

const workoutSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().min(3),
    description: z.string().nullable(),
    lastLoggedAt: z.string().nullable(),
    userId: z.string(),
    exerciseSets: z
        .array(
            z.object({
                exerciseId: z.number(),
                name: z.string(),
                sets: z.array(
                    z.object({
                        weight: z.number(),
                        repetition: z.number(),
                    }),
                ),
                exercise: z
                    .object({
                        id: z.number(),
                        name: z.string(),
                    })
                    .optional(),
            }),
        )
        .optional(),
});

export type Workout = z.infer<typeof workoutSchema>;

const exerciseSetSchema = z.object({
    exerciseId: z.number(),
    sets: z.array(
        z.object({
            weight: z.number(),
            repetition: z.number(),
        }),
    ),
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;

export const createWorkoutSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    exerciseSets: z.array(exerciseSetSchema),
});
export type CreateWorkout = z.infer<typeof createWorkoutSchema>;
