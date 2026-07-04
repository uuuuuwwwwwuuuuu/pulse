import { useSession } from '@api/auth';
import hono from '@lib/hono-client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { InferResponseType } from 'hono/client';

export type OrganizationsResponse = InferResponseType<typeof hono.organizations.$get, 200>;

const fetchOrganizationsByUserId = async (userId: string): Promise<OrganizationsResponse> => {
    const response = await hono.organizations.$get({
        query: { userId },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch organizations');
    }

    return response.json();
};

export const useGetOrganizationsByUserId = (): UseQueryResult<OrganizationsResponse> => {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['organizations', session?.user?.id],
        enabled: !!session?.user?.id,
        queryFn: () => fetchOrganizationsByUserId(session!.user.id),
    });
};
