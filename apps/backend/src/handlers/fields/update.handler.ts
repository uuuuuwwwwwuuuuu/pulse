import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { bookingFormFields, fieldTypeValues, type BookingFormFieldUpdate } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { eq } from 'drizzle-orm';

const factory = createFactory().createHandlers;

const updateBookingFormFieldSchema = z
    .object({
        bookingFormId: z.uuid(),
        name: z.string().min(1).max(255).optional(),
        type: z.enum(fieldTypeValues).optional(),
        required: z.boolean().optional(),
        key: z.string().min(1).max(255).regex(/^\S+$/, 'Key must not contain spaces').optional(),
        parentId: z.uuid().optional().nullable(),
        order: z.number().int().min(0).optional(),
    })
    .refine((data) => Object.values(data).some((value) => value !== undefined), {
        message: 'At least one field must be provided',
    }) satisfies z.ZodType<BookingFormFieldUpdate>;

export const updateBookingFormFieldHandler = factory(
    zValidator('json', updateBookingFormFieldSchema),
    async (c) => {
        try {
            const { name, type, required, key, parentId, order, bookingFormId } =
                c.req.valid('json');

            const [existingField] = await db
                .select()
                .from(bookingFormFields)
                .where(eq(bookingFormFields.bookingFormId, bookingFormId));

            if (!existingField) {
                return c.json(prepareError('Field not found'));
            }

            const [updatedField] = await db
                .update(bookingFormFields)
                .set({ name, type, required, key, parentId, order })
                .where(eq(bookingFormFields.id, existingField.id))
                .returning();

            if (!updatedField) {
                return c.json(prepareError('Failed to update booking form field'));
            }

            return c.json(prepareSuccess('Booking form field updated'));
        } catch (error) {
            return c.json(prepareError('Failed to update booking form field'));
        }
    },
);
