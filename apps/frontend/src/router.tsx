import { createBrowserRouter } from 'react-router-dom';
import { lazyRoute } from '@lib/lazy-route';
import { MainLayout } from '@layouts/MainLayout/MainLayout';
import { PageLoader } from '@components/PageLoader/PageLoader';

export const router = createBrowserRouter([
    {
        hydrateFallbackElement: <PageLoader />,
        children: [
            {
                path: '/auth',
                lazy: lazyRoute(() => import('@layouts/AuthLayout/AuthLayout'), 'AuthLayout'),
                children: [
                    {
                        path: 'sign-up',
                        lazy: lazyRoute(() => import('@pages/Auth/SignUp/SignUp'), 'SignUp'),
                    },
                    {
                        path: 'sign-in',
                        lazy: lazyRoute(() => import('@pages/Auth/SignIn/SignIn'), 'SignIn'),
                    },
                ],
            },
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    {
                        path: 'organization',
                        lazy: lazyRoute(
                            () => import('@layouts/OrganizationLayout/OrganizationLayout'),
                            'OrganizationLayout',
                        ),
                        children: [
                            {
                                path: 'list',
                                lazy: lazyRoute(
                                    () => import('@pages/Organization/OrganizationList/OrganizationList'),
                                    'OrganizationList',
                                ),
                            },
                            {
                                path: 'create',
                                lazy: lazyRoute(
                                    () => import('@pages/Organization/CreateOrganization/CreateOrganization'),
                                    'CreateOrganization',
                                ),
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
