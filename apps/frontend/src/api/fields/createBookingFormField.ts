import hono from '@lib/hono-client';
import { queryClient } from '@lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { parseError } from '@utils/parseError';
import type { InferRequestType, InferResponseType } from 'hono/client';

export type CreateBookingFormFieldRequest = InferRequestType<
    typeof hono.fields.create.$post
>['json'];
export type CreateBookingFormFieldResponse = InferResponseType<
    typeof hono.fields.create.$post,
    200
>;

const createBookingFormFieldRequest = async (requestData: CreateBookingFormFieldRequest) => {
    const response = await hono.fields.create.$post({
        json: requestData,
    });

    const body = await response.json();

    if (!response.ok) {
        if (!body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to create booking form field');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body;
};

export const useCreateBookingFormField = () => {
    return useMutation({
        mutationFn: createBookingFormFieldRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-form-fields'] });
            queryClient.invalidateQueries({ queryKey: ['booking-form-with-fields'] });
        },
    });
};
