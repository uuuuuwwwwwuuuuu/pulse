import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import styles from './BookingFormConfigurator.module.scss';

export const BookingFormConfigurator: FC = () => {
    const { bookingFormId } = useParams();

    return (
        <div className={styles.bookingFormConfigurator}>
            <div className={styles.configuratorContainer}>

            </div>
            <div className={styles.configuratorPreview}>
                
            </div>
        </div>
    );
};
