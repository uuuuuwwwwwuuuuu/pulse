import { memo, type FC, useCallback, useEffect } from 'react';
import styles from './CreateFieldModal.module.scss';
import { Dialog, Input } from '@bookio/ui';
import { ChoiceChip } from '@components/ChoiceChip/ChoiceChip';
import { RequiredRow } from '@components/RequiredRow/RequiredRow';
import { fieldTypeIcons } from '@components/ConfiguratorField/fieldTypeIcons';
import PlusIcon from '@assets/icons/plus.svg?react';

import { useBookingFormConfiguratorStore } from '@store/useBookingFormConfiguratorStore';
import { useForm, useWatch } from 'react-hook-form';
import type { EntireBookingFormField } from '@api/bookingForms/getEntireBookingFormById';
import { useShallow } from 'zustand/shallow';

interface CreateFieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateFieldModal: FC<CreateFieldModalProps> = memo(({ open, onOpenChange }) => {
    const { setCreateBookingFormField } = useBookingFormConfiguratorStore(
        useShallow(({ setCreateBookingFormField }) => ({
            setCreateBookingFormField,
        })),
    );

    const { control, setValue, reset } = useForm<EntireBookingFormField>({
        defaultValues: {},
    });

    const formData = useWatch({ control });

    const handleCancel = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    useEffect(() => {
        if (!open) {
            reset({});
            setCreateBookingFormField(null);
            return;
        }

        setCreateBookingFormField({
            ...(formData.type ? { type: formData.type } : {}),
            required: formData.required ?? false,
        });
    }, [open, formData, reset, setCreateBookingFormField]);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            closeOnEscape
            contentClassName={styles.content}
        >
            <div className={styles.header}>
                <Dialog.Title>Create new field</Dialog.Title>
                <Dialog.Description>Configure a new field for your booking form</Dialog.Description>
            </div>
            <form className={styles.form}>
                <Input label="Label" />

                <Input label="Key" />

                <div className={styles.fieldTypesWrapper}>
                    <span className={styles.fieldTypesLabel}>Field type</span>
                    <div className={styles.fieldTypes}>
                        {(Object.keys(fieldTypeIcons) as Array<EntireBookingFormField['type']>).map(
                            (typeOption) => {
                                const { icon: Icon, color } = fieldTypeIcons[typeOption];

                                return (
                                    <ChoiceChip
                                        key={typeOption}
                                        icon={<Icon color={color} />}
                                        onClick={() => setValue('type', typeOption)}
                                        active={typeOption === formData.type}
                                    >
                                        {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                                    </ChoiceChip>
                                );
                            },
                        )}
                    </div>
                </div>

                <RequiredRow
                    checked={formData.required ?? false}
                    onCheckedChange={(value) => setValue('required', value)}
                />
            </form>
            <Dialog.Actions className={styles.actions}>
                <Dialog.Button variant="simple-clean" onClick={handleCancel}>
                    Cancel
                </Dialog.Button>
                <Dialog.Button variant="primary-filled" className={styles.createFieldButton}>
                    <PlusIcon />
                    Create a new field
                </Dialog.Button>
            </Dialog.Actions>
        </Dialog>
    );
});
