import { createFactory } from 'hono/factory';
import { db } from '@/db.js';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { members, organizations } from '@bookio/db';
import { eq } from 'drizzle-orm';

const factory = createFactory().createHandlers;

const organizationSchema = z.object({
    userId: z.string(),
});

export const getOrganizationHandler = factory(
    zValidator('query', organizationSchema),
    async (c) => {
        const { userId } = c.req.valid('query');

        const selectedData = await db
            .select()
            .from(members)
            .innerJoin(organizations, eq(members.organizationId, organizations.id))
            .where(eq(members.userId, userId));

        const organizationsData = selectedData.map((item) => {
            const {
                organizations: { secretKey, ...organization },
                members,
            } = item;

            return {
                ...organization,
                role: members.role,
            };
        });

        return c.json(organizationsData);
    },
);
