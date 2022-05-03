import { Test } from '@nestjs/testing';

import { UserService } from './user.service';

import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './user.entity';

class MockRepository {
    async findOne(): Promise<User | null> {
        return null;
    }

    async save(): Promise<boolean> {
        return true;
    }
}

describe('UserService', () => {
    let userService: UserService;
    let userRepository: MockRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockRepository,
                }
            ],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userRepository = moduleRef.get<MockRepository>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('findOne', () => {
        it('should be defined', () => {
            expect(userService.findOne).toBeDefined(); 
        });
        it('should return null', () => {
            const id = '01012341234';
            const returnValue = null
            jest.spyOn(userRepository, 'findOne').mockReturnValue(returnValue);

            expect(userService.findOne(id)).toBe(returnValue);
        });
        it('should return object', async () => {
            const id = '01012341234';
            const returnValue = { id, pw: 'test' };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(returnValue);

            const result = await userService.findOne(id);
            expect(userRepository.findOne).toBeCalled();
            expect(result).toEqual(returnValue);
        });
    });

    describe('save', () => {
        it('should return false if error occur', async () => {
            const user = new User();
            jest.spyOn(userRepository, 'save').mockRejectedValue(null);

            const result = await userService.save(user);
            expect(userRepository.save).toBeCalled();
            expect(result).toBeFalsy();
        });
        it('should return true', async () => {
            const user = new User();
            jest.spyOn(userRepository, 'save').mockResolvedValue(true);

            const result = await userService.save(user);
            expect(userRepository.save).toBeCalled();
            expect(result).toBeTruthy();
        });
    });

    describe
});