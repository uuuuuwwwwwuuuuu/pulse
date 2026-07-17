import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/db.js';
import { bookingForms, bookingFormStyles, bookingFormMetaData } from '@bookio/db';
import { prepareError, prepareSuccess } from '@/utils/prepareResponse.js';
import { isBookingFormExists } from '@/utils/isBookingFormExists.js';

const factory = createFactory().createHandlers;

const createBookingFormSchema = z.object({
    organizationId: z.uuid(),
    name: z.string().min(1).max(255),
    description: z.string().optional().nullable(),
    slug: z.string().min(1).max(60),
    primary: z.string().min(1),
    bgMain: z.string().min(1),
    bgSecondary: z.string().min(1),
    borderColor: z.string().min(1),
    textMain: z.string().min(1),
    textSecondary: z.string().min(1),
    metaTitle: z.string().min(1),
    metaDescription: z.string().min(1),
    additionalMeta: z.array(
        z.object({
            key: z.string().min(1),
            value: z.string().min(1),
        }),
    ),
});

export const createBookingFormHandler = factory(
    zValidator('json', createBookingFormSchema),
    async (c) => {
        try {
            const {
                organizationId,
                name,
                description,
                slug,
                primary,
                bgMain,
                bgSecondary,
                borderColor,
                textMain,
                textSecondary,
                metaTitle,
                metaDescription,
                additionalMeta,
            } = c.req.valid('json');

            const existingByName = await isBookingFormExists({ name, organizationId });

            if (existingByName) {
                return c.json(prepareError('Booking form with this name already exists'), 400);
            }

            const existingBySlug = await isBookingFormExists({ slug, organizationId });

            if (existingBySlug) {
                return c.json(prepareError('Booking form with this slug already exists'), 400);
            }

            const bookingForm = await db.transaction(async (tx) => {
                const [createdForm] = await tx
                    .insert(bookingForms)
                    .values({
                        slug,
                        name,
                        description,
                        organizationId,
                    })
                    .returning();

                if (!createdForm) {
                    throw new Error('Failed to create booking form');
                }

                await tx.insert(bookingFormStyles).values({
                    bookingFormId: createdForm.id,
                    primary,
                    bgMain,
                    bgSecondary,
                    borderColor,
                    textMain,
                    textSecondary,
                });

                await tx.insert(bookingFormMetaData).values({
                    bookingFormId: createdForm.id,
                    title: metaTitle,
                    description: metaDescription,
                    additionalMetaData: Object.fromEntries(
                        additionalMeta.map(({ key, value }) => [key, value]),
                    ),
                });

                return createdForm;
            });

            return c.json(prepareSuccess(bookingForm));
        } catch (error) {
            return c.json(prepareError('Failed to create booking form'), 500);
        }
    },
);
