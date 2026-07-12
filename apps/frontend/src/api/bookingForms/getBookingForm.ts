import hono from '@lib/hono-client';
import { parseError } from '@utils/parseError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getBookingFormClient = hono['booking-forms']['get-one'];

export type GetBookingFormResponse = InferResponseType<typeof getBookingFormClient.$get, 200>;
export type BookingFormType = GetBookingFormResponse['data'];

export const fetchBookingForm = async (bookingFormId: string): Promise<BookingFormType> => {
    const response = await getBookingFormClient.$get({
        query: {
            bookingFormId,
        },
    });

    const body = await response.json();

    if (!response.ok) {
        if ('success' in body && !body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to get booking form');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body.data;
};

export const useGetBookingForm = (
    bookingFormId: string | undefined,
): UseQueryResult<BookingFormType> => {
    return useQuery<BookingFormType>({
        queryKey: ['booking-form', bookingFormId],
        queryFn: () => fetchBookingForm(bookingFormId!),
        enabled: !!bookingFormId,
    });
};
