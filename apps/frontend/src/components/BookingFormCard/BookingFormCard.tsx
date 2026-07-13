import { type FC } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { Button, Checkbox } from '@bookio/ui';

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    return (
        <div className={styles.bookingFormCard}>
            <div className={styles.bookingFormCardGroup}>
                <h3>{bookingForm.name}</h3>
                <p>{bookingForm.description}</p>
            </div>
            <div className={styles.bookingFormCardGroup}>
                <span className={styles.bookingFormCardTotalBookings}>
                    Total bookings in this month: {bookingForm.totalBookings}
                </span>
            </div>
            <div className={styles.bookingFormCardGroup}>
                <Checkbox label="Is active booking form" checked={bookingForm.isActive} />
            </div>
            <div className={styles.bookingFormCardGroup}>
                <Button variant="blue-clean" type="link" to="create">
                    Edit
                </Button>
                <Button variant="red-clean" type="link" to="create">
                    Delete
                </Button>
            </div>
        </div>
    );
};
