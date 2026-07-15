import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { bookingForms } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { isBookingFormExists } from '@/utils/isBookingFormExists.js';
import { type BookingFormInsert } from '@bookio/db';

const factory = createFactory().createHandlers;

const createBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional().nullable(),
    organizationId: z.uuid(),
    slug: z.string().min(1).max(60),
}) satisfies z.ZodType<BookingFormInsert>;

export const createBookingFormHandler = factory(
    zValidator('json', createBookingFormSchema),
    async (c) => {
        try {
            const { name, description, organizationId, slug } = c.req.valid('json');

            const existingByName = await isBookingFormExists({ name, organizationId });

            if (existingByName) {
                return c.json(prepareError('Booking form with this name already exists'), 400);
            }

            const existingBySlug = await isBookingFormExists({ slug, organizationId });

            if (existingBySlug) {
                return c.json(prepareError('Booking form with this slug already exists'), 400);
            }

            const bookingForm = await db
                .insert(bookingForms)
                .values({
                    slug,
                    name,
                    description,
                    organizationId,
                }).returning();

            return c.json(prepareSuccess(bookingForm));
        } catch (error) {
            return c.json(prepareError('Failed to create booking form'), 500);
        }
    },
);
