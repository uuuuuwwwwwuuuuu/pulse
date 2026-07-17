import { Hono } from 'hono';
import { getBookingFormStylesHandler } from '@/handlers/bookingFormStyles/get.handler.js';
import { updateBookingFormStylesHandler } from '@/handlers/bookingFormStyles/update.handler.js';

const bookingFormStylesRoutes = new Hono()
    .put('/update', ...updateBookingFormStylesHandler)
    .get('/get-one', ...getBookingFormStylesHandler);

export default bookingFormStylesRoutes;
