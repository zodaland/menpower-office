import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { InputUser } from '../user/dto';
import { User } from '../user/user.entity';

import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    regist(@Body('user') inputUser: InputUser) {
        console.log(inputUser.id);
        const user: User = plainToClass(User, inputUser);
        return this.authService.regist(user);
    }
}