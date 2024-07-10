import {drizzle} from 'drizzle-orm/postgres-js';
import {migrate} from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const main = async () => {
    const migrationClient = postgres(process.env.DATABASE_URL!, {max: 1});
    await migrate(drizzle(migrationClient), {migrationsFolder: './drizzle/'});
};

main()
    .then(() => {
        console.log('Migration complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
