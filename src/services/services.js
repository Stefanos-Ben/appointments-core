// This file defines factories for domain services.

/**
 * Factory for appointment-related operations.
 * 
 * @param {Object} deps
 * @param {import('@prisma/client').PrismaClient} deps.prisma - A PrismaClient instance from the consuming project.
 * 
 * NOTE: We are NOT importing PrismaClient here, the type annotation
 * is just for documentation purposes.
 */
export function appointmentService({ prisma }) {
  if (!prisma) {
    throw new Error("PrismaClient instance is required to create AppointmentService");
  }

  return {
    /**
     * Create a new appointment.
     * 
     * @param {Object} data - validated appointment input
     */
    async create(data) {

      console.log('Creating appointment with data:', data);
      throw new Error('createAppointment is not implemented yet.');
    },
    /**
     * Get an appointment by its ID.
     */
    async getById(id) {
      console.log("[appointments-core] getAppointmentById called with:", id);
      throw new Error("getAppointmentById is not implemented yet.");
    },
    /**
     * List appointments for a given staff (doctor/barber) in a time range.
     */
    async listForStaff({ staffId, from, to }) {
      console.log("[appointments-core] listAppointmentsForStaff called with:", {
        staffId,
        from,
        to,
      });
      throw new Error("listAppointmentsForStaff is not implemented yet.");
    },
  }
}
