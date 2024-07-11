import {date, index, integer, pgTable, serial, text} from 'drizzle-orm/pg-core';
import {exercises} from './exercises';
import {workouts} from './workouts';

export const workoutLogs = pgTable(
    'workout_logs',
    {
        id: serial('id').primaryKey(),
        name: text('name'),
        loggedAt: date('logged_at').notNull(),
        userId: text('user_id').notNull(),
        workoutId: integer('workout_id')
            .references(() => workouts.id, {onDelete: 'cascade'})
            .notNull(),
    },
    (workoutsLogs) => {
        return {
            userIndex: index('user_workout_logs_index').on(workoutsLogs.userId),
        };
    },
);

export const exerciseLogs = pgTable('exercise_logs', {
    id: serial('id').primaryKey(),
    exerciseId: integer('exercise_id')
        .references(() => exercises.id, {onDelete: 'cascade'})
        .notNull(),
    workoutLogId: integer('workout_log_id')
        .references(() => workoutLogs.id, {onDelete: 'cascade'})
        .notNull(),
});

export const setLogs = pgTable('set_logs', {
    id: serial('id').primaryKey(),
    weight: integer('weight').notNull(),
    repetition: integer('repetitions').notNull(),
    exerciseLogsId: integer('exercise_logs_id')
        .references(() => exerciseLogs.id, {onDelete: 'cascade'})
        .notNull(),
});
