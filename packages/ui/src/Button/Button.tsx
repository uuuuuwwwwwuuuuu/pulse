import { memo, type ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export type ButtonVariant =
    | 'plain'
    | 'primary-filled'
    | 'primary-outlined'
    | 'outlined'
    | 'clean'
    | 'cancel'
    | 'approve';

type ButtonBaseProps = {
    variant?: ButtonVariant;
    className?: string;
};

export type ButtonAsButtonProps = ButtonBaseProps & {
    type?: 'button' | 'submit' | 'reset';
} & Omit<ComponentProps<'button'>, 'className' | 'type'>;

export type ButtonAsLinkProps = ButtonBaseProps & {
    type: 'link';
} & Omit<ComponentProps<typeof Link>, 'className' | 'type'>;

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const VARIANT_CLASS: Record<Exclude<ButtonVariant, 'plain'>, string> = {
    'primary-filled': styles.primaryFilled,
    'primary-outlined': styles.primaryOutlined,
    outlined: styles.outlined,
    clean: styles.clean,
    cancel: styles.cancel,
    approve: styles.approve,
};

function getClasses(variant: ButtonVariant, className?: string) {
    return [
        styles.button,
        variant !== 'plain' ? VARIANT_CLASS[variant] : undefined,
        className,
    ]
        .filter(Boolean)
        .join(' ');
}

function Button(props: ButtonProps) {
    const { variant = 'plain', className } = props;
    const classes = getClasses(variant, className);

    if (props.type === 'link') {
        const { variant: _variant, className: _className, type: _type, ...linkProps } = props;
        return <Link className={classes} {...linkProps} />;
    }

    const { variant: _variant, className: _className, type = 'button', ...buttonProps } = props;
    return <button type={type} className={classes} {...buttonProps} />;
}

export default memo(Button);
