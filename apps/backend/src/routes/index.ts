import { Hono } from 'hono';
import organizations from './organizations.routes.js';
import bookings from './bookings.routes.js';

const routes = new Hono().route('/organizations', organizations).route('/bookings', bookings);

export default routes;
export type AppType = typeof routes;
