import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository){}
    async create(createUserDto: CreateUserDto){
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        })
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
