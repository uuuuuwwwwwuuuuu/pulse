import { useCallback, type FC } from 'react';
import { useGetBookingForm } from '@api/bookingForms/getBookingForm';
import type { BookingFormType } from '@api/bookingForms/getBookingForms';
import { useParams } from 'react-router-dom';
import { Checkbox, Input } from '@bookio/ui';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import { useIsBookingFormExists } from '@api/bookingForms/isBookingFormExists';

import styles from './SettingsTabPanel.module.scss';
import { BookingFormUrlPreview } from '@components/BookingFormUrlPreview/BookingFormUrlPreview';
import { useGetOrganization, type OrganizationData } from '@api/organizations/getOrganizationData';

import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useUpdateBookingForm } from '@api/bookingForms/updateBookingForm';
import { getFirstFieldError } from '@utils/formErrors';

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    slug: z.string().min(1),
    isActive: z.boolean(),
});

type SettingsTabFormData = z.infer<typeof formSchema>;

type SettingsTabFormProps = {
    bookingForm: BookingFormType;
    organization: OrganizationData;
};

function getFieldExistsValidity(
    currentValue: string,
    originalValue: string,
    exists: boolean | undefined,
): boolean | undefined {
    if (currentValue === originalValue || exists === undefined) {
        return undefined;
    }

    return !exists;
}

const SettingsTabForm: FC<SettingsTabFormProps> = ({ bookingForm, organization }) => {
    const { register, control, handleSubmit } = useForm<SettingsTabFormData>({
        values: {
            name: bookingForm.name ?? '',
            description: bookingForm.description ?? '',
            slug: bookingForm.slug ?? '',
            isActive: bookingForm.isActive ?? false,
        },
        resetOptions: {
            keepDirtyValues: true,
        },
        resolver: zodResolver(formSchema),
    });
    const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingForm.id);

    const name = useWatch({ control, name: 'name' });
    const slug = useWatch({ control, name: 'slug' });

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    const originalName = (bookingForm.name ?? '').trim();
    const originalSlug = (bookingForm.slug ?? '').trim();

    const { exists: nameExists } = useIsBookingFormExists({
        organizationId: organization.id,
        name: trimmedName,
    });
    const { exists: slugExists } = useIsBookingFormExists({
        organizationId: organization.id,
        slug: trimmedSlug,
    });

    const nameIsValid = getFieldExistsValidity(trimmedName, originalName, nameExists);
    const slugIsValid = getFieldExistsValidity(trimmedSlug, originalSlug, slugExists);

    const onSubmit = useCallback(
        async (data: SettingsTabFormData) => {
            const trimmedName = data.name.trim();
            const trimmedSlug = data.slug.trim();

            if (trimmedName !== originalName && nameExists === true) {
                toast.error('Booking form with this name already exists');
                return;
            }

            if (trimmedSlug !== originalSlug && slugExists === true) {
                toast.error('Booking form with this slug already exists');
                return;
            }

            await toast.promise(
                updateBookingForm({
                    bookingFormId: bookingForm.id,
                    name: trimmedName,
                    slug: trimmedSlug,
                    description: data.description?.trim() ?? null,
                    isActive: data.isActive,
                }),
                {
                    loading: 'Updating booking form...',
                    success: 'Booking form updated successfully',
                    error: 'Failed to update booking form',
                },
            );
        },
        [updateBookingForm, bookingForm.id, originalName, originalSlug, nameExists, slugExists],
    );

    const onInvalid = useCallback((errors: FieldErrors<SettingsTabFormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    }, []);

    return (
        <form className={styles.settingsTab} onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <ValidatableInput
                label="Name"
                className={styles.input}
                {...register('name')}
                isValid={nameIsValid}
                errorMessage={
                    nameExists === true ? 'Booking form with this name already exists' : undefined
                }
            />
            <Input
                label="Description"
                type="textarea"
                className={styles.textarea}
                {...register('description')}
            />
            <ValidatableInput
                label="Slug"
                className={styles.input}
                {...register('slug')}
                isValid={slugIsValid}
                errorMessage={
                    slugExists === true ? 'Booking form with this slug already exists' : undefined
                }
            />
            <BookingFormUrlPreview
                formSlug={trimmedSlug || originalSlug}
                organizationSlug={organization.slug}
            />
            <Checkbox label="Is active" {...register('isActive')} />
        </form>
    );
};

export const SettingsTab: FC = () => {
    const { bookingFormId, id } = useParams();

    const { data: organization } = useGetOrganization(id);
    const { data: bookingForm } = useGetBookingForm(bookingFormId);

    if (!bookingFormId || !id || !bookingForm || !organization) return null;

    return <SettingsTabForm bookingForm={bookingForm} organization={organization} />;
};
