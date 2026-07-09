import { memo, type ComponentProps, type FocusEvent, type MouseEvent } from 'react';
import styles from './Input.module.scss';

type TextareaProps = {
    type: 'textarea';
    className?: string;
} & Omit<ComponentProps<'textarea'>, 'className'>;

type NativeInputProps = {
    type?: Exclude<ComponentProps<'input'>['type'], 'textarea'>;
    className?: string;
} & Omit<ComponentProps<'input'>, 'type' | 'className'>;

export type InputProps = TextareaProps | NativeInputProps;

function getReadOnlyHandlers<T extends HTMLInputElement | HTMLTextAreaElement>(
    readOnly: boolean | undefined,
    onFocus?: (event: FocusEvent<T>) => void,
    onMouseDown?: (event: MouseEvent<T>) => void,
) {
    if (!readOnly) {
        return { onFocus, onMouseDown };
    }

    return {
        tabIndex: -1,
        onFocus: (event: FocusEvent<T>) => {
            event.currentTarget.blur();
        },
        onMouseDown: (event: MouseEvent<T>) => {
            event.preventDefault();
            onMouseDown?.(event);
        },
    };
}

function Input(props: TextareaProps): React.JSX.Element;
function Input(props: NativeInputProps): React.JSX.Element;
function Input(props: InputProps): React.JSX.Element {
    if (props.type === 'textarea') {
        const { type, className, readOnly, onFocus, onMouseDown, ...rest } = props as TextareaProps;
        const classes = [styles.input, readOnly && styles.readOnly, className]
            .filter(Boolean)
            .join(' ');
        const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

        return <textarea className={classes} readOnly={readOnly} {...rest} {...readOnlyHandlers} />;
    }

    const {
        type = 'text',
        className,
        readOnly,
        onFocus,
        onMouseDown,
        ...rest
    } = props as NativeInputProps;
    const classes = [styles.input, readOnly && styles.readOnly, className]
        .filter(Boolean)
        .join(' ');
    const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

    return (
        <input
            type={type}
            className={classes}
            readOnly={readOnly}
            {...rest}
            {...readOnlyHandlers}
        />
    );
}

export { Input };

export default memo(Input);
