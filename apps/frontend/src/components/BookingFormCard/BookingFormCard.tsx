import { type FC } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    return (
        <div className={styles.bookingFormCard}>
            <h3>{bookingForm.name}</h3>
            <p>{bookingForm.description}</p>
        </div>
    );
};