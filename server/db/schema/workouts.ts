import {date, integer, pgTable, serial, text, uniqueIndex} from 'drizzle-orm/pg-core';

export const workouts = pgTable(
    'workouts',
    {
        id: serial('id').primaryKey(),
        name: text('name').notNull(),
        description: text('description'),
        lastLoggedAt: date('last_logged_at'),
        userId: text('user_id').notNull(),
    },
    (workouts) => {
        return {
            userIndex: uniqueIndex('user_index').on(workouts.userId),
        };
    },
);

export const exercises = pgTable(
    'exercises',
    {
        id: serial('id').primaryKey(),
        name: text('name'),
    },
    (exercises) => {
        return {
            nameIndex: uniqueIndex('name_index').on(exercises.name),
        };
    },
);

export const exercisesSets = pgTable('exercises_sets', {
    id: serial('id').primaryKey(),
    exerciseId: text('exercise_id')
        .references(() => exercises.id, {onDelete: 'cascade'})
        .notNull(),
    workoutId: integer('workout_id')
        .references(() => workouts.id, {onDelete: 'cascade'})
        .notNull(),
});

export const sets = pgTable('sets', {
    id: serial('id').primaryKey(),
    weight: integer('weight').notNull(),
    reps: integer('reps').notNull(),
    exerciseSetId: integer('exercise_set_id')
        .references(() => exercisesSets.id, {onDelete: 'cascade'})
        .notNull(),
});
