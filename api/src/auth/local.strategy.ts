import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

import { User } from '../user/user.entity';
import { InputUser } from '../user/dto';

import { plainToClass } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'id',
            passwordField: 'pw',
        });
    }

    async validate(id: string, pw: string): Promise<User> {
        const user: User = { id, pw };
        const { status, data }= await this.authService.validateUser(user);
        if (status === 500) throw new InternalServerErrorException();
        if (status === 400) throw new BadRequestException();
        if (!data || status === 401) throw new UnauthorizedException();
        return data;
    }
}