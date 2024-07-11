import {z} from 'zod';

export const exerciseLogSchema = z.object({
    exerciseId: z.number(),
    setLogs: z.array(
        z.object({
            weight: z.number(),
            repetition: z.number(),
        }),
    ),
});

export type ExerciseLog = z.infer<typeof exerciseLogSchema>;

export const workoutLogSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string().optional(),
    workoutId: z.number().int().positive().min(1),
    loggedAt: z.string(),
    exerciseLogs: z.array(exerciseLogSchema),
});
export const createWorkoutLogSchema = workoutLogSchema.omit({id: true});

export type createWorkoutLog = z.infer<typeof createWorkoutLogSchema>;

export type WorkoutLog = z.infer<typeof workoutLogSchema>;
