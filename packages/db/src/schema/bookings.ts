import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

import { organizations } from './organizations.js';
import { relations } from 'drizzle-orm';

export const fieldTypeEnum = pgEnum('field_type', [
    'text',
    'number',
    'file',
    'image',
    'url',
    'phone',
    'date',
    'time',
    'email',
    'checkbox',
    'select',
    'radio',
    'textarea',
    'group',
]);

export const bookingForms = pgTable('booking_forms', {
    id: uuid('id')
        .primaryKey()
        .$default(() => uuidv7()),
    organizationId: uuid('organization_id').references(() => organizations.id, {
        onDelete: 'cascade',
    }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .$onUpdateFn(() => new Date()),
});

export const bookingFormFields = pgTable('booking_form_fields', {
    id: uuid('id')
        .primaryKey()
        .$default(() => uuidv7()),
    bookingFormId: uuid('booking_form_id').references(() => bookingForms.id, {
        onDelete: 'cascade',
    }),
    name: text('name').notNull(),
    type: fieldTypeEnum('type').notNull(),
    key: text('key').notNull(),
    required: boolean('required').notNull().default(false),
    parentId: uuid('parent_id').references((): AnyPgColumn => bookingFormFields.id, {
        onDelete: 'cascade',
    }),
    order: integer('order').notNull().default(0),
});

export const bookings = pgTable('bookings', {
    id: uuid('id')
        .primaryKey()
        .$default(() => uuidv7()),
    bookingFormId: uuid('booking_form_id').references(() => bookingForms.id, {
        onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .$onUpdateFn(() => new Date()),
    data: jsonb('data').notNull(),
});

export const bookingFormsRelations = relations(bookingForms, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [bookingForms.organizationId],
        references: [organizations.id],
    }),
    fields: many(bookingFormFields),
    bookings: many(bookings),
}));

export const formFieldsRelations = relations(bookingFormFields, ({ one, many }) => ({
    bookingForm: one(bookingForms, {
        fields: [bookingFormFields.bookingFormId],
        references: [bookingForms.id],
    }),
    parentField: one(bookingFormFields, {
        fields: [bookingFormFields.parentId],
        references: [bookingFormFields.id],
        relationName: 'nested_fields',
    }),
    childFields: many(bookingFormFields, {
        relationName: 'nested_fields',
    }),
}));


export const bookingsRelations = relations(bookings, ({one}) => ({
    bookingForm: one(bookingForms, {
        fields: [bookings.bookingFormId],
        references: [bookingForms.id]
    })
}))
