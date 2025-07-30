import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto
  ){
     return this.paymentsService.createCharge(data);
  }

  @MessagePattern('health_check')
  async healthCheck() {
    return { status: 'ok', timestamp: new Date() };
  }
}
