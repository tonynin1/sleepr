import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepository: ReservationsRepository) {}
  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId 
    })
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
      {_id},
      {$set: updateReservationDto},
    )
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({_id});
  }
}
