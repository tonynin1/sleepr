import { NOTIFICATIONS_SERVCE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVCE) private readonly notificationsService : ClientProxy
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_PRIVATE_KEY')!,
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createCharge(
    {card, amount, email} : PaymentsCreateChargeDto
  ) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card
    // })
    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   payment_method: paymentMethod.id,
    //   amount: amount * 100,
    //   confirm: true,
    //   currency: 'usd'
    // });
    
    this.notificationsService.emit('notify_email', { email });
    // return paymentIntent;
  }

}
