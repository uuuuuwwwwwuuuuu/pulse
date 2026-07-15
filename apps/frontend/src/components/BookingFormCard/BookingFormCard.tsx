import { useCallback, type ChangeEvent, type FC, useState } from 'react';
import styles from './BookingFormCard.module.scss';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { Button, Checkbox } from '@bookio/ui';
import { useUpdateBookingForm } from '@api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { EditBookingFormDialog } from './EditBookingFormDialog';
import { DeleteBookingFormDialog } from './DeleteBookingFormDialog';
import { BOOKING_FORM_URL } from '@utils/constants';

import TrashIcon from '@assets/icons/trash.svg?react';
import EditIcon from '@assets/icons/pen.svg?react';
import { useParams } from 'react-router-dom';
import { useGetOrganization } from '@api/organizations/getOrganizationData';

export const BookingFormCard: FC<{ bookingForm: BookingFormType }> = ({ bookingForm }) => {
    const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingForm.id);
    const { id } = useParams<{ id: string }>();
    const { data: organization } = useGetOrganization(id);
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

    const handleCopyBookingFormUrl = useCallback(() => {
        navigator.clipboard.writeText(
            `${BOOKING_FORM_URL}/${organization?.slug}/${bookingForm.slug}`,
        );
        toast.success('Booking form URL copied to clipboard');
    }, [organization?.slug, bookingForm.slug]);

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
                        <button
                            className={styles.bookingFormLink}
                            onClick={handleCopyBookingFormUrl}
                        >
                            <span>Booking form URL (click to copy):</span>
                            <br />
                            <span className={styles.bookingFormCardLinkUrl}>
                                {BOOKING_FORM_URL}/{organization?.slug}/{bookingForm.slug}
                            </span>
                        </button>
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
