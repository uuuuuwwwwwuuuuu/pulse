import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import {
    useCreateBookingFormStore,
    type CreateBookingFormStep,
} from '@store/useCreateBookingFormStore';
import { Step1NameDescription } from './Steps/Step1NameDescription';

const STEPS: Record<CreateBookingFormStep, FC> = {
    1: Step1NameDescription,
};

export const CreateBookingForm: FC = () => {
    const { id } = useParams();
    const { step, setOrganizationId, reset } = useCreateBookingFormStore(
        useShallow((s) => ({
            step: s.step,
            setOrganizationId: s.setOrganizationId,
            reset: s.reset,
        })),
    );

    useEffect(() => {
        if (id) setOrganizationId(id);
        return () => reset();
    }, [id, setOrganizationId, reset]);

    const CurrentStep = STEPS[step];

    return <CurrentStep />;
};
