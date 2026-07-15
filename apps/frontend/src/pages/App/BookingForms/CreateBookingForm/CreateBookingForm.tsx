import { type FC } from 'react';
import styles from './CreateBookingForm.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateBookingForm,
    type CreateBookingFormRequest,
} from '@api/bookingForms/createBookingForm';
import { useIsBookingFormExists } from '@api/bookingForms/isBookingFormExists';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import { Button, Input } from '@bookio/ui';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '@utils/formErrors';

const createBookingFormSchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(60),
    organizationId: z.uuid(),
    description: z.string().max(255).optional().nullable(),
}) satisfies z.ZodType<CreateBookingFormRequest>;

type FormData = z.infer<typeof createBookingFormSchema>;

export const CreateBookingForm: FC = () => {
    const { id } = useParams();
    const { mutateAsync, isSuccess } = useCreateBookingForm(id ?? '');
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
    } = useForm<FormData>({
        resolver: zodResolver(createBookingFormSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            organizationId: id ?? '',
        },
    });

    const name = useWatch({ control, name: 'name', defaultValue: '' });
    const slug = useWatch({ control, name: 'slug', defaultValue: '' });
    const { exists: nameExists } = useIsBookingFormExists({
        organizationId: id ?? '',
        name: name.trim(),
    });
    const { exists: slugExists } = useIsBookingFormExists({
        organizationId: id ?? '',
        slug: slug.trim(),
    });
    const nameIsValid = nameExists === undefined ? undefined : !nameExists;
    const slugIsValid = slugExists === undefined ? undefined : !slugExists;

    const onSubmit = async (data: FormData) => {
        if (nameExists === true) {
            toast.error('Booking form with this name already exists');
            return;
        }

        if (slugExists === true) {
            toast.error('Booking form with this slug already exists');
            return;
        }

        await toast.promise(mutateAsync(data), {
            loading: 'Creating booking form...',
            success: 'Booking form created successfully',
            error: (error: Error) => error.message,
        });
    };

    const onInvalid = (errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };


    if (isSuccess) {
        navigate(`/${id}/booking-forms`);
    }

    return (
        <div className={styles.createBookingForm}>
            <div className={styles.createBookingFormContent}>
                <h2>Create a new booking form</h2>

                <p>
                    Pay your attention, name and slug must be unique within your organization
                </p>
            </div>

            <form
                className={styles.createBookingFormForm}
                onSubmit={handleSubmit(onSubmit, onInvalid)}
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <ValidatableInput
                            {...field}
                            placeholder="Enter the name of the booking form"
                            isValid={nameIsValid}
                        />
                    )}
                />

                <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                        <ValidatableInput
                            {...field}
                            placeholder="Enter a unique slug for the booking form"
                            isValid={slugIsValid}
                        />
                    )}
                />

                <Input
                    placeholder="Enter the description of the booking form"
                    {...register('description')}
                />

                <Button
                    type="submit"
                    variant="primary-filled"
                    className={styles.submitButton}
                >
                    Create booking form
                </Button>
            </form>
        </div>
    );
};
