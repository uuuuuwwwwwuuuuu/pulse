import {
    memo,
    useId,
    type ComponentProps,
    type FocusEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import styles from './Input.module.scss';

type LabelProps = {
    label?: ReactNode;
};

type TextareaProps = {
    type: 'textarea';
    className?: string;
} & LabelProps &
    Omit<ComponentProps<'textarea'>, 'className'>;

type NativeInputProps = {
    type?: Exclude<ComponentProps<'input'>['type'], 'textarea'>;
    className?: string;
} & LabelProps &
    Omit<ComponentProps<'input'>, 'type' | 'className'>;

export type InputProps = TextareaProps | NativeInputProps;

export type InputFieldProps = {
    label?: ReactNode;
    htmlFor?: string;
    className?: string;
    children: ReactNode;
};

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

function InputField({ label, htmlFor, className, children }: InputFieldProps) {
    if (label === undefined) {
        return <>{children}</>;
    }

    const classes = [styles.field, className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <label className={styles.label} htmlFor={htmlFor}>
                {label}
            </label>
            {children}
        </div>
    );
}

function Input(props: TextareaProps): React.JSX.Element;
function Input(props: NativeInputProps): React.JSX.Element;
function Input(props: InputProps): React.JSX.Element {
    const generatedId = useId();

    if (props.type === 'textarea') {
        const {
            type,
            className,
            readOnly,
            onFocus,
            onMouseDown,
            label,
            id,
            ...rest
        } = props as TextareaProps;
        const inputId = id ?? (label !== undefined ? generatedId : undefined);
        const classes = [styles.input, readOnly && styles.readOnly, className]
            .filter(Boolean)
            .join(' ');
        const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

        return (
            <InputField label={label} htmlFor={inputId}>
                <textarea
                    id={inputId}
                    className={classes}
                    readOnly={readOnly}
                    {...rest}
                    {...readOnlyHandlers}
                />
            </InputField>
        );
    }

    const {
        type = 'text',
        className,
        readOnly,
        onFocus,
        onMouseDown,
        label,
        id,
        ...rest
    } = props as NativeInputProps;
    const inputId = id ?? (label !== undefined ? generatedId : undefined);
    const classes = [styles.input, readOnly && styles.readOnly, className]
        .filter(Boolean)
        .join(' ');
    const readOnlyHandlers = getReadOnlyHandlers(readOnly, onFocus, onMouseDown);

    return (
        <InputField label={label} htmlFor={inputId}>
            <input
                type={type}
                id={inputId}
                className={classes}
                readOnly={readOnly}
                {...rest}
                {...readOnlyHandlers}
            />
        </InputField>
    );
}

export { Input, InputField };

export default memo(Input);
