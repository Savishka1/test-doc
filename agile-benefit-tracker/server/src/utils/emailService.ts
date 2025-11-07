import nodemailer from 'nodemailer';
import { ClaimStatus } from '../models/enums';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendClaimSubmissionEmail = async (
  toEmail: string,
  claimId: string,
  amount: number
) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: 'Claim Submitted Successfully',
    html: `
      <h2>Your claim has been submitted</h2>
      <p>Claim ID: <strong>${claimId}</strong></p>
      <p>Amount: <strong>LKR ${amount.toFixed(2)}</strong></p>
      <p>Your claim is now pending HR approval.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Submission email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending submission email:', error);
  }
};

export const sendClaimStatusEmail = async (
  toEmail: string,
  claimId: string,
  status: ClaimStatus,
  comment?: string
) => {
  let subject = '';
  let message = '';

  switch (status) {
    case ClaimStatus.APPROVED:
      subject = 'Claim Approved';
      message = '<p>Your claim has been approved by HR and forwarded to Accounts for payment.</p>';
      break;
    case ClaimStatus.REJECTED:
    case ClaimStatus.AUTO_REJECTED:
      subject = 'Claim Rejected';
      message = `<p>Your claim has been rejected.</p>${comment ? `<p><strong>Reason:</strong> ${comment}</p>` : ''}
                 <p>You can edit and resubmit your claim.</p>`;
      break;
    case ClaimStatus.PAID:
      subject = 'Payment Processed';
      message = '<p>Your reimbursement has been processed and payment has been completed.</p>';
      break;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>Claim ID: <strong>${claimId}</strong></p>
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending status email:', error);
  }
};
