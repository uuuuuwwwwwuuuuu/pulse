import { db } from '@/db.js';
import { members } from '@bookio/db';
import { and, eq } from 'drizzle-orm';

export const getMemberByOrgAndUserId = async (organizationId: string, userId: string) => {
    const [member] = await db
        .select()
        .from(members)
        .where(and(eq(members.organizationId, organizationId), eq(members.userId, userId)));
    return member;
};
