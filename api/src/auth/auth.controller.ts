import { Controller, Post, Body, Request, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

import { InputUser } from '../user/dto';
import { User } from '../user/user.entity';

import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/regist')
    async regist(@Body('user') inputUser: InputUser) {
        const user: User = plainToClass(User, inputUser);
        const isCreated = await this.authService.regist(user);
        if (!isCreated) throw new InternalServerErrorException();
        return true;
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req) {
        const { status, data }= this.authService.login(req.user);
        if (!data || status !== 200) throw new InternalServerErrorException();
        return data;
    }
}