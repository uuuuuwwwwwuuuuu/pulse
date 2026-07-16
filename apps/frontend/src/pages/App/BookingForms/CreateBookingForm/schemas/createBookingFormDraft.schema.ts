import { z } from 'zod';

export const step1Schema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(255),
    organizationId: z.uuid(),
});

export const step2Schema = z.object({
    slug: z
        .string()
        .min(1)
        .max(60)
        .regex(/^[a-z0-9][a-z0-9-_]*$/, {
            message:
                'Slug must use only lowercase English letters, numbers, hyphens, and underscores (no spaces)',
        }),
});
