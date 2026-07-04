import type { FC } from 'react';
import styles from './OrganizationItem.module.scss';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PlaceholderImage from '@assets/images/OrganizationPlaceholder.webp';

interface OrganizationItemProps {
    organizationName: string;
    organizationId: string;
    imageUrl?: string;
    createdAt: string;
    // add roles here
}

export const OrganizationItem: FC<OrganizationItemProps> = ({
    organizationName,
    createdAt,
    organizationId,
    imageUrl,
}) => {
    return (
        <div className={styles.organizationItem}>
            <img src={imageUrl || PlaceholderImage} alt={organizationName} />
            <div className={styles.organizationInfo}>
                <h3>{organizationName}</h3>
                <span>{format(new Date(createdAt), 'dd/MM/yyyy', { locale: ru })}</span>
            </div>
        </div>
    );
};
