import { createContext, useContext, type FC, type ReactNode } from 'react';

export type OrganizationAccessMode = 'create' | 'connect';

export type OrganizationAccessMeta = {
    badge: string;
    title: string;
    description: string;
};

export const MODE_META: Record<OrganizationAccessMode, OrganizationAccessMeta> = {
    create: {
        badge: 'Create',
        title: 'Create your organization',
        description:
            'Set a name, unique slug, and password. The slug will identify your organization across Bookio.',
    },
    connect: {
        badge: 'Connect',
        title: 'Connect to an organization',
        description: 'Enter the organization slug and password to join an existing workspace.',
    },
};

type OrganizationAccessContextValue = {
    mode: OrganizationAccessMode;
    switchMode: (mode: OrganizationAccessMode) => void;
    setMeta: (meta: OrganizationAccessMeta | null) => void;
};

const OrganizationAccessContext = createContext<OrganizationAccessContextValue | null>(null);

export const OrganizationAccessProvider: FC<{
    value: OrganizationAccessContextValue;
    children: ReactNode;
}> = ({ value, children }) => (
    <OrganizationAccessContext.Provider value={value}>{children}</OrganizationAccessContext.Provider>
);

export const useOrganizationAccess = () => {
    const context = useContext(OrganizationAccessContext);
    if (!context) {
        throw new Error('useOrganizationAccess must be used within OrganizationAccessLayout');
    }
    return context;
};
