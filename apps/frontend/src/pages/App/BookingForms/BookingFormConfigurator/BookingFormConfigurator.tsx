import type { FC } from 'react';

import {
    BookingFormConfiguratorProvider,
    useBookingFormConfigurator,
} from './BookingFormConfiguratorContext';
import { ConfiguratorLayout } from './ConfiguratorLayout/ConfiguratorLayout';
import styles from './BookingFormConfigurator.module.scss';
import { SettingsTab } from './ConfiguratorTabs/SettingsTab';

const configuratorTabs = {
    settings: <SettingsTab />,
};

const BookingFormConfiguratorContent: FC = () => {
    const { activeTab } = useBookingFormConfigurator();

    return (
        <div className={styles.bookingFormConfigurator}>
            <ConfiguratorLayout>
                {configuratorTabs[activeTab as keyof typeof configuratorTabs]}
            </ConfiguratorLayout>
            <div className={styles.configuratorPreview}></div>
        </div>
    );
};

export const BookingFormConfigurator: FC = () => {
    return (
        <BookingFormConfiguratorProvider>
            <BookingFormConfiguratorContent />
        </BookingFormConfiguratorProvider>
    );
};
