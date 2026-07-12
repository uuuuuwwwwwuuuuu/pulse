import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { bookingFormFields } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { eq } from 'drizzle-orm';

const factory = createFactory().createHandlers;

const deleteBookingFormFieldSchema = z.object({
    id: z.uuid(),
});

export const deleteBookingFormFieldHandler = factory(
    zValidator('json', deleteBookingFormFieldSchema),
    async (c) => {
        try {
            const { id } = c.req.valid('json');

            const [deletedField] = await db.delete(bookingFormFields).where(eq(bookingFormFields.id, id)).returning();

            if (!deletedField) {
                return c.json(prepareError('Field not found'), 404);
            }

            return c.json(prepareSuccess(deletedField));
        } catch (error) {
            return c.json(prepareError('Failed to delete booking form field'), 500);
        }
    },
);
