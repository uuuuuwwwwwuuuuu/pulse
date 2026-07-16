import { create } from 'zustand';

export type CreateBookingFormStep = number;

export type CreateBookingFormDraft = {
    organizationId: string;
    name: string;
    description: string;
};

const INITIAL_DRAFT: CreateBookingFormDraft = {
    organizationId: '',
    name: '',
    description: '',
};

interface CreateBookingFormStore {
    step: CreateBookingFormStep;
    data: CreateBookingFormDraft;

    setStep: (step: CreateBookingFormStep) => void;
    setField: <K extends keyof CreateBookingFormDraft>(
        key: K,
        value: CreateBookingFormDraft[K],
    ) => void;
    setOrganizationId: (organizationId: string) => void;
    reset: () => void;
}

const INITIAL_STEP: CreateBookingFormStep = 1;

export const useCreateBookingFormStore = create<CreateBookingFormStore>((set) => ({
    step: INITIAL_STEP,
    data: INITIAL_DRAFT,

    setStep: (step) => set({ step }),
    setField: (key, value) => set((state) => ({ data: { ...state.data, [key]: value } })),
    setOrganizationId: (organizationId) =>
        set((state) => ({ data: { ...state.data, organizationId } })),
    reset: () => set({ step: INITIAL_STEP, data: INITIAL_DRAFT }),
}));
