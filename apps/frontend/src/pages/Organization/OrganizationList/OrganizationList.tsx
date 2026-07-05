import { useEffect, type FC } from 'react';
import styles from './OrganizationList.module.scss';

import { OrganizationItem } from '@components/OrganizationItem/OrganizationItem';
import { useGetOrganizationsByUserId } from '@api/organizations/getOrganizationsByUserId';
import { Spinner } from '@components/Spinner/Spinner';

import { toast } from 'react-hot-toast';

export const OrganizationList: FC = () => {
    const { data, isLoading, isError } = useGetOrganizationsByUserId();

    useEffect(() => {
        if (isError) {
            toast.error('Failed to load organizations');
        }
    });

    if (isLoading)
        return (
            <div className={styles.container}>
                <Spinner size={6} />
            </div>
        );

    if (data?.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.message}>You haven't any Organizations yet</h2>
            </div>
        );
    }

    return (
        <div className={styles.organizationList}>
            {data &&
                data.length > 0 &&
                data?.map((item) => (
                    <OrganizationItem
                        key={item.id}
                        organizationName={item.name}
                        organizationId={item.id}
                        createdAt={item.createdAt}
                        role={item.role}
                    />
                ))}
        </div>
    );
};
