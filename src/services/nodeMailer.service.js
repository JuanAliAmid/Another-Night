import transporter from "../config/nodeMailer.config.js";
import nodemailer from 'nodemailer'

// enviar confirmacion de tickets
const sendTicketConfirmationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    const sendEmail = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Confirmación de inscripción',
        html: `
      <h1>Inscripción confirmada</h1>
      <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue confirmada.</p>
      <p>Código de reserva: <strong>${ticketCode}</strong></p>
    `
    });
    const urlEmail = nodemailer.getTestMessageUrl(sendEmail);
    console.log(urlEmail)
    return sendEmail;
};


//Enviar email de cancelación
const sendTicketCancellationEmail = async ({ to, userName, eventTitle, ticketCode }) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Cancelación de inscripción',
        html: `
      <h1>Inscripción cancelada</h1>
      <p>Hola ${userName}, tu inscripción al evento ${eventTitle} fue cancelada.</p>
      <p>Código de reserva: <strong>${ticketCode}</strong></p>
    `
    });
};

export default {
    sendTicketCancellationEmail,
    sendTicketConfirmationEmail
}