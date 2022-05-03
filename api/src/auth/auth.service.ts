import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';

import { User } from '../user/user.entity';

import { ResultWithStatus } from '../status/interfaces';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async regist(user: User): Promise<boolean> {
        try {
            await this.userService.save(user);
            return true;
        } catch (error) {
            return false;
        }
    }

    login(user: User): ResultWithStatus {
        const data = this.jwtService.sign({ user });
        return { status: 200, data };
    }

    async validateUser(user: User): Promise<ResultWithStatus> {
        try {
            const userRow = await this.userService.findOne(user.id);
            if (!userRow) return { status: 400 };
            if (userRow.pw !== user.pw) return { status: 401 };
            const { pw, ...data } = userRow;
            return { status: 200, data };
        } catch (error) {
            return { status: 500 };
        }
    }
}