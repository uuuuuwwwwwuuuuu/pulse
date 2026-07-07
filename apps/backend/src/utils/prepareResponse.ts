export const prepareError = <T>(error: T): { success: false, error: T } => {
    return {
        success: false,
        error,
    };
};

export const prepareSuccess = <T>(data: T): { success: true, data: T } => {
    return {
        success: true,
        data,
    };
};