import type { CSSProperties, FC } from 'react';
import styles from './Spinner.module.scss';

interface SpinnerProps {
    size?: number;
}

export const Spinner: FC<SpinnerProps> = ({ size = 3 }) => {
    const style = {
        '--spinner-size': `${size}rem`,
    } as CSSProperties;

    return <span className={styles.loader} style={style} />;
};
