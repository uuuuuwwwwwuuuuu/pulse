import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/db.js';
import { and, eq } from 'drizzle-orm';
import { members } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';

const factory = createFactory().createHandlers;

const logoutOrganizationSchema = z.object({
    userId: z.string(),
    organizationId: z.string(),
});

export const logoutOrganizationHandler = factory(
    zValidator('json', logoutOrganizationSchema),
    async (c) => {
        const { userId, organizationId } = c.req.valid('json');

        const [deletedMember] = await db
            .delete(members)
            .where(and(eq(members.userId, userId), eq(members.organizationId, organizationId)));

        if (!deletedMember) {
            return c.json(prepareError('Member not found'), 404);
        }

        return c.json(prepareSuccess('Member deleted successfully'));
    },
);
