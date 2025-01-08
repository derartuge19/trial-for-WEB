import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';

@Injectable()
export class EmailNotificationService {
  private mailTransport;

  constructor(private configService: ConfigService) {
    const SMTP_HOST =
      this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const SMTP_PORT = this.configService.get<number>('SMTP_PORT') || 587;
    const SMTP_USER = this.configService.get<string>('SMTP_USER'); // Gmail address (your-email@gmail.com)
    const SMTP_PASS = this.configService.get<string>('SMTP_PASS'); // App password generated in Google account

    // Creating the transporter using Gmail SMTP settings
    this.mailTransport = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false, // Use TLS (recommended for Gmail)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS, // App password here
      },
      tls: {
        rejectUnauthorized: false, // To handle self-signed certificates
      },
    });
  }

  // Send an email
  async send(sendEmailNotificationDto: SendEmailNotificationDto) {
    const { from, to, subject, text } = sendEmailNotificationDto;

    const mailOptions = {
      from,
      to,
      subject,
      text,
    };

    try {
      const info = await this.mailTransport.sendMail(mailOptions);
      console.log(`Message sent to ${to}. Message Id: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`Error sending email to ${to}. Error: ${error}`);
      throw error;
    }
  }
}
