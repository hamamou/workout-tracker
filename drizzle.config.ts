import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    schema: './server/db/schema/*',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
    },
});
