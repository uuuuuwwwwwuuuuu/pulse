import { memo, type FC, type ReactNode, useMemo, useCallback } from 'react';

import PanelLeftCloseIcon from '@assets/icons/panel-left-close.svg?react';
import { Button } from '@bookio/ui';

import { useShallow } from 'zustand/shallow';
import { useBookingFormConfiguratorStore } from '@store/useBookingFormConfiguratorStore';
import { configuratorTabs } from '../configuratorTabs';
import styles from './ConfiguratorLayout.module.scss';
import { ConfiguratorTabs } from './ConfiguratorTabs';
import { useParams } from 'react-router-dom';
import { useGetEntireBookingFormById } from '@api/bookingForms/getEntireBookingFormById';
import isEqual from 'fast-deep-equal';
import { useUpdateBookingForm } from '@api/bookingForms/updateBookingForm';
import toast from 'react-hot-toast';
import { useCreateBookingFormField } from '@api/bookingForms/bookingFormFields/createBookingFormField';
import { useUpdateBookingFormField } from '@api/bookingForms/bookingFormFields/updateBookingFormField';

export const ConfiguratorLayout = memo(function ConfiguratorLayout({
    children,
}: {
    children?: ReactNode;
}) {
    return (
        <div className={styles.configuratorContainer}>
            <ConfiguratorTabsSection />
            <ConfiguratorHeader />
            <div className={styles.content}>{children}</div>
            <ConfiguratorFooter />
        </div>
    );
});

const ConfiguratorTabsSection: FC = memo(() => {
    const { activeTab, setActiveTab } = useBookingFormConfiguratorStore(
        useShallow(({ activeTab, setActiveTab }) => ({ activeTab, setActiveTab })),
    );

    return (
        <div className={styles.tabs}>
            <ConfiguratorTabs
                tabs={configuratorTabs}
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
            />
        </div>
    );
});

const ConfiguratorHeader: FC = memo(() => {
    const activeTab = useBookingFormConfiguratorStore((state) => state.activeTab);
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>
                {configuratorTabs.find((tab) => tab.value === activeTab)?.content}
            </h2>
            <button type="button" className={styles.collapseButton} aria-label="Collapse panel">
                <PanelLeftCloseIcon />
            </button>
        </div>
    );
});

const ConfiguratorFooter: FC = memo(() => {
    const { bookingFormId } = useParams();
    const { data: baseLine } = useGetEntireBookingFormById(bookingFormId);
    const { bookingForm, bookingFormFields } = useBookingFormConfiguratorStore(
        useShallow(({ bookingForm, bookingFormStyles, bookingFormFields }) => ({
            bookingForm,
            bookingFormStyles,
            bookingFormFields,
        })),
    );

    const { mutateAsync: updateBookingForm } = useUpdateBookingForm(bookingFormId);
    const { mutateAsync: updateBookingFormField } = useUpdateBookingFormField(bookingFormId);

    const { mutateAsync: createBookingFormField } = useCreateBookingFormField();

    const isDirtyBookingForm = useMemo(() => {
        if (!baseLine || !bookingForm) return false;

        return !isEqual(baseLine, bookingForm);
    }, [baseLine, bookingForm]);

    const isDirtyBookingFormFields = useMemo(() => {
        if (!baseLine || !bookingFormFields) return false;

        return !isEqual(baseLine.fields, bookingFormFields);
    }, [baseLine, bookingFormFields]);

    const requests = useMemo(() => {
        const requestsArray: Promise<unknown>[] = [];

        if (isDirtyBookingForm && bookingForm) requestsArray.push(updateBookingForm( bookingForm));
        if (isDirtyBookingFormFields && bookingFormFields) {
            requestsArray.push(
                ...bookingFormFields.map((bookingFormField) => {
                    const existingField = baseLine?.fields.find(
                        (field) => field.id === bookingFormField.id,
                    );
                    if (existingField) {
                        return updateBookingFormField(bookingFormField);
                    }
                    if (!bookingFormId) {
                        return Promise.reject(new Error('Booking form ID is required'));
                    }
                    return createBookingFormField({ bookingFormId, ...bookingFormField});
                }),
            );
        }

        return requestsArray;
    }, [isDirtyBookingForm, bookingForm, updateBookingForm]);

    const handleSave = useCallback(() => {
        toast.promise(Promise.all(requests), {
            loading: 'Saving booking form...',
            success: 'Booking form saved successfully',
            error: 'Failed to save booking form',
        });
    }, [requests]);

    return (
        <div className={styles.footer}>
            <Button type="button" variant="simple-clean">
                Back
            </Button>
            <Button variant="green-filled" className={styles.saveButton} onClick={handleSave}>
                Save booking form
            </Button>
        </div>
    );
});
