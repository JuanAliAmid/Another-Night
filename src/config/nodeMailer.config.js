import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});


// enviar confirmacion de tickets
import { transporter } from '../config/mailer.config.js'

export const sendTicketConfirmationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Confirmación de inscripción',
        html: `
      <h1>Inscripción confirmada</h1>
      <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue confirmada.</p>
      <p>Código de reserva: <strong>${ticketCode}</strong></p>
    `
    })
}



//Enviar email de cancelación
import { transporter } from '../config/mailer.config.js'
export const sendTicketCancellationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Cancelación de inscripción',
        html: `
      <h1>Inscripción cancelada</h1>
      <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue cancelada.</p>
      <p>Código de reserva: <strong>${ticketCode}</strong></p>
    `
    })
}



//Ruta protegida para crear tickets
router.post('/tickets', passport.authenticate('current', { session: false }), createTicket);



//Validar duplicados
const existingTicket = await TicketModel.findOne({
    user: req.user._id,
    event: event._id,
    status: 'active'
})
if (existingTicket) {
    return res.status(409).json({ status: 'error', message: 'Ya tenés una inscripción activa para este evento' })
}



//Esta validación evita que el evento supere su capacidad.
const result = await TicketModel.aggregate([
    {
        $match: {
            event: event._id,
            status: 'active'
        }
    },
    {
        $group: {
            _id: '$event',
            totalReserved: {
                $sum: '$quantity'
            }
        }
    }
])
const reserved = result[0]?.totalReserved || 0
const available = event.capacity - reserved
if (quantity > available) {
    return res.status(400).json({ status: 'error', message: 'No hay cupos suficientes disponibles' })
}




//Controlador de cancelación
export const cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params
        const ticket = await TicketModel
            .findById(ticketId)
            .populate('event')
        if (!ticket) {
            return res.status(404).json({
                status: 'error',
                message: 'Ticket no encontrado'
            })
        }
        if (ticket.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para cancelar este ticket'
            })
        }
        if (ticket.status === 'cancelled') {
            return res.status(400).json({
                status: 'error',
                message: 'El ticket ya está cancelado'
            })
        }
        if (ticket.event.date <= new Date()) {
            return res.status(400).json({
                status: 'error',
                message: 'No se puede cancelar una inscripción de un evento finalizado'
            })
        }
        ticket.status = 'cancelled'
        ticket.cancelledAt = new Date()
        await ticket.save()
        await sendTicketCancellationEmail({
            to: req.user.email,
            userName: req.user.first_name,
            eventTitle: ticket.event.title,
            ticketCode: ticket.code
        })
        res.status(200).json({
            status: 'success',
            message: 'Inscripción cancelada correctamente',
            payload: ticket
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        })
    }
}