import { useCallback, type ChangeEvent, type FC, useState } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { Button, Checkbox } from '@bookio/ui';
import { useUpdateBookingForm } from '@api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { EditBookingFormDialog } from './EditBookingFormDialog';
import { DeleteBookingFormDialog } from './DeleteBookingFormDialog';

import TrashIcon from '@assets/icons/trash.svg?react';
import EditIcon from '@assets/icons/pen.svg?react';

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingForm.id);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleOpenEditDialog = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleOpenDeleteDialog = useCallback(() => {
        setIsDeleting(true);
    }, []);

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
                <div className={styles.bookingFormButtonsGroup}>
                    <Button
                        variant="red-clean"
                        onClick={handleOpenDeleteDialog}
                        className={styles.bookingFormCardButton}
                    >
                        <TrashIcon />
                    </Button>
                    <Button
                        variant="blue-clean"
                        onClick={handleOpenEditDialog}
                        className={styles.bookingFormCardButton}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="primary-filled"
                        type="link"
                        to={`${bookingForm.id}/configurator`}
                        className={styles.bookingFormCardConfiguratorButton}
                    >
                        Open configurator
                    </Button>
                </div>
            </div>

            <EditBookingFormDialog
                bookingForm={bookingForm}
                open={isEditing}
                onOpenChange={setIsEditing}
            />

            <DeleteBookingFormDialog
                bookingForm={bookingForm}
                open={isDeleting}
                onOpenChange={setIsDeleting}
            />
        </>
    );
};
