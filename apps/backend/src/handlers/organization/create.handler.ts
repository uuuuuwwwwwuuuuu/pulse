import { z } from 'zod';
import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { members, organizations } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';

const organizationSchema = z.object({
    name: z.string().min(3).max(255),
    password: z
        .string()
        .min(6)
        .max(255)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
        ),
    userId: z.string(),
});

const factory = createFactory().createHandlers;

export const createOrganizationHandler = factory(zValidator('json', organizationSchema), async (c) => {
    const { name, password, userId } = c.req.valid('json');

    const [organization] = await db.insert(organizations).values({ name, password }).returning();

    const [member] = await db.insert(members).values({
        organizationId: organization.id,
        userId,
        role: 'owner'
    }).returning();

    if (!member) {
        return c.json(prepareError('Failed to create member'), 500);
    }

    return c.json(prepareSuccess({
        organization: {
            name: organization.name,
            id: organization.id,
            createdAt: organization.createdAt,
            secretKey: organization.secretKey,
        },
        role: member.role,
    }));
});
