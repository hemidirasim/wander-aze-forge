import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'heracles.mxrouting.net';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true; // 465 true, 587 false
const SMTP_USER = process.env.SMTP_USER || 'noreply@outtour.az';
const SMTP_PASS = process.env.SMTP_PASS || 'qw2e3Q!W@E';
const FROM_NAME = process.env.MAIL_FROM_NAME || 'Outtour Azerbaijan';
const FROM_EMAIL = process.env.MAIL_FROM || 'noreply@outtour.az';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const tx = getTransporter();
  const info = await tx.sendMail({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
  return info;
}

export function contactConfirmationTemplate(params: {
  firstName: string;
  lastName: string;
  tourCategory?: string;
  groupSize?: string | number;
  dates?: string;
  message?: string;
}) {
  const fullName = `${params.firstName} ${params.lastName}`.trim();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">Thank you, ${fullName}!</h2>
      <p style="margin: 0 0 12px; color: #333;">We've received your message and will get back to you shortly.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        ${params.tourCategory ? `<p style="margin:8px 0;"><strong>Tour Category:</strong> ${params.tourCategory}</p>` : ''}
        ${params.groupSize ? `<p style="margin:8px 0;"><strong>Group Size:</strong> ${params.groupSize}</p>` : ''}
        ${params.dates ? `<p style="margin:8px 0;"><strong>Dates:</strong> ${params.dates}</p>` : ''}
        ${params.message ? `<p style="margin:8px 0;"><strong>Your Message:</strong><br/>${params.message}</p>` : ''}
      </div>
      <p style="margin:16px 0 0; color:#666;">Best regards,<br/>Outtour Azerbaijan</p>
    </div>
  `;
}

export function tailorMadeConfirmationTemplate(params: {
  fullName: string;
  startDate: string;
  numberOfPeople: string | number;
  destinations: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">We've received your tailor-made request</h2>
      <p style="margin: 0 0 12px; color: #333;">Hi ${params.fullName}, thanks for your interest. Our team will prepare a custom itinerary and contact you within 24 hours.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        <p style="margin:8px 0;"><strong>Start Date:</strong> ${params.startDate}</p>
        <p style="margin:8px 0;"><strong>People:</strong> ${params.numberOfPeople}</p>
        <p style="margin:8px 0;"><strong>Destinations:</strong> ${params.destinations}</p>
      </div>
      <p style="margin:16px 0 0; color:#666;">Outtour Azerbaijan</p>
    </div>
  `;
}

export function bookingConfirmationTemplate(params: {
  fullName: string | null;
  tourTitle: string;
  tourDate: string;
  participants: number;
  totalPrice: number;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">Booking request received</h2>
      <p style="margin: 0 0 12px; color: #333;">${params.fullName ? `Hi ${params.fullName},` : 'Hi,'} we have received your booking request. We will confirm availability and get back to you shortly.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        <p style="margin:8px 0;"><strong>Tour:</strong> ${params.tourTitle}</p>
        <p style="margin:8px 0;"><strong>Date:</strong> ${params.tourDate}</p>
        <p style="margin:8px 0;"><strong>Participants:</strong> ${params.participants}</p>
        <p style="margin:8px 0;"><strong>Total:</strong> $${params.totalPrice}</p>
      </div>
      <p style="margin:16px 0 0; color:#666;">Outtour Azerbaijan</p>
    </div>
  `;
}


