import {date, index, integer, pgTable, serial, text} from 'drizzle-orm/pg-core';
import {exercises} from './exercises';

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
            userIndex: index('user_workout_index').on(workouts.userId),
        };
    },
);

export const exercisesSets = pgTable('exercises_sets', {
    id: serial('id').primaryKey(),
    exerciseId: integer('exercise_id')
        .references(() => exercises.id, {onDelete: 'cascade'})
        .notNull(),
    workoutId: integer('workout_id')
        .references(() => workouts.id, {onDelete: 'cascade'})
        .notNull(),
});

export const sets = pgTable('sets', {
    id: serial('id').primaryKey(),
    weight: integer('weight').notNull(),
    repetition: integer('repetitions').notNull(),
    exerciseSetId: integer('exercise_set_id')
        .references(() => exercisesSets.id, {onDelete: 'cascade'})
        .notNull(),
});
