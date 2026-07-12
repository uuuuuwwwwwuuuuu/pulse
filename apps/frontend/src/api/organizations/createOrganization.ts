import hono from '@lib/hono-client';
import { queryClient } from '@lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { parseError } from '@utils/parseError';
import type { InferRequestType, InferResponseType } from 'hono/client';

export type CreateOrganizationRequest = InferRequestType<
    typeof hono.organizations.create.$post
>['json'];
export type CreateOrganizationResponse = InferResponseType<
    typeof hono.organizations.create.$post,
    200
>;

const createOrganizationRequest = async (requestData: CreateOrganizationRequest) => {
    const response = await hono.organizations.create.$post({
        json: requestData,
    });

    const body = await response.json();

    if (!response.ok) {
        if (!body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to create organization');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body;
};

export const useCreateOrganization = () => {
    return useMutation({
        mutationFn: createOrganizationRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
        },
    });
};
