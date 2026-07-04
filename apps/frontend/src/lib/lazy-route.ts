import type { ComponentType } from 'react';

export function lazyRoute<M extends Record<string, unknown>>(
    importFn: () => Promise<M>,
    exportName: keyof M & string,
) {
    return async () => {
        const module = await importFn();
        return { Component: module[exportName] as ComponentType };
    };
}
