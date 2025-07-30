import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_PRIVATE_KEY')!,
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async createCharge(
    {card, amount} : CreateChargeDto
  ) {
    const paymentMethods = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethods.id,
      amount: amount * 100,
      payment_method_types: ['card'],
      currency: 'usd'
    })
    
    return paymentIntent;
  }

}
