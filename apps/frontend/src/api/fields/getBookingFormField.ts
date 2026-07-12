import hono from '@lib/hono-client';
import { parseError } from '@utils/parseError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getBookingFormFieldClient = hono.fields['get-one'];

export type GetBookingFormFieldResponse = InferResponseType<
    typeof getBookingFormFieldClient.$get,
    200
>;
export type BookingFormFieldType = GetBookingFormFieldResponse['data'];

export const fetchBookingFormField = async (
    bookingFormFieldId: string,
): Promise<BookingFormFieldType> => {
    const response = await getBookingFormFieldClient.$get({
        query: {
            bookingFormFieldId,
        },
    });

    const body = await response.json();

    if (!response.ok) {
        if ('success' in body && !body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to get booking form field');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body.data;
};

export const useGetBookingFormField = (
    bookingFormFieldId: string | undefined,
): UseQueryResult<BookingFormFieldType> => {
    return useQuery<BookingFormFieldType>({
        queryKey: ['booking-form-field', bookingFormFieldId],
        queryFn: () => fetchBookingFormField(bookingFormFieldId!),
        enabled: !!bookingFormFieldId,
    });
};
