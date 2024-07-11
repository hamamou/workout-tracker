import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';
import {exercisesSets, sets, workouts} from '../db/schema/workouts';

export const insertSetSchema = createInsertSchema(sets, {
    repetition: z.number().gt(0),
    weight: z.number().gt(0),
});

export type insertSet = z.infer<typeof insertSetSchema>;

export const selectSetSchema = createSelectSchema(sets);

export type selectSet = z.infer<typeof selectSetSchema>;

export const insertExerciseSetSchema = createInsertSchema(exercisesSets, {
    exerciseId: z.number().gt(0, {message: 'Select exercise'}),
});

export const selectExerciseSetSchema = createSelectSchema(exercisesSets);
export type selectExerciseSet = z.infer<typeof selectExerciseSetSchema>;

const selectExerciseSetSchemaCustom = z.object({
    exerciseId: selectExerciseSetSchema.shape.exerciseId,
    sets: z.array(selectSetSchema.omit({exerciseSetId: true})),
});

const insertExerciseSetSchemaCustom = z.object({
    exerciseId: insertExerciseSetSchema.shape.exerciseId,
    sets: z.array(insertSetSchema.omit({exerciseSetId: true})),
});

export type insertExerciseSetCustom = z.infer<typeof insertExerciseSetSchemaCustom>;

export const insertWorkoutSchema = createInsertSchema(workouts, {name: z.string().min(3)})
    .extend({
        exerciseSets: z.array(insertExerciseSetSchemaCustom).nonempty({message: 'Add at least one exercise'}),
    })
    .omit({userId: true});

export const selectWorkoutSchema = createSelectSchema(workouts)
    .extend({
        exerciseSets: z.array(selectExerciseSetSchemaCustom),
    })
    .omit({userId: true});

export type insertWorkout = Zod.infer<typeof insertWorkoutSchema>;
export type selectWorkout = Zod.infer<typeof selectWorkoutSchema>;

export type ExerciseWithNames = {
    exerciseId: number;
    name: string;
    sets: {weight: number; repetition: number; id: number}[];
};

export type WorkoutWithExerciseNames = selectWorkout & {
    exerciseSets: ExerciseWithNames[];
};
