import { useCallback, useMemo, useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PanelFormLayout } from '@components/PanelFormLayout/PanelFormLayout';
import { CreateOrganization } from '../CreateOrganization/CreateOrganization';
import { ConnectOrganization } from '../ConnectOrganization/ConnectOrganization';
import {
    MODE_META,
    OrganizationAccessProvider,
    type OrganizationAccessMeta,
    type OrganizationAccessMode,
} from './OrganizationAccessContext';

const resolveMode = (pathname: string): OrganizationAccessMode =>
    pathname.endsWith('/create') ? 'create' : 'connect';

export const OrganizationAccessLayout: FC = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const mode = resolveMode(pathname);
    const [metaOverride, setMetaOverride] = useState<OrganizationAccessMeta | null>(null);

    const setMeta = useCallback((meta: OrganizationAccessMeta | null) => {
        setMetaOverride(meta);
    }, []);

    const switchMode = useCallback(
        (nextMode: OrganizationAccessMode) => {
            setMetaOverride(null);
            navigate(`/organizations/${nextMode}`, { replace: true });
        },
        [navigate],
    );

    const meta = metaOverride ?? MODE_META[mode];
    const contentKey = metaOverride ? 'success' : mode;

    const contextValue = useMemo(
        () => ({ mode, switchMode, setMeta }),
        [mode, switchMode, setMeta],
    );

    return (
        <OrganizationAccessProvider value={contextValue}>
            <PanelFormLayout
                badge={meta.badge}
                title={meta.title}
                description={meta.description}
                contentKey={contentKey}
            >
                {mode === 'create' ? <CreateOrganization /> : <ConnectOrganization />}
            </PanelFormLayout>
        </OrganizationAccessProvider>
    );
};
