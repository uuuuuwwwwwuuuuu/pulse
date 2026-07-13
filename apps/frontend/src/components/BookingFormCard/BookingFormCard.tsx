import { useCallback, type ChangeEvent, type FC, useEffect, useState } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { Button, Checkbox, Dialog, Input } from '@bookio/ui';
import {
    useUpdateBookingForm,
    type UpdateBookingFormRequest,
} from '@api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import { useForm, type FieldErrors, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import { getFirstFieldError } from '@utils/formErrors';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '@api/bookingForms/isBookingFormExists';

const updateBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(255).optional().nullable(),
}) satisfies z.ZodType<Omit<UpdateBookingFormRequest, 'bookingFormId' | 'isActive'>>;

type UpdateBookingFormFormData = z.infer<typeof updateBookingFormSchema>;

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    const { mutateAsync: updateBookingForm } = useUpdateBookingForm();
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdateIsActive = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const currentValue = e.target.checked;

            toast.promise(
                updateBookingForm({
                    bookingFormId: bookingForm.id,
                    isActive: currentValue,
                }),
                {
                    loading: `Updating ${bookingForm.name}`,
                    success: `Updated ${bookingForm.name}`,
                    error: `Failed to update ${bookingForm.name}`,
                },
            );
        },
        [updateBookingForm, bookingForm.name, bookingForm.id],
    );

    const { register, handleSubmit, control } = useForm<UpdateBookingFormFormData>({
        defaultValues: {
            name: bookingForm.name,
            description: bookingForm.description,
        },
        resolver: zodResolver(updateBookingFormSchema),
    });

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setIsEditing(false);
    }, []);

    useEffect(() => {
        console.log(bookingForm.isActive);
    }, [bookingForm.isActive]);

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

            handleCloseDialog();
        },
        [updateBookingForm, bookingForm.id, bookingForm.name, handleCloseDialog],
    );

    const onInvalid = useCallback((errors: FieldErrors<UpdateBookingFormFormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    }, []);

    const name = useWatch({ control, name: 'name' });
    let { exists } = useIsBookingFormExists(name.trim(), bookingForm.organizationId);
    exists = name.trim() === bookingForm.name.trim() ? false : exists;

    return (
        <>
            <div className={styles.bookingFormCard}>
                <div className={styles.contentGroup}>
                    <div
                        className={clsx(
                            styles.bookingFormCardGroup,
                            styles.bookingFormCardGroupName,
                        )}
                    >
                        <h3>{bookingForm.name}</h3>
                        {bookingForm.description && (
                            <p className={styles.bookingFormCardDescription}>
                                {bookingForm.description}
                            </p>
                        )}
                    </div>
                    <div className={styles.bookingFormCardGroup}>
                        <span className={styles.bookingFormCardTotalBookings}>
                            Total bookings in this month: {bookingForm.totalBookings}
                        </span>
                    </div>
                    <div className={styles.bookingFormCardGroup}>
                        <Checkbox
                            label="Is active booking form"
                            checked={bookingForm.isActive}
                            onChange={handleUpdateIsActive}
                        />
                    </div>
                </div>
                <div className={styles.bookingFormCardGroup}>
                    <Button variant="blue-clean" onClick={handleEdit}>
                        Edit
                    </Button>
                    <Button variant="red-clean">Delete</Button>
                </div>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
                        <Button variant="red-clean" onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="green-clean">
                            Save
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
