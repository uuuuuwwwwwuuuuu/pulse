import { type FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import styles from './OrganizationLayout.module.scss';
import { OrganizationHeader } from '@components/OrganizationHeader/OrganizationHeader';
import { OrganizationSearch } from '@components/OrganizationSearch/OrganizationSearch';
import { OrganizationList } from '@pages/Organization/OrganizationList/OrganizationList';
import { OrganizationAccessLayout } from '@pages/Organization/OrganizationAccess';

const FADE_MS = 480;

export const OrganizationLayout: FC = () => {
    const { pathname } = useLocation();
    const isAccess = pathname.endsWith('/create') || pathname.endsWith('/connect');
    const [holdAccess, setHoldAccess] = useState(isAccess);
    const [accessVisible, setAccessVisible] = useState(false);
    const showAccess = isAccess || holdAccess;

    useEffect(() => {
        if (isAccess) {
            setHoldAccess(true);

            // Double rAF: paint opacity 0 first, then transition to visible.
            let raf2 = 0;
            const raf1 = window.requestAnimationFrame(() => {
                raf2 = window.requestAnimationFrame(() => setAccessVisible(true));
            });

            return () => {
                window.cancelAnimationFrame(raf1);
                window.cancelAnimationFrame(raf2);
            };
        }

        setAccessVisible(false);
        const timer = window.setTimeout(() => setHoldAccess(false), FADE_MS);
        return () => window.clearTimeout(timer);
    }, [isAccess]);

    return (
        <div className={styles.organizationLayout}>
            <OrganizationHeader />
            <div className={styles.content}>
                <div
                    className={clsx(styles.layer, !isAccess && styles.visible)}
                    inert={isAccess || undefined}
                >
                    <OrganizationList />
                </div>
                {showAccess ? (
                    <div
                        className={clsx(styles.layer, accessVisible && styles.visible)}
                        inert={!isAccess || undefined}
                    >
                        <OrganizationAccessLayout />
                    </div>
                ) : null}
            </div>
            <OrganizationSearch />
        </div>
    );
};
