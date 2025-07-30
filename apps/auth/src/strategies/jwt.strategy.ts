import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { TokenPayLoad } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) =>
                    request?.cookies?.Authentication || request?.Authentication,
            ]),
            secretOrKey: configService.get('JWT_SECRET')!,
    });
    }

    async validate({ userId }: TokenPayLoad) {
        return this.usersService.getUser({ _id: userId })
    }
}