import { Controller, UsePipes, ValidationPipe, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  @Post("")
  async createCharge(
    @Payload() data: CreateChargeDto
  ){
     return this.paymentsService.createCharge(data);
  }
}
