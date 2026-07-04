import { type FC, Suspense } from "react";
import { Outlet } from "react-router-dom";
import styles from './OrganizationLayout.module.scss';
import { Header } from "@components/Header/Header";
import { PageLoader } from "@components/PageLoader/PageLoader";

export const OrganizationLayout: FC = () => {
    return (
        <div className={styles.organizationLayout}>
            <Header variant='organization' />
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
};