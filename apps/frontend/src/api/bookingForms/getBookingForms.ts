import hono from '@lib/hono-client';
import { parseError } from '@utils/parseError';
import type { InferResponseType } from 'hono/client';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

const getBookingFormsClient = hono['booking-forms']['get-all'];

export type GetBookingFormsResponse = InferResponseType<typeof getBookingFormsClient.$get, 200>;
export type BookingFormsType = GetBookingFormsResponse['data'];
export type BookingFormType = BookingFormsType[number];

const fetchBookingForms = async (organizationId: string): Promise<BookingFormsType> => {
    const response = await getBookingFormsClient.$get({
        query: { organizationId },
    });

    const body = await response.json();

    if (!response.ok) {
        if ('success' in body && !body.success) {
            throw new Error(parseError(body));
        }
        throw new Error('Failed to get booking forms');
    }

    if (!body.success) {
        throw new Error(parseError(body));
    }

    return body.data;
};

export const useGetBookingForms = (
    organizationId: string | undefined,
): UseQueryResult<BookingFormsType> => {
    return useQuery<BookingFormsType>({
        queryKey: ['booking-forms', organizationId],
        queryFn: () => fetchBookingForms(organizationId!),
        enabled: !!organizationId,
    });
};
