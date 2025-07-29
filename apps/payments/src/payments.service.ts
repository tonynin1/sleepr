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

  async createCharge({ card, amount }: CreateChargeDto) {
    const token = await this.stripe.tokens.create({
      type: 'card',
      card
    });
    const charge = await this.stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: token.id,
    });

    return charge;
  }

}
