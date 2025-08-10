// Global type declarations for missing modules
declare module '@nestjs/common' {
  export function Injectable(): ClassDecorator;
  export function Inject(token: any): ParameterDecorator;
  export function Module(metadata: any): ClassDecorator;
  export function Controller(prefix?: string): ClassDecorator;
  export function Get(path?: string): MethodDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Put(path?: string): MethodDecorator;
  export function Delete(path?: string): MethodDecorator;
  export function Body(): ParameterDecorator;
  export function Param(param?: string): ParameterDecorator;
  export function Query(): ParameterDecorator;
  export function UsePipes(...pipes: any[]): MethodDecorator & ClassDecorator;
  export class ValidationPipe {
    constructor(options?: any);
  }
  export class Logger {
    constructor(context?: string);
    log(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
  }
  export class UnauthorizedException extends Error {
    constructor(message?: string);
  }
  export class BadRequestException extends Error {
    constructor(message?: string);
  }
  export interface OnModuleInit {
    onModuleInit(): void | Promise<void>;
  }
  export interface OnModuleDestroy {
    onModuleDestroy(): void | Promise<void>;
  }
}

declare module '@nestjs/config' {
  export class ConfigService {
    get<T = string>(key: string): T;
    getOrThrow<T = string>(key: string): T;
  }
  export class ConfigModule {
    static forRoot(options?: any): any;
  }
}

declare module '@nestjs/microservices' {
  export class ClientProxy {
    emit(pattern: string, data: any): any;
    send(pattern: string, data: any): any;
    connect(): Promise<void>;
    close(): Promise<void>;
  }
  export class ClientsModule {
    static registerAsync(config: any[]): any;
  }
  export enum Transport {
    TCP = 'tcp'
  }
  export function MessagePattern(pattern: string): MethodDecorator;
  export function Payload(): ParameterDecorator;
  export function EventPattern(pattern: string): MethodDecorator;
}

declare module '@nestjs/jwt' {
  export class JwtService {
    sign(payload: any): string;
    verify(token: string): any;
  }
}

declare module 'stripe' {
  export default class Stripe {
    constructor(secretKey: string, options?: any);
    paymentIntents: {
      create(params: any): Promise<any>;
    };
  }
}

declare module 'joi' {
  const Joi: any;
  export = Joi;
}

declare module 'nestjs-pino' {
  export class LoggerModule {
    static forRoot(options?: any): any;
  }
}

declare module 'class-validator' {
  export function IsEmail(options?: any): PropertyDecorator;
  export function IsString(): PropertyDecorator;
  export function IsNumber(): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsDefined(): PropertyDecorator;
  export function IsNotEmptyObject(): PropertyDecorator;
  export function ValidateNested(): PropertyDecorator;
  export function IsCreditCard(): PropertyDecorator;
}

declare module 'class-transformer' {
  export function Type(typeFunction: () => any): PropertyDecorator;
}

declare module 'nodemailer' {
  export interface Transporter {
    sendMail(mailOptions: any): Promise<any>;
  }
  
  export function createTransport(options: any): Transporter;
}

declare module 'googleapis' {
  export const google: {
    auth: {
      OAuth2: new (
        clientId: string,
        clientSecret: string,
        redirectUri: string
      ) => {
        setCredentials(credentials: any): void;
        getAccessToken(): Promise<{ token?: string }>;
      };
    };
  };
}

declare module 'bcryptjs' {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
}

declare module 'express' {
  export interface Response {
    cookie(name: string, value: string, options?: any): Response;
  }
}

declare module 'rxjs' {
  export function of<T>(...args: T[]): Observable<T>;
  export function firstValueFrom<T>(source: Observable<T>): Promise<T>;
  export interface Observable<T> {
    pipe(...operators: any[]): Observable<T>;
  }
}

declare module 'rxjs/operators' {
  export function map<T, R>(project: (value: T) => R): any;
  export function catchError<T>(selector: (error: any) => Observable<T>): any;
  export function retry(count?: number): any;
  export function timeout(due: number): any;
} 