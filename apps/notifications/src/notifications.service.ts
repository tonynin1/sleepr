import { Injectable, Logger } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
@Injectable()
export class NotificationsService {
  private transporter : nodemailer.Transporter;
  private readonly logger = new Logger();
  constructor(
    private readonly configService: ConfigService,
  ) {
    const oAuth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground', // hoặc redirect_uri bạn đăng ký
    );

    oAuth2Client.setCredentials({
      refresh_token: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    });

    oAuth2Client.getAccessToken().then((accessToken) => {
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
