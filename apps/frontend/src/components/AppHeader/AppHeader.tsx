import { useState, type FC } from 'react';
import styles from './AppHeader.module.scss';
import Logo from '@assets/logo.svg?react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from '@bookio/ui';

import ConnectIcon from '@assets/icons/connect.svg?react';
import TrashIcon from '@assets/icons/trash.svg?react';
import { useGetOrganizationData } from '@api/organizations/getOrganizationData';

import ArrowIcon from '@assets/icons/short-arrow.svg?react';

import PlaceholderImage from '@assets/images/OrganizationPlaceholder.webp';

export const AppHeader: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: organizationData } = useGetOrganizationData(id);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={styles.appHeader}>
            <button className={styles.logoButton} onClick={() => navigate(`/${id}`)}>
                <Logo className={styles.logo} />
            </button>
            <div className={styles.dropdown}>
                <Dropdown open={isMenuOpen} onOpenChange={setIsMenuOpen} placement="bottom">
                    <Dropdown.Trigger className={styles.menuTrigger}>
                        <img src={PlaceholderImage} alt="Organization image" className={styles.menuItemImage} />
                        <div className={styles.menuItemText}>{organizationData?.data?.name}</div>
                        <ArrowIcon className={styles.arrowIcon} />
                    </Dropdown.Trigger>
                    <Dropdown.Content className={styles.dropdownContent}>
                        <Dropdown.Item
                            className={styles.menuItem}
                            onClick={() => navigate(`/${id}`)}
                        >
                            <ConnectIcon className={styles.menuItemIcon} />
                            Home
                        </Dropdown.Item>
                        <Dropdown.Item
                            className={styles.menuItem}
                            onClick={() => navigate('/organizations')}
                        >
                            <TrashIcon className={styles.menuItemIcon} />
                            Organizations
                        </Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
};