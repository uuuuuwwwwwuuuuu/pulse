import type { FC } from "react";
import styles from './OrganizationList.module.scss';
import { OrganizationItem } from "@components/OrganizationItem/OrganizationItem";

export const OrganizationList: FC = () => {
    return (
        <div className={styles.organizationList}>
            <OrganizationItem
                organizationName="Organization 1"
                organizationId="1"
                createdAt="2021-01-01"
            />
        </div>
    );
};