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
    const stepLabel = String(stepNumber).padStart(2, '0');

    return (
        <div className={styles.wrapper}>
            <div className={styles.configurator}>
                <aside className={styles.rail}>
                    <span className={styles.stepBadge}>Step {stepLabel}</span>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                </aside>

                <div className={styles.stage}>
                    <div className={styles.fields}>{children}</div>
                    {footer ? <div className={styles.footer}>{footer}</div> : null}
                </div>
            </div>
        </div>
    );
};
