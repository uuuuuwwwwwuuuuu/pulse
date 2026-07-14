import hono from '@lib/hono-client';
import { queryClient } from '@lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { parseError } from '@utils/parseError';
import type { InferRequestType, InferResponseType } from 'hono/client';

const deleteBookingFormClient = hono['booking-forms']['delete'];

export type DeleteBookingFormRequest = InferRequestType<
    typeof deleteBookingFormClient.$delete
>['json'];

export type DeleteBookingFormResponse = InferResponseType<
    typeof deleteBookingFormClient.$delete,
    200
>;

const deleteBookingFormRequest = async (requestData: DeleteBookingFormRequest) => {
    const response = await deleteBookingFormClient.$delete({
        json: requestData,
    });

    const body = await response.json();

    if (!response.ok) {
        if (!body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to delete booking form');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body.data;
};

export const useDeleteBookingForm = (bookingFormId: string | undefined) => {
    return useMutation({
        mutationFn: deleteBookingFormRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-forms'] });
            queryClient.invalidateQueries({ queryKey: ['booking-form', bookingFormId] });
        },
    });
};
