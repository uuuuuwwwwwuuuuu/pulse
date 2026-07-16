import { useEffect, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import {
    useCreateBookingFormStore,
    type CreateBookingFormStep,
} from '@store/useCreateBookingFormStore';
import { Step1NameDescription } from './Steps/Step1NameDescription';
import { Step2UrlSlug } from './Steps/Step2UrlSlug';

const STEPS: Record<CreateBookingFormStep, FC> = {
    1: Step1NameDescription,
    2: Step2UrlSlug,
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
