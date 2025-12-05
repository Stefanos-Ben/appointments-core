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
     *  * Data shape expected:
     * {
     *   userId?: number,
     *   staffId: number,
     *   serviceId: number,
     *   clientName: string,
     *   clientEmail: string,
     *   clientPhone?: string,
     *   startTime: Date,
     *   endTime: Date,
     *   notes?: string
     * }
     */
    async create(data) {

      const {
        userId,
        staffId,
        serviceId,
        clientName,
        clientEmail,
        clientPhone,
        startTime,
        endTime,
        notes,
      } = data;

      // Basic overlap check: any existing appointment for that staff that overlaps the interval
      const overlapping = await prisma.appointment.findFirst({
        where: {
          staffId,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (overlapping) {
        new Error("Timeslot is already booked for the selected staff member.")
        err.code = "TIMESLOT_TAKEN"
        throw err
      }

      const created = await prisma.appointment.create({
        data: {
          userId: userId || null,
          staffId,
          serviceId,
          clientName,
          clientEmail,
          clientPhone: clientPhone || null,
          startTime,
          endTime,
          notes,
        },
        include: {
          staff: true,
          service: true,
          user: true,
        },
      })
      return created
    },
    /**
     * Get an appointment by its ID.
     */
    async getById(id) {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          staff: true,
          service: true,
          user: true,
        },
      })
      return appointment
    },
    /**
     * List appointments for a given staff (doctor/barber) in a time range.
     */
    async listForStaff({ staffId, from, to }) {
      const where = {
        staffId,
      }

      if (from || to) {
        where.startTime = {}
        if (from) where.startTime.gte = from
        if (to) where.startTime.lte = to
      }

      return prisma.appointment.findMany({
        where,
        orderBy: { startTime: 'asc' },
        include: {
          service: true,
          user: true,
        },
      })
    },
  }
}
