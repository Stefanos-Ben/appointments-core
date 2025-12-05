import { z } from 'zod'

// Basic shared Zod schema for creating an appointment.
// Times in ISO strings format.

export const appointmentCreateSchema = z.object({
    businessId: z.uuid().optional(),

    clientId: z.string().min(1, "Client ID is required"),

    staffId: z.string().min(1, "Staff ID is required"),

    serviceId: z.string().min(1, "Service ID is required"),

    startTime: z.string().min(1, "startTime is required"),
    endTime: z.string().min(1, "endTime is required"),

    notes: z.string().max(1000).optional(),
})

/**
 * Schema for updating an appointment.
 * All fields are optional because updates can be partial.
 */
export const appointmentUpdateSchema = z.object({
  clientId: z.string().min(1).optional(),
  staffId: z.string().min(1).optional(),
  serviceId: z.string().min(1).optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  notes: z.string().max(1000).optional(),
})

/**
 * Schema for listing / filtering appointments.
 * E.g. ?staffId=...&from=...&to=...
 */
export const appointmentQuerySchema = z.object({
  staffId: z.string().optional(),
  clientId: z.string().optional(),
  serviceId: z.string().optional(),

  from: z.string().optional(),
  to: z.string().optional(),
})

/**
 * Simple ID schema – useful for params like /appointments/:id
 */
export const appointmentIdSchema = z.string().min(1, "id is required");

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