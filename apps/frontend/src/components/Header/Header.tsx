import type { FC } from 'react';
import styles from './Header.module.scss';
import Logo from '@assets/logo.svg?react';
import { Button } from '@bookio/ui';
import { clsx } from 'clsx';

import ConnectIcon from '@assets/icons/connect.svg?react';
import PlusIcon from '@assets/icons/plus.svg?react';

interface HeaderProps {
    variant?: 'default' | 'organization';
}

export const Header: FC<HeaderProps> = ({ variant = 'default' }) => {
    if (variant === 'organization') {
        return (
            <header className={styles.header}>
                <Logo className={styles.logo} />
                <div className={styles.buttonsWrapper}>
                    <Button
                        type="link"
                        to="/organization/connect"
                        variant="clean"
                        className={styles.button}
                    >
                        <ConnectIcon />
                        Connect
                    </Button>
                    <Button
                        type="link"
                        to="/organization/create"
                        variant="primary-filled"
                        className={clsx(styles.button, styles.addButton)}
                    >
                        <PlusIcon />
                        Create
                    </Button>
                </div>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <Logo className={styles.logo} />
        </header>
    );
};
