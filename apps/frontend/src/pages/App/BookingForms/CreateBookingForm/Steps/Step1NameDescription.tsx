import type { ChangeEvent, FC } from 'react';
import { useShallow } from 'zustand/shallow';
import { Button, Input } from '@bookio/ui';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '@api/bookingForms/isBookingFormExists';
import { useCreateBookingFormStore } from '@store/useCreateBookingFormStore';
import { BookingFormConfiguratorLayout } from '../BookingFormConfiguratorLayout/BookingFormConfiguratorLayout';

export const Step1NameDescription: FC = () => {
    const { name, description, organizationId } = useCreateBookingFormStore(
        useShallow((s) => ({
            name: s.data.name,
            description: s.data.description,
            organizationId: s.data.organizationId,
        })),
    );
    const setField = useCreateBookingFormStore((s) => s.setField);

    const { exists: nameExists } = useIsBookingFormExists({
        organizationId,
        name: name.trim(),
    });
    const nameIsValid = nameExists === undefined ? undefined : !nameExists;

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setField('name', event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setField('description', event.target.value);
    };

    return (
        <BookingFormConfiguratorLayout
            stepNumber={1}
            title="Enter name and description of booking form"
            description="The name must be unique within your organization. The description should explain the purpose of this booking form."
            footer={
                <Button type="button" variant="primary-filled">
                    Go to next
                </Button>
            }
        >
            <ValidatableInput
                value={name}
                onChange={handleNameChange}
                placeholder="Name*"
                isValid={nameIsValid}
            />
            <Input
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Description"
            />
        </BookingFormConfiguratorLayout>
    );
};
