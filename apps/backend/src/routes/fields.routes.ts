import { Hono } from 'hono';
import { createBookingFormFieldHandler } from '@/handlers/fields/create.handler.js';
import { updateBookingFormFieldHandler } from '@/handlers/fields/update.handler.js';

const fields = new Hono()
    .post('/create', ...createBookingFormFieldHandler)
    .put('/update', ...updateBookingFormFieldHandler);

export default fields;