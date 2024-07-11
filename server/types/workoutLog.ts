import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';
import {exerciseLogs, setLogs, workoutLogs} from '../db/schema/workoutLogs';

export const insertSetLogsSchema = createInsertSchema(setLogs, {
    repetition: z.number().gt(0),
    weight: z.number().gt(0),
});

export const selectSetLogsSchema = createSelectSchema(setLogs);

export const insertExerciseLogsSchema = createInsertSchema(exerciseLogs);

export const selectExerciseLogsSchema = createSelectSchema(exerciseLogs);

const selectExerciseLogsSchemaCustom = z.object({
    exerciseId: selectExerciseLogsSchema.shape.exerciseId,
    setLogs: z.array(selectSetLogsSchema.omit({exerciseLogsId: true})),
});

const insertExerciseLogsSchemaCustom = z.object({
    exerciseId: insertExerciseLogsSchema.shape.exerciseId,
    setLogs: z.array(insertSetLogsSchema.omit({exerciseLogsId: true})),
});

export type insertExerciseLogsCustom = z.infer<typeof insertExerciseLogsSchemaCustom>;

export const insertWorkoutLogsSchema = createInsertSchema(workoutLogs, {name: z.string().optional()})
    .extend({
        exerciseLogs: z.array(insertExerciseLogsSchemaCustom),
    })
    .omit({userId: true, loggedAt: true});
const basicWorkoutLogsSchema = createSelectSchema(workoutLogs);
export const selectWorkoutLogsSchema = basicWorkoutLogsSchema
    .extend({
        exerciseLogs: z.array(selectExerciseLogsSchemaCustom),
    })
    .omit({userId: true});

export type insertWorkoutLogs = Zod.infer<typeof insertWorkoutLogsSchema>;
export type selectWorkoutLogs = Zod.infer<typeof selectWorkoutLogsSchema>;
export type selectBasicWorkoutLogs = Zod.infer<typeof basicWorkoutLogsSchema>;
