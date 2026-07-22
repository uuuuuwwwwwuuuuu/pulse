import type { EntireBookingFormField } from '../getEntireBookingFormById';
import type { CreateBookingFormFieldRequest } from './createBookingFormField';
import type { UpdateBookingFormFieldRequest } from './updateBookingFormField';

/** Maps a configurator field entity to the update-field API payload. */
export const toUpdateBookingFormFieldRequest = (
    field: EntireBookingFormField,
): UpdateBookingFormFieldRequest => {
    const { bookingFormId: _bookingFormId, childFields: _childFields, ...updateData } = field;

    return updateData as UpdateBookingFormFieldRequest;
};

/** Maps a configurator field entity to the create-field API payload. */
export const toCreateBookingFormFieldRequest = (
    bookingFormId: string,
    field: EntireBookingFormField,
): CreateBookingFormFieldRequest => {
    const {
        id: _id,
        order: _order,
        bookingFormId: _fieldBookingFormId,
        childFields: _childFields,
        ...createData
    } = field;

    return { bookingFormId, ...createData } as CreateBookingFormFieldRequest;
};
