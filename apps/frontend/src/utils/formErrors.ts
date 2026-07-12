import type { FieldErrors } from 'react-hook-form';

export function getFirstFieldError(errors: FieldErrors): string | undefined {
    for (const error of Object.values(errors)) {
        if (!error) continue;
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        const nested = getFirstFieldError(error as FieldErrors);
        if (nested) return nested;
    }
}
