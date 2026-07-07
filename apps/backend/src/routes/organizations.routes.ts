import { Hono } from 'hono';
import { createOrganizationHandler } from '@handlers/organization/create.handler.js';
import { getOrganizationHandler } from '@handlers/organization/get.handler.js';
import { logoutOrganizationHandler } from '@handlers/organization/logout.handlers.js';

const organizations = new Hono()
    .post('/create', ...createOrganizationHandler)
    .post('/logout', ...logoutOrganizationHandler)
    .get('/', ...getOrganizationHandler);

export default organizations;
