import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import * as schema from '@bookio/db';
import { db } from './db.js';
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL, ENVIRONMENT, TRUSTED_ORIGINS } from '@/utils/constants.js';


export const auth = betterAuth({
    secret: BETTER_AUTH_SECRET!,
    baseURL: BETTER_AUTH_URL!,
    trustedOrigins: TRUSTED_ORIGINS?.split(',').map((origin) => origin.trim()),
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
        schema: {
            users: schema.users,
            sessions: schema.sessions,
            accounts: schema.accounts,
            verifications: schema.verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: false,
        },
        disableOriginCheck: ENVIRONMENT === 'development',
    },
    user: {
        deleteUser: {
            enabled: true
        }
    }
});
