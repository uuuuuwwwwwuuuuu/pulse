import { Hono } from 'hono';
import { createOrganizationHandler } from '@handlers/organization/create.handler.js';
import { getOrganizationHandler } from '@handlers/organization/get.handler.js';

const organizations = new Hono()
    .post('/create', ...createOrganizationHandler)
    .get('/', ...getOrganizationHandler);

export default organizations;
