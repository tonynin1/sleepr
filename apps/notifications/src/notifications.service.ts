import { Injectable, Logger } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class NotificationsService {
  private readonly transporter : nodemailer.Transporter;
  private readonly logger = new Logger();
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER')!,
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      }
    });

  }

  async notifyEmail({email, text}: NotifyEmailDto) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Sleepr Notification',
      text: text? text : ""
    })
    this.logger.log(email);
  }
}
