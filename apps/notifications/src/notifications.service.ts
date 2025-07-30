import { Injectable, Logger } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger();
  async notifyEmail(data: NotifyEmailDto){
      this.logger.log(data);
  }
}
