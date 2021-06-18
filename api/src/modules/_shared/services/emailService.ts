import nodemailer from 'nodemailer';
import configs from '../../../configs';
import IEmailService from './emailService.interface';

export class EmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: configs.EMAIL_SMTP_FROM,
      to: to,
      subject: subject,
      html: body
    };

    const transporter = nodemailer.createTransport({
      host: configs.EMAIL_SMTP_HOST,
      port: configs.EMAIL_SMTP_PORT,
      secure: false,
      auth: {
        user: configs.EMAIL_SMTP_USER,
        pass: configs.EMAIL_SMTP_PASSWORD
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail(mailOptions);
  }
}
