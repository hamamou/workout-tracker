import {serveStatic} from '@hono/node-server/serve-static';
import {Hono} from 'hono';
import {logger} from 'hono/logger';
import {AuthRoute} from './routes/auth';
import {ExerciseRoutes} from './routes/exercise';
import {workoutLogsRoutes} from './routes/workoutLog';
import {workoutsRoutes} from './routes/workouts';

const app = new Hono();

app.use('*', logger());
const apiRoute = app
    .basePath('/api')
    .route('/', AuthRoute)
    .route('/workouts', workoutsRoutes)
    .route('/workoutLogs', workoutLogsRoutes)
    .route('/exercises', ExerciseRoutes);

app.use('/*', serveStatic({root: './frontend/dist'}));
app.use('/*', serveStatic({root: './frontend/dist/index.html'}));

export default app;
export type ApiRoutes = typeof apiRoute;
