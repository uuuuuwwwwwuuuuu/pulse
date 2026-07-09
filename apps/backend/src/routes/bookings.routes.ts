import { Hono } from 'hono';
import { createBookingFormHandler } from '@/handlers/bookingForms/create.handler.js';

const bookings = new Hono().post('/', ...createBookingFormHandler);

export default bookings;