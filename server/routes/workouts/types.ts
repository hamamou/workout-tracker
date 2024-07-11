import {z} from 'zod';

const workoutSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().min(3),
    description: z.string().optional(),
    lastLoggedAt: z.string().optional(),
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
    exerciseId: z.number().gt(0, {message: 'Select exercise'}),
    sets: z
        .array(
            z.object({
                weight: z.number().gt(0),
                repetition: z.number().gt(0),
            }),
        )
        .nonempty(),
});

export type ExerciseSet = z.infer<typeof exerciseSetSchema>;

export const createWorkoutSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    exerciseSets: z.array(exerciseSetSchema).nonempty({message: 'Add at least one exercise'}),
});
export type CreateWorkout = z.infer<typeof createWorkoutSchema>;
