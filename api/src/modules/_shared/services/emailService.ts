import nodemailer from 'nodemailer';
import emailConfig from '../../../configs/email.config';
import IEmailService from './emailService.interface';

export class EmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: emailConfig.from,
      to: to,
      subject: subject,
      html: body
    };

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: false,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail(mailOptions);
  }
}
