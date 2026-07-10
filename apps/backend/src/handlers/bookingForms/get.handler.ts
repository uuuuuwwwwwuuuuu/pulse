import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { bookingForms } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { eq } from 'drizzle-orm';

const factory = createFactory().createHandlers;

const getBookingFormsSchema = z.object({
    organizationId: z.uuid(),
});

export const getBookingFormsHandler = factory(
    zValidator('query', getBookingFormsSchema),
    async (c) => {
        try {
            const { organizationId } = c.req.valid('query');

            const forms = await db
                .select()
                .from(bookingForms)
                .where(eq(bookingForms.organizationId, organizationId));

            if (!forms || forms.length === 0) {
                return c.json(prepareError('No booking forms found'));
            }

            return c.json(prepareSuccess(forms));
        } catch (error) {
            return c.json(prepareError('Failed to get booking forms'));
        }
    },
);

const getBookingFormSchema = z.object({
    bookingFormId: z.uuid(),
});

export const getBookingFormHandler = factory(
    zValidator('query', getBookingFormSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const [form] = await db
                .select()
                .from(bookingForms)
                .where(eq(bookingForms.id, bookingFormId));

            if (!form) {
                return c.json(prepareError('Booking form not found'));
            }

            return c.json(prepareSuccess(form));
        } catch (error) {
            return c.json(prepareError('Failed to get booking form'));
        }
    },
);

export const getBookingFormWithFieldsHandler = factory(
    zValidator('query', getBookingFormSchema),
    async (c) => {
        try {
            const { bookingFormId } = c.req.valid('query');

            const form = await db.query.bookingForms.findFirst({
                where: (bookingForms, { eq }) => eq(bookingForms.id, bookingFormId),
            })
        } catch (error) {
            return c.json(prepareError('Failed to get booking form with fields'));
        }
    },
);