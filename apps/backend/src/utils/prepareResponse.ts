export const prepareError = (error: string): { success: false, error: string } => {
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