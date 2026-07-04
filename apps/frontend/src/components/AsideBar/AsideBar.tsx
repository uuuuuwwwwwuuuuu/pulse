import type { FC } from 'react';
import styles from './AsideBar.module.scss';

export const AsideBar: FC = () => {
    return (
        <aside className={styles.asideBar}>
            <h1>AsideBar</h1>
        </aside>
    );
};