import type { FC, ReactNode } from 'react';
import styles from './BookingFormConfiguratorLayout.module.scss';

type BookingFormConfiguratorLayoutProps = {
    stepNumber: number;
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
};

export const BookingFormConfiguratorLayout: FC<BookingFormConfiguratorLayoutProps> = ({
    stepNumber,
    title,
    description,
    children,
    footer,
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.configurator}>
                <div className={styles.header}>
                    <span className={styles.stepNumber}>{stepNumber}</span>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.fields}>{children}</div>

                {footer ? <div className={styles.footer}>{footer}</div> : null}
            </div>
        </div>
    );
};
