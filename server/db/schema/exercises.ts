import {pgTable, serial, text, uniqueIndex} from 'drizzle-orm/pg-core';

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
