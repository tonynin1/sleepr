import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@app/common';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService){}
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMe(
    @CurrentUser() user: UserDocument,
  ){
    return user;
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate (
    @Payload() data: any
  ) {
    return data.user;
  }
}
