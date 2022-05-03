import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { UserModule } from '../user/user.module';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule.register({ folder: './config'})],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
            }),
        }),
        UserModule,
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}