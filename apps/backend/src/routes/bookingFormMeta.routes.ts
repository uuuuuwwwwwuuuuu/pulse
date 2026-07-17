import { Hono } from 'hono';
import { getBookingFormMetaHandler } from '@/handlers/bookingFormMeta/get.handler.js';
import { updateBookingFormMetaHandler } from '@/handlers/bookingFormMeta/update.handler.js';

const bookingFormMetaRoutes = new Hono()
    .put('/update', ...updateBookingFormMetaHandler)
    .get('/get-one', ...getBookingFormMetaHandler);

export default bookingFormMetaRoutes;
