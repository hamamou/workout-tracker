import {serve} from '@hono/node-server';
import app from './app';

console.log(process.env.KINDE_DOMAIN);

const port = 3000;

serve({
    fetch: app.fetch,
    port,
});

console.log(`Server is running on port ${port} 🚀`);
