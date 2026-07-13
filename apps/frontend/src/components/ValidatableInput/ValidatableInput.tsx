import { useEffect, useState, type JSX } from 'react';
import { BaseInput, type InputProps } from '@bookio/ui';
import styles from './ValidatableInput.module.scss';

type ValidatableInputBaseProps = {
    isValid?: boolean | null;
};

type TextareaValidatableInputProps = ValidatableInputBaseProps &
    Extract<InputProps, { type: 'textarea' }>;
type NativeValidatableInputProps = ValidatableInputBaseProps &
    Exclude<InputProps, { type: 'textarea' }>;

export type ValidatableInputProps = TextareaValidatableInputProps | NativeValidatableInputProps;

function useShake(isValid: boolean | null | undefined) {
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (isValid !== false) return;

        const frame = requestAnimationFrame(() => setIsShaking(true));
        return () => {
            cancelAnimationFrame(frame);
            setIsShaking(false);
        };
    }, [isValid]);

    useEffect(() => {
        if (!isShaking) return;

        const timer = setTimeout(() => setIsShaking(false), 500);
        return () => clearTimeout(timer);
    }, [isShaking]);

    return isShaking;
}

function getValidationClasses(
    isValid: boolean | null | undefined,
    isShaking: boolean,
    className?: string,
) {
    const validationClass =
        isValid === true ? styles.valid : isValid === false ? styles.invalid : undefined;

    return [validationClass, isShaking && styles.shake, className].filter(Boolean).join(' ');
}

function ValidatableTextareaInput(props: TextareaValidatableInputProps) {
    const { isValid, className, ...inputProps } = props;
    const isShaking = useShake(isValid);
    const classes = getValidationClasses(isValid, isShaking, className);

    return <BaseInput {...inputProps} className={classes || undefined} />;
}

function ValidatableNativeInput(props: NativeValidatableInputProps) {
    const { isValid, className, ...inputProps } = props;

    const isShaking = useShake(isValid);
    const classes = getValidationClasses(isValid, isShaking, className);

    if (isValid === undefined)
        return <BaseInput {...inputProps} className={className || undefined} />;

    return <BaseInput {...inputProps} className={classes || undefined} />;
}

function isTextareaValidatableInput(
    props: ValidatableInputProps,
): props is TextareaValidatableInputProps {
    return props.type === 'textarea';
}

function ValidatableInput(props: TextareaValidatableInputProps): JSX.Element;
function ValidatableInput(props: NativeValidatableInputProps): JSX.Element;
function ValidatableInput(props: ValidatableInputProps): JSX.Element {
    if (isTextareaValidatableInput(props)) {
        return <ValidatableTextareaInput {...props} />;
    }

    return <ValidatableNativeInput {...props} />;
}

export { ValidatableInput };
