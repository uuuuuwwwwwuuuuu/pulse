import hono from '@lib/hono-client';
import { parseError } from '@utils/parseError';
import type { InferResponseType, InferRequestType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useSession } from '@api/auth';

export type GetOrganizationDataResponse = InferResponseType<
    typeof hono.organizations.data.$get,
    200
>;
export type OrganizationData = GetOrganizationDataResponse['data'];
export type GetOrganizationDataRequest = InferRequestType<typeof hono.organizations.data.$get>;

const getOrganizationData = async (
    organizationId: string,
    userId: string,
): Promise<GetOrganizationDataResponse> => {
    const response = await hono.organizations.data.$get({
        query: {
            organizationId,
            userId,
        },
    });

    const body = await response.json();

    if (!response.ok) {
        if (!body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to get organization data');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body;
};

export const useGetOrganization = (
    organizationId: string | undefined,
): UseQueryResult<GetOrganizationDataResponse> => {
    const { data: session } = useSession();
    return useQuery<GetOrganizationDataResponse>({
        queryKey: ['organization', organizationId],
        queryFn: () => getOrganizationData(organizationId!, session!.user.id),
        enabled: !!session && !!organizationId,
    });
};
