import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    findOne(id: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
        });
    }

    async save(user: User): Promise<boolean> {
        try {
            await this.userRepository.save(user);
            return true;
        } catch (error) {
            return false;
        }
    }
}