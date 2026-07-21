import type { ComponentType, ReactNode } from 'react';

import SettingsIcon from '@assets/icons/settings.svg?react';
import FieldsIcon from '@assets/icons/fields.svg?react';
import StylesIcon from '@assets/icons/styles.svg?react';

import { SettingsTab, SettingsTabFooter } from './ConfiguratorTabs/SettingsTab';

export const CONFIGURATOR_TAB_VALUES = ['settings', 'fields', 'styles'] as const;

export type ConfiguratorTabValue = (typeof CONFIGURATOR_TAB_VALUES)[number];

type ConfiguratorTabConfig = {
    value: ConfiguratorTabValue;
    content: string;
    icon: ReactNode;
    Panel?: ComponentType;
    Footer?: ComponentType;
};

export const configuratorTabs: ConfiguratorTabConfig[] = [
    {
        value: 'settings',
        content: 'Basic settings',
        icon: <SettingsIcon />,
        Panel: SettingsTab,
        Footer: SettingsTabFooter,
    },
    {
        value: 'fields',
        content: 'Fields',
        icon: <FieldsIcon />,
    },
    {
        value: 'styles',
        content: 'Styles',
        icon: <StylesIcon />,
    },
];

export const DEFAULT_CONFIGURATOR_TAB: ConfiguratorTabValue = 'settings';

export const getConfiguratorTab = (value: ConfiguratorTabValue) =>
    configuratorTabs.find((tab) => tab.value === value);
