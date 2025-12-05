import { z } from 'zod'

// Basic shared Zod schema for creating an appointment.
// Times in ISO strings format.

// small helper: ids can come as strings from HTTP, but map to Int in DB
const numericIdSchema = z.union([
  z.number().int().nonnegative(),
  z
    .string()
    .regex(/^\d+$/, "must be a numeric string")
    .transform((val) => parseInt(val, 10)),
]);

export const appointmentCreateSchema = z.object({
    userId: numericIdSchema.optional(),

    staffId: numericIdSchema,
    serviceId: numericIdSchema,

    clientName: z.string().min(1, "clientName is required"),
    clientEmail: z.email("clientEmail must be a valid email"),
    clientPhone: z.string().optional(),

    startTime: z.string().min(1, "startTime is required"),
    endTime: z.string().min(1, "endTime is required"),

    notes: z.string().max(1000).optional(),
})

/**
 * Schema for updating an appointment.
 * All fields are optional because updates can be partial.
 */
export const appointmentUpdateSchema = z.object({
  userId: numericIdSchema.optional(),
  staffId: numericIdSchema.optional(),
  serviceId: numericIdSchema.optional(),

  clientName: z.string().min(1).optional(),
  clientEmail: z.email().optional(),
  clientPhone: z.string().optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  notes: z.string().max(1000).optional(),
})

/**
 * Schema for listing / filtering appointments.
 * E.g. ?staffId=...&from=...&to=...
 */
export const appointmentQuerySchema = z.object({
  staffId: numericIdSchema.optional(),
  userId: numericIdSchema.optional(),
  serviceId: numericIdSchema.optional(),

  from: z.string().optional(), // ISO datetime
  to: z.string().optional(),
})

/**
 * Simple ID schema – useful for params like /appointments/:id
 */
export const appointmentIdSchema = numericIdSchema;

/**
 * Helper: validate and transform "create appointment" input.
 */
export function validateAppointmentCreate(input) {
  const parsed = appointmentCreateSchema.parse(input);

  return {
    ...parsed,
    startTime: new Date(parsed.startTime),
    endTime: new Date(parsed.endTime),
  }
}

/**
 * Helper: validate and transform "update appointment" input.
 * (Dates are converted only if provided.)
 */
export function validateAppointmentUpdate(input) {
  const parsed = appointmentUpdateSchema.parse(input);

  return {
    ...parsed,
    ...(parsed.startTime && { startTime: new Date(parsed.startTime) }),
    ...(parsed.endTime && { endTime: new Date(parsed.endTime) }),
  }
}

/**
 * Helper: validate and transform query parameters for listing appointments.
 */
export function validateAppointmentQuery(input) {
  const parsed = appointmentQuerySchema.parse(input);

  return {
    ...parsed,
    ...(parsed.from && { from: new Date(parsed.from) }),
    ...(parsed.to && { to: new Date(parsed.to) }),
  }
}