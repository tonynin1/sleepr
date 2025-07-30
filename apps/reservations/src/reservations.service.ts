import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';

@Injectable()
export class ReservationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReservationsService.name);
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy
  ) { }

  async onModuleInit() {
    try {
      // Test connection to payments service
      await this.paymentsService.connect();
      this.logger.log('Successfully connected to payments service');

      // Optional: Test if service is actually responding
      await this.testPaymentsServiceConnection();
    } catch (error) {
      this.logger.error('Failed to connect to payments service', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      });
    }
  }
  private async testPaymentsServiceConnection(): Promise<void> {
    try {
      // Send a test ping to verify the service is responding
      await firstValueFrom(
        this.paymentsService
          .send('health_check', {})
          .pipe(
            timeout(5000),
            catchError((error) => {
              this.logger.warn('Payments service health check failed - service may not be ready:', error.message);
              return of({ status: 'unavailable' });
            })
          )
      );
      this.logger.log('Payments service health check passed');
    } catch (error) {
      this.logger.warn('Payments service health check failed:', error.message);
    }
  }
  async onModuleDestroy() {
    await this.paymentsService.close();
  }
  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsService
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }
  // Alternative approach using subscribe with proper error handling
  async createWithSubscribe(createReservationDto: CreateReservationDto, userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.paymentsService
        .send('create_charge', createReservationDto.charge)
        .pipe(
          timeout(10000),
          retry({ count: 3, delay: 2000 }),
          catchError((error) => {
            this.logger.error('Payment service error:', error);
            return of({ error: 'Payment failed', details: error.message });
          })
        )
        .subscribe({
          next: async (response) => {
            try {
              if (response.error) {
                reject(new Error(response.error));
                return;
              }

              this.logger.log('Payment response:', response);

              const reservation = await this.reservationsRepository.create({
                ...createReservationDto,
                timestamp: new Date(),
                userId,
              });

              resolve(reservation);
            } catch (dbError) {
              this.logger.error('Database error:', dbError);
              reject(dbError);
            }
          },
          error: (error) => {
            this.logger.error('Subscription error:', error);
            reject(error);
          }
        });
    });
  }
  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({
      _id
    });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    )
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
