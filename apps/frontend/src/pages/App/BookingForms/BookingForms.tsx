import { type FC } from 'react';
import styles from './BookingForms.module.scss';
import { useGetBookingForms } from '@api/bookingForms/getBookingForms';
import { useGetOrganization } from '@api/organizations/getOrganizationData';

export const BookingForms: FC = () => {
    const {} = useGetOrganization();
    const { data: bookingForms, isPending } = useGetBookingForms();

    return <div className={styles.bookingForms}></div>;
};
