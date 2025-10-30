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
  cc?: string | string[];
}) {
  const tx = getTransporter();
  const info = await tx.sendMail({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.to,
    cc: options.cc,
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
  email: string;
  phone?: string | null;
  country?: string;
  tourCategory?: string;
  tourType?: string | null;
  groupSize?: string | number;
  dates?: string;
  message?: string;
  newsletter?: boolean;
}) {
  const fullName = `${params.firstName} ${params.lastName}`.trim();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">Thank you, ${fullName}!</h2>
      <p style="margin: 0 0 12px; color: #333;">We've received your message and will get back to you shortly.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        <p style="margin:8px 0;"><strong>Full Name:</strong> ${fullName}</p>
        <p style="margin:8px 0;"><strong>Email:</strong> ${params.email}</p>
        ${params.phone ? `<p style=\"margin:8px 0;\"><strong>Phone:</strong> ${params.phone}</p>` : ''}
        ${params.country ? `<p style=\"margin:8px 0;\"><strong>Country:</strong> ${params.country}</p>` : ''}
        ${params.tourCategory ? `<p style="margin:8px 0;"><strong>Tour Category:</strong> ${params.tourCategory}</p>` : ''}
        ${params.tourType ? `<p style=\"margin:8px 0;\"><strong>Tour Type:</strong> ${params.tourType}</p>` : ''}
        ${params.groupSize ? `<p style="margin:8px 0;"><strong>Group Size:</strong> ${params.groupSize}</p>` : ''}
        ${params.dates ? `<p style="margin:8px 0;"><strong>Dates:</strong> ${params.dates}</p>` : ''}
        ${params.message ? `<p style="margin:8px 0;"><strong>Your Message:</strong><br/>${params.message}</p>` : ''}
        ${typeof params.newsletter !== 'undefined' ? `<p style=\"margin:8px 0;\"><strong>Subscribe to newsletter:</strong> ${params.newsletter ? 'Yes' : 'No'}</p>` : ''}
      </div>
      <p style="margin:16px 0 0; color:#666;">Best regards,<br/>Outtour Azerbaijan</p>
    </div>
  `;
}

export function tailorMadeConfirmationTemplate(params: {
  email: string;
  fullName: string;
  adventureTypes: string[];
  destinations: string;
  startDate: string;
  duration: string;
  dailyKilometers: string;
  numberOfPeople: string | number;
  childrenAges?: string | null;
  accommodationPreferences: string[];
  budget: string;
  additionalDetails: string;
  agreeToTerms: boolean;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">We've received your tailor-made request</h2>
      <p style="margin: 0 0 12px; color: #333;">Hi ${params.fullName}, thanks for your interest. Our team will prepare a custom itinerary and contact you within 24 hours.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        <p style="margin:8px 0;"><strong>Full Name:</strong> ${params.fullName}</p>
        <p style="margin:8px 0;"><strong>Email:</strong> ${params.email}</p>
        <p style="margin:8px 0;"><strong>Adventure Types:</strong> ${params.adventureTypes.join(', ')}</p>
        <p style="margin:8px 0;"><strong>Destinations:</strong> ${params.destinations}</p>
        <p style="margin:8px 0;"><strong>Start Date:</strong> ${params.startDate}</p>
        <p style="margin:8px 0;"><strong>Duration:</strong> ${params.duration}</p>
        <p style="margin:8px 0;"><strong>Daily Kilometers:</strong> ${params.dailyKilometers}</p>
        <p style="margin:8px 0;"><strong>People:</strong> ${params.numberOfPeople}</p>
        ${params.childrenAges ? `<p style=\"margin:8px 0;\"><strong>Children Ages:</strong> ${params.childrenAges}</p>` : ''}
        <p style="margin:8px 0;"><strong>Accommodation Preferences:</strong> ${params.accommodationPreferences.join(', ')}</p>
        <p style="margin:8px 0;"><strong>Budget:</strong> ${params.budget}</p>
        <p style="margin:8px 0;"><strong>Additional Details:</strong><br/>${params.additionalDetails}</p>
        <p style="margin:8px 0;"><strong>Agree to Terms:</strong> ${params.agreeToTerms ? 'Yes' : 'No'}</p>
      </div>
      <p style="margin:16px 0 0; color:#666;">Outtour Azerbaijan</p>
    </div>
  `;
}

export function bookingConfirmationTemplate(params: {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  tourId: number | string;
  tourTitle: string;
  tourCategory: string | null;
  tourDate: string;
  participants: number;
  tourPrice: string | null;
  totalPrice: number;
  alternativeDate?: string | null;
  pickupLocation?: string | null;
  informLater?: boolean | null;
  specialRequests?: string | null;
  bookingRequest?: boolean | null;
  termsAccepted?: boolean | null;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #d7723d;">Booking request received</h2>
      <p style="margin: 0 0 12px; color: #333;">${params.fullName ? `Hi ${params.fullName},` : 'Hi,'} we have received your booking request. We will confirm availability and get back to you shortly.</p>
      <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
        ${params.fullName ? `<p style=\"margin:8px 0;\"><strong>Full Name:</strong> ${params.fullName}</p>` : ''}
        ${params.email ? `<p style=\"margin:8px 0;\"><strong>Email:</strong> ${params.email}</p>` : ''}
        ${params.phone ? `<p style=\"margin:8px 0;\"><strong>Phone:</strong> ${params.phone}</p>` : ''}
        ${params.country ? `<p style=\"margin:8px 0;\"><strong>Country:</strong> ${params.country}</p>` : ''}
        <p style="margin:8px 0;"><strong>Tour ID:</strong> ${params.tourId}</p>
        <p style="margin:8px 0;"><strong>Tour:</strong> ${params.tourTitle}</p>
        ${params.tourCategory ? `<p style=\"margin:8px 0;\"><strong>Category:</strong> ${params.tourCategory}</p>` : ''}
        <p style="margin:8px 0;"><strong>Date:</strong> ${params.tourDate}</p>
        <p style="margin:8px 0;"><strong>Participants:</strong> ${params.participants}</p>
        ${params.tourPrice ? `<p style=\"margin:8px 0;\"><strong>Displayed Price:</strong> ${params.tourPrice}</p>` : ''}
        <p style="margin:8px 0;"><strong>Total:</strong> $${params.totalPrice}</p>
        ${params.alternativeDate ? `<p style=\"margin:8px 0;\"><strong>Alternative Date:</strong> ${params.alternativeDate}</p>` : ''}
        ${params.pickupLocation ? `<p style=\"margin:8px 0;\"><strong>Pickup Location:</strong> ${params.pickupLocation}</p>` : ''}
        ${typeof params.informLater !== 'undefined' && params.informLater !== null ? `<p style=\"margin:8px 0;\"><strong>Inform Later:</strong> ${params.informLater ? 'Yes' : 'No'}</p>` : ''}
        ${params.specialRequests ? `<p style=\"margin:8px 0;\"><strong>Special Requests:</strong><br/>${params.specialRequests}</p>` : ''}
        ${typeof params.bookingRequest !== 'undefined' && params.bookingRequest !== null ? `<p style=\"margin:8px 0;\"><strong>Booking Request:</strong> ${params.bookingRequest ? 'Yes' : 'No'}</p>` : ''}
        ${typeof params.termsAccepted !== 'undefined' && params.termsAccepted !== null ? `<p style=\"margin:8px 0;\"><strong>Terms Accepted:</strong> ${params.termsAccepted ? 'Yes' : 'No'}</p>` : ''}
      </div>
      <p style="margin:16px 0 0; color:#666;">Outtour Azerbaijan</p>
    </div>
  `;
}


