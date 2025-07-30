import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository){}
    async create(createUserDto: CreateUserDto){
      await this.validateCreateUserDto(createUserDto);
      return this.usersRepository.create({
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10)
      })
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
      try {
        await this.usersRepository.findOne({ email: createUserDto.email })
      } catch (error) {
        return;
      }

      throw new UnprocessableEntityException('Email already exists.')
    }
    async getUser(getUserDto: GetUserDto){
      return this.usersRepository.findOne(getUserDto)
    }
    findAll() {
        return this.usersRepository.find({});
      }
    
    findOne(_id: string) {
      return this.usersRepository.findOne({
        _id
      });
    }
    
    findOneByEmail(email: string){
      return this.usersRepository.findOne({
        email
      });
    }
    update(_id: string, updateUserDto: UpdateUserDto) {
      return this.usersRepository.findOneAndUpdate(
        {_id},
        {$set: updateUserDto},
      )
    }
  
    remove(_id: string) {
      return this.usersRepository.findOneAndDelete({_id});
    }

    
}
