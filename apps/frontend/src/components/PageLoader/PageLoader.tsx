import type { FC } from 'react';
import styles from './PageLoader.module.scss';

export const PageLoader: FC = () => {
    return (
        <div className={styles.pageLoader} role="status" aria-label="Loading">
            <div className={styles.spinner} />
        </div>
    );
};
