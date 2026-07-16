import { z } from 'zod';

export const step1Schema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(255),
    organizationId: z.uuid(),
});
