import { createContext, useContext, useState, type FC, type ReactNode } from 'react';

import {
    DEFAULT_CONFIGURATOR_TAB,
    type ConfiguratorTabValue,
} from './configuratorTabs';

type BookingFormConfiguratorContextValue = {
    activeTab: ConfiguratorTabValue;
    setActiveTab: (tab: ConfiguratorTabValue) => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
};

const BookingFormConfiguratorContext = createContext<BookingFormConfiguratorContextValue | null>(
    null,
);

export const BookingFormConfiguratorProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<ConfiguratorTabValue>(DEFAULT_CONFIGURATOR_TAB);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    return (
        <BookingFormConfiguratorContext.Provider
            value={{ activeTab, setActiveTab, isCollapsed, setIsCollapsed }}
        >
            {children}
        </BookingFormConfiguratorContext.Provider>
    );
};

export const useBookingFormConfigurator = () => {
    const context = useContext(BookingFormConfiguratorContext);

    if (!context) {
        throw new Error(
            'useBookingFormConfigurator must be used within BookingFormConfiguratorProvider',
        );
    }

    return context;
};
