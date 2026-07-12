import hono from '@lib/hono-client';
import { parseError } from '@utils/parseError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getBookingFormWithFieldsClient = hono['booking-forms']['get-one-with-fields'];

export type GetBookingFormWithFieldsResponse = InferResponseType<
    typeof getBookingFormWithFieldsClient.$get,
    200
>;
export type BookingFormWithFieldsType = GetBookingFormWithFieldsResponse['data'];

const fetchBookingFormWithFields = async (
    bookingFormId: string,
): Promise<GetBookingFormWithFieldsResponse> => {
    const response = await getBookingFormWithFieldsClient.$get({
        query: {
            bookingFormId,
        },
    });

    const body = await response.json();

    if (!response.ok) {
        if ('success' in body && !body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to get booking form with fields');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body;
};

export const useGetBookingFormWithFields = (
    bookingFormId: string | undefined,
): UseQueryResult<GetBookingFormWithFieldsResponse> => {
    return useQuery<GetBookingFormWithFieldsResponse>({
        queryKey: ['booking-form-with-fields', bookingFormId],
        queryFn: () => fetchBookingFormWithFields(bookingFormId!),
        enabled: !!bookingFormId,
    });
};
