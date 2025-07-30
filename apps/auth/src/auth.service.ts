import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs'
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVCE } from '@app/common';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(NOTIFICATIONS_SERVCE) private readonly notificationsService : ClientProxy
  ) { }

  async verifyUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    
    return user;
  }

  async login (user: UserDocument, response: Response) {
    const tokenPayLoad = {
      userId: user._id.toHexString()
    }
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + Number(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const token = this.jwtService.sign(tokenPayLoad);

    await this.notificationsService.emit('notify_email', {email: user.email, text: "you are sign in Sleepr"});
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

  }
}
