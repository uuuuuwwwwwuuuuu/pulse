import { create } from 'zustand';

interface OrganizationListStore {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useOrganizationListStore = create<OrganizationListStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
