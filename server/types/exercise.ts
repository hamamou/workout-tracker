import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {exercises} from '../db/schema/exercises';

export const insertExerciseSchema = createInsertSchema(exercises);

export const selectExerciseSchema = createSelectSchema(exercises);

export type selectExercise = Zod.infer<typeof selectExerciseSchema>;
