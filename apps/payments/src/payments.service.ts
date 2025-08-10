import { NOTIFICATIONS_SERVICE } from '@app/common';
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
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_PRIVATE_KEY')!,
      {
        apiVersion: '2025-07-30.basil',
        // apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createCharge(
    { amount, email }: PaymentsCreateChargeDto
  ) {
    // ❗ dùng token test thay vì tạo từ raw card
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa', // ✅ token test
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },    
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`
    });

    return paymentIntent;
  }

}
