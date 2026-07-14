import { memo, useCallback, type FC } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { Button, Dialog, Input } from '@bookio/ui';
import {
    useUpdateBookingForm,
    type UpdateBookingFormRequest,
} from '@api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import { useForm, type FieldErrors, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFirstFieldError } from '@utils/formErrors';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '@api/bookingForms/isBookingFormExists';

const updateBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional().nullable(),
}) satisfies z.ZodType<Omit<UpdateBookingFormRequest, 'bookingFormId' | 'isActive'>>;

type UpdateBookingFormFormData = z.infer<typeof updateBookingFormSchema>;

type EditBookingFormDialogProps = {
    bookingForm: BookingFormType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const EditBookingFormDialog: FC<EditBookingFormDialogProps> = memo(
    ({ bookingForm, open, onOpenChange }) => {
        const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingForm.id);

        const { register, handleSubmit, control } = useForm<UpdateBookingFormFormData>({
            defaultValues: {
                name: bookingForm.name,
                description: bookingForm.description,
            },
            resolver: zodResolver(updateBookingFormSchema),
        });

        const onSubmit = useCallback(
            async (data: UpdateBookingFormFormData) => {
                if (
                    data.name.trim() !== bookingForm.name.trim() ||
                    data.description?.trim() !== bookingForm.description?.trim()
                ) {
                    await toast.promise(
                        updateBookingForm({
                            bookingFormId: bookingForm.id,
                            name: data.name.trim(),
                            description: data.description?.trim() ?? null,
                        }),
                        {
                            loading: `Updating ${bookingForm.name}`,
                            success: `Updated ${bookingForm.name}`,
                            error: `Failed to update ${bookingForm.name}`,
                        },
                    );
                }

                onOpenChange(false);
            },
            [
                updateBookingForm,
                bookingForm.id,
                bookingForm.name,
                bookingForm.description,
                onOpenChange,
            ],
        );

        const onInvalid = useCallback((errors: FieldErrors<UpdateBookingFormFormData>) => {
            toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
        }, []);

        const name = useWatch({ control, name: 'name' });
        let { exists } = useIsBookingFormExists(name.trim(), bookingForm.organizationId);
        exists = name.trim() === bookingForm.name.trim() ? false : exists;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                    <Dialog.Title>Edit Booking Form</Dialog.Title>
                    <form
                        onSubmit={handleSubmit(onSubmit, onInvalid)}
                        className={styles.editBookingFormForm}
                    >
                        <div className={styles.inputsGroup}>
                            <ValidatableInput
                                {...register('name')}
                                placeholder="Enter the name of the booking form"
                                isValid={!exists}
                            />
                            <Input
                                {...register('description')}
                                type="textarea"
                                placeholder="Enter the description of the booking form"
                            />
                        </div>
                        <div className={styles.buttonsGroup}>
                            <Button variant="red-clean" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="green-clean">
                                Save
                            </Button>
                        </div>
                    </form>
            </Dialog>
        );
    },
);
