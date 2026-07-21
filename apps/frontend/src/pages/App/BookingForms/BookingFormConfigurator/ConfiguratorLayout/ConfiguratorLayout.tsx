import { Children, isValidElement, memo, type FC, type ReactNode } from 'react';

import PanelLeftCloseIcon from '@assets/icons/panel-left-close.svg?react';

import { configuratorTabs, type ConfiguratorTabValue } from '../configuratorTabs';
import { useBookingFormConfigurator } from '../BookingFormConfiguratorContext';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabs } from './ConfiguratorTabs';

const ConfiguratorHeader: FC<{ activeTab: ConfiguratorTabValue }> = memo(({ activeTab }) => {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>
                {configuratorTabs.find((tab) => tab.value === activeTab)?.content}
            </h2>
            <button type="button" className={styles.collapseButton} aria-label="Collapse panel">
                <PanelLeftCloseIcon />
            </button>
        </div>
    );
});

const ConfiguratorContent: FC<{ children?: ReactNode }> = ({ children }) => {
    return <div className={styles.content}>{children}</div>;
};

const ConfiguratorFooter: FC<{ children?: ReactNode }> = ({ children }) => {
    return <div className={styles.footer}>{children}</div>;
};

const CONFIGURATOR_CONTENT_DISPLAY_NAME = 'ConfiguratorContent';
const CONFIGURATOR_FOOTER_DISPLAY_NAME = 'ConfiguratorFooter';

ConfiguratorContent.displayName = CONFIGURATOR_CONTENT_DISPLAY_NAME;
ConfiguratorFooter.displayName = CONFIGURATOR_FOOTER_DISPLAY_NAME;

const displayNamesToAllow = [
    CONFIGURATOR_CONTENT_DISPLAY_NAME,
    CONFIGURATOR_FOOTER_DISPLAY_NAME,
];

function ConfiguratorLayout({ children }: { children?: ReactNode }) {
    const { activeTab, setActiveTab } = useBookingFormConfigurator();

    const slots: Record<string, ReactNode> = {};

    Children.toArray(children).forEach((child) => {
        if (isValidElement(child)) {
            const displayName = (child.type as { displayName?: string }).displayName;

            if (displayName && displayNamesToAllow.includes(displayName)) {
                slots[displayName] = child;
            }
        }
    });

    return (
        <div className={styles.configuratorContainer}>
            <div className={styles.tabs}>
                <ConfiguratorTabs
                    tabs={configuratorTabs}
                    activeTab={activeTab}
                    onActiveTabChange={setActiveTab}
                />
            </div>
            <ConfiguratorHeader activeTab={activeTab} />
            {slots[CONFIGURATOR_CONTENT_DISPLAY_NAME]}
            {slots[CONFIGURATOR_FOOTER_DISPLAY_NAME]}
        </div>
    );
}

type ConfiguratorLayoutComponent = typeof ConfiguratorLayout & {
    Content: typeof ConfiguratorContent;
    Footer: typeof ConfiguratorFooter;
};

const ConfiguratorLayoutWithSubcomponents = memo(
    ConfiguratorLayout,
) as unknown as ConfiguratorLayoutComponent;
ConfiguratorLayoutWithSubcomponents.Content = ConfiguratorContent;
ConfiguratorLayoutWithSubcomponents.Footer = ConfiguratorFooter;

export { ConfiguratorLayoutWithSubcomponents as ConfiguratorLayout };
