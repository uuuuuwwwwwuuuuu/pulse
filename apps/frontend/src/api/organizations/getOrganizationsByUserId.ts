import { useSession } from '@api/auth';
import hono from '@lib/hono-client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { parseError } from '@utils/parseError';
import type { InferResponseType } from 'hono/client';

export type OrganizationsResponse200 = InferResponseType<typeof hono.organizations.$get, 200>;
export type OrganizationsType = OrganizationsResponse200['data'];
export type OrganizationType = OrganizationsType[number];

const fetchOrganizationsByUserId = async (userId: string) => {
    const response = await hono.organizations.$get({
        query: { userId },
    });

    const body = await response.json();

    if (!response.ok) {
        if (!body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to fetch organizations');
    }

    return body;
};

export const useGetOrganizationsByUserId = (): UseQueryResult<OrganizationsResponse200> => {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['organizations', session?.user?.id],
        enabled: !!session?.user?.id,
        queryFn: () => fetchOrganizationsByUserId(session!.user.id),
    });
};
