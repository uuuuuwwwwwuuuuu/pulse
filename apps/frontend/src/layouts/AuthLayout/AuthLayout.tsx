import { type FC, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@api/auth';
import { PageLoader } from '@components/PageLoader/PageLoader';
import styles from './AuthLayout.module.scss';

export const AuthLayout: FC = () => {
    const { data: session, isPending } = useSession();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isPending && session) {
            if (location.pathname === '/auth/sign-in') {
                navigate('/', { replace: true });
            } else if (location.pathname === '/auth/sign-up') {
                navigate('/organization', { replace: true });
            }
        }
    }, [session, isPending, navigate, location.pathname]);

    if (isPending) {
        return null;
    }

    return (
        <div className={styles.authLayout}>
            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    );
};
