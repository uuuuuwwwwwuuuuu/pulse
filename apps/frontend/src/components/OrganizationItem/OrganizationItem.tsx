import { useCallback, useState, type FC } from 'react';
import styles from './OrganizationItem.module.scss';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { clsx } from 'clsx';
import PlaceholderImage from '@assets/images/OrganizationPlaceholder.webp';
import { Dialog } from '@bookio/ui';

import type { OrganizationsResponse } from '@api/organizations/getOrganizationsByUserId';
import { Button } from '@bookio/ui';
import { toast } from 'react-hot-toast';

import TrashIcon from '@assets/icons/trash.svg?react';
import { useLogoutOrganization } from '@api/organizations/logoutOgranization';

const getDialogContent = (
    organizationName: string,
    role: OrganizationsResponse['data'][number]['role'],
) => {
    switch (role) {
        case 'owner':
            return {
                title: `Are you sure you want to <span class='${styles.red}'>remove</span> ${organizationName}?`,
                description:
                    "This action will remove the organization and all its members will be removed from it.<br /><br />If you're sure, enter organization password to confirm.",
            };
        default:
            return {
                title: `Are you sure you want to logout from ${organizationName}?`,
                description:
                    'This action will logout you from the organization and you will lose your role status.',
            };
    }
};

interface OrganizationItemProps {
    organizationName: OrganizationsResponse['data'][number]['name'];
    organizationId: OrganizationsResponse['data'][number]['id'];
    imageUrl?: string;
    createdAt: OrganizationsResponse['data'][number]['createdAt'];
    role: OrganizationsResponse['data'][number]['role'];
}

export const OrganizationItem: FC<OrganizationItemProps> = ({
    organizationName,
    createdAt,
    organizationId,
    imageUrl,
    role,
}) => {
    const { mutateAsync: logoutOrganization } = useLogoutOrganization();
    const [isOpenLogoutDialog, setIsOpenLogoutDialog] = useState(false);
    const [organizationPassword, setOrganizationPassword] = useState('');

    const handleClickOnTrash = () => {
        setIsOpenLogoutDialog(true);
    };

    const handleCloseLogoutDialog = () => {
        setIsOpenLogoutDialog(false);
    };

    const handleLogoutOrganization = useCallback(async () => {
        if (role === 'owner' && organizationPassword.trim() === '') {
            toast.error('Please enter the organization password');
            return;
        }

        const payload =
            role === 'owner' ? { organizationId, organizationPassword } : { organizationId };

        await toast.promise(logoutOrganization(payload), {
            loading: 'Logging out...',
            success: 'Logged out successfully',
            error: 'Failed to logout',
        });

        handleCloseLogoutDialog();
    }, [logoutOrganization, organizationId, organizationPassword, role]);

    const handleChangeOrganizationPassword = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setOrganizationPassword(e.target.value);
        },
        [],
    );

    const { title, description } = getDialogContent(organizationName, role);

    return (
        <div className={styles.organizationItem}>
            <img src={imageUrl || PlaceholderImage} alt={organizationName} />
            <div className={styles.organizationInfo}>
                <h3>{organizationName}</h3>
                <div className={styles.organizationAdditionalInfo}>
                    <div className={clsx(styles.role, { [styles.owner]: role === 'owner' })}>
                        {role}
                    </div>
                    <span>{format(new Date(createdAt), 'dd/MM/yyyy', { locale: ru })}</span>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <Button variant="red-clean" onClick={handleClickOnTrash}>
                    <TrashIcon />
                </Button>
            </div>

            <Dialog
                open={isOpenLogoutDialog}
                onOpenChange={setIsOpenLogoutDialog}
                closeOnEscape
                contentClassName={styles.logoutDialog}
            >
                <Dialog.Title>
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                </Dialog.Title>
                <Dialog.Description>
                    <span dangerouslySetInnerHTML={{ __html: description }} />
                </Dialog.Description>
                {role === 'owner' && (
                    <Dialog.Input
                        type="password"
                        placeholder="Enter organization password"
                        value={organizationPassword}
                        onChange={handleChangeOrganizationPassword}
                    />
                )}
                <Dialog.Actions>
                    <Dialog.Button variant="simple-clean" onClick={handleCloseLogoutDialog}>
                        Cancel
                    </Dialog.Button>
                    <Dialog.Button variant="red-filled" onClick={handleLogoutOrganization}>
                        Logout
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog>
        </div>
    );
};
