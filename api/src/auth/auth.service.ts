import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async regist(user: User) {
        try {
            console.log(user);
            await this.userRepository.save(user);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}