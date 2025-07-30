import { Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller("notifications")
export class NotificationsController {
  private readonly logger = new Logger();
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.logger.debug("oainsodiansdoias");
    return this.notificationsService.notifyEmail(data);
  }
  
  @Post("")
  async health_check(){
    
    // this.logger.debug("oainsodiansdoias");
    return this.notificationsService.notifyEmail({email:"vvo8hc@bosch.com", text: "test health check"})
  }
}
