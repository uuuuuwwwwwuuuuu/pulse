import type { FC } from 'react';

import {
    BookingFormConfiguratorProvider,
    useBookingFormConfigurator,
} from './BookingFormConfiguratorContext';
import { ConfiguratorLayout } from './ConfiguratorLayout/ConfiguratorLayout';
import { getConfiguratorTab } from './configuratorTabs';
import styles from './BookingFormConfigurator.module.scss';

const BookingFormConfiguratorContent: FC = () => {
    const { activeTab } = useBookingFormConfigurator();
    const tab = getConfiguratorTab(activeTab);
    const Panel = tab?.Panel;
    const Footer = tab?.Footer;

    return (
        <div className={styles.bookingFormConfigurator}>
            <ConfiguratorLayout>
                <ConfiguratorLayout.Content>
                    {Panel ? <Panel /> : null}
                </ConfiguratorLayout.Content>
                <ConfiguratorLayout.Footer>
                    {Footer ? <Footer /> : null}
                </ConfiguratorLayout.Footer>
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
