import { type FC } from 'react';
import styles from './SettingsTabFooter.module.scss';
import { Button } from '@bookio/ui';

export const SettingsTabFooter: FC = () => {
    return (
        <>
            <Button type="submit" variant="green-filled" className={styles.saveButton}>
                Save booking form
            </Button>
        </>
    );
};
