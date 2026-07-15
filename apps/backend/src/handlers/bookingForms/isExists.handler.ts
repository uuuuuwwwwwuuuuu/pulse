import { createFactory } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { isBookingFormExists } from '@/utils/isBookingFormExists.js';

const isBookingFormExistsSchema = z
    .object({
        organizationId: z.uuid(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(60).optional(),
    })
    .refine(
        (data) => data.name !== undefined || data.slug !== undefined,
        {
            message: 'Either name or slug must be provided',
        },
    );

const factory = createFactory().createHandlers;

export const isBookingFormExistsHandler = factory(
    zValidator('json', isBookingFormExistsSchema),
    async (c) => {
        try {
            const { name, slug, organizationId } = c.req.valid('json');

            const isExists = await isBookingFormExists({ name, slug, organizationId });

            return c.json(prepareSuccess(isExists));
        } catch (error) {
            return c.json(prepareError('Failed to check if booking form exists'));
        }
    },
);
