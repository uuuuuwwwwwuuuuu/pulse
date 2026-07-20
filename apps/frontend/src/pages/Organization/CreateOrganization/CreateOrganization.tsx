import { type FC, useCallback, useEffect } from 'react';
import styles from './CreateOrganization.module.scss';
import panelStyles from '@components/PanelFormLayout/PanelFormLayout.module.scss';
import { Button, Input, HiddenField } from '@bookio/ui';
import { ValidatableInput } from '@components/ValidatableInput/ValidatableInput';
import {
    useCreateOrganization,
    type CreateOrganizationResponse,
} from '@api/organizations/createOrganization';
import { useSession } from '@api/auth';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { type CreateOrganizationRequest } from '@api/organizations/createOrganization';
import { useIsOrganizationExists } from '@api/organizations/isOrganizationExists';
import { Controller, useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirstFieldError } from '@utils/formErrors';
import { useOrganizationAccess } from '../OrganizationAccess/OrganizationAccessContext';

const formSchema = z.object({
    name: z.string().min(3).max(255),
    slug: z
        .string()
        .min(1)
        .max(255)
        .regex(/^[a-zA-Z0-9]/, {
            message: 'Slug must start with a letter or number',
        }),
    password: z
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        }),
}) satisfies z.ZodType<Omit<CreateOrganizationRequest, 'userId'>>;

type FormData = z.infer<typeof formSchema>;

export const CreateOrganization: FC = () => {
    const { switchMode, setMeta } = useOrganizationAccess();
    const { data: session } = useSession();
    const { data: organization, mutateAsync, isPending, isSuccess } = useCreateOrganization();

    const {
        register,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', slug: '', password: '' },
    });

    const slug = useWatch({ control, name: 'slug', defaultValue: '' });
    const { exists: slugExists } = useIsOrganizationExists(slug);
    const slugIsValid = slugExists === undefined ? undefined : !slugExists;

    useEffect(() => {
        return () => setMeta(null);
    }, [setMeta]);

    const onSubmit = async (data: FormData) => {
        if (slugExists === true) {
            toast.error('Organization slug is already taken');
            return;
        }

        await toast.promise(mutateAsync({ ...data, userId: session!.user.id }), {
            loading: 'Creating organization...',
            success: 'Organization created successfully',
            error: (error: Error) => error.message,
        });
    };

    const onInvalid = (errors: FieldErrors<FormData>) => {
        toast.error(getFirstFieldError(errors) ?? 'Invalid form data');
    };

    if (isSuccess && organization) {
        return <SuccessfulOrganizationCreation data={organization} />;
    }

    const isDisabled = isPending || isSubmitting;

    return (
        <>
            <div className={panelStyles.fields}>
                <form
                    id="create-organization-form"
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                >
                    <Input
                        placeholder="Organization name"
                        disabled={isDisabled}
                        {...register('name')}
                    />
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <ValidatableInput
                                {...field}
                                placeholder="Unique organization slug"
                                isValid={slugIsValid}
                                errorMessage={
                                    slugExists === true
                                        ? 'Organization slug is already taken'
                                        : undefined
                                }
                                disabled={isDisabled}
                            />
                        )}
                    />
                    <Input
                        type="password"
                        placeholder="Organization password"
                        autoComplete="new-password"
                        disabled={isDisabled}
                        {...register('password')}
                    />
                </form>
            </div>
            <div className={panelStyles.footer}>
                <div className={styles.footerActions}>
                    <Button
                        variant="primary-filled"
                        type="submit"
                        form="create-organization-form"
                        disabled={isDisabled}
                    >
                        Create Organization
                    </Button>
                    <Button
                        type="button"
                        variant="simple-clean"
                        onClick={() => switchMode('connect')}
                    >
                        Connect instead
                    </Button>
                </div>
            </div>
        </>
    );
};

const SuccessfulOrganizationCreation: FC<{ data: CreateOrganizationResponse['data'] }> = ({
    data,
}) => {
    const { setMeta } = useOrganizationAccess();

    useEffect(() => {
        setMeta({
            badge: 'Done',
            title: `${data.organization.name} is ready`,
            description:
                'Your organization has been created. Copy the secret key below and keep it in a safe place.',
        });
    }, [data.organization.name, setMeta]);

    const handleCopy = useCallback(() => {
        toast.success('Secret key copied to clipboard');
    }, []);

    return (
        <>
            <div className={panelStyles.fields}>
                <HiddenField value={data.organization.secretKey} onCopy={handleCopy} />
            </div>
            <div className={panelStyles.footer}>
                <div className={styles.footerActions}>
                    <Button type="link" to="/organizations/list" variant="primary-filled">
                        Go to organizations
                    </Button>
                </div>
            </div>
        </>
    );
};
