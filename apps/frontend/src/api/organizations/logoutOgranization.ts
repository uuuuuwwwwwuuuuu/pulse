import { useSession } from '@api/auth';
import hono from '@lib/hono-client';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@lib/query-client';
import type { InferRequestType, InferResponseType } from 'hono/client';

export type LogoutOrganizationRequest = InferRequestType<
    typeof hono.organizations.logout.$post
>['json'];
export type LogoutOrganizationResponse = InferResponseType<
    typeof hono.organizations.logout.$post,
    200
>;

const logoutOrganization = async ({
    userId,
    organizationId,
    organizationPassword,
}: LogoutOrganizationRequest) => {
    const response = await hono.organizations.logout.$post({
        json: {
            userId,
            organizationId,
            organizationPassword,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to logout organization');
    }
};

export const useLogoutOrganization = () => {
    const { data: session } = useSession();

    return useMutation({
        mutationFn: (data: Omit<LogoutOrganizationRequest, 'userId'>) =>
            logoutOrganization({ ...data, userId: session!.user.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
};
