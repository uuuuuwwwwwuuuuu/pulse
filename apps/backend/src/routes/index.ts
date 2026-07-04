import { Hono } from 'hono';
import organizations from './organizations.routes.js';

const routes = new Hono().route('/organizations', organizations);

export default routes;
export type AppType = typeof routes;
