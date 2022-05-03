import { Test } from '@nestjs/testing';

import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

describe('LocalStrategy', () => {
    const id = '01012341234';
    const pw = 'test';
    let localStrategy: LocalStrategy;
    let authService: AuthService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                LocalStrategy,
                AuthService,
                UserService,
                {
                    provide: JwtService,
                    useFactory: () => ({
                        secret: 'test',
                    }),
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: jest.fn(),
                },
            ],
        }).compile();

        localStrategy = moduleRef.get<LocalStrategy>(LocalStrategy);
        authService = moduleRef.get<AuthService>(AuthService);
    });

    describe('validate', () => {
        it('should be defined', () => {
            expect(localStrategy.validate).toBeDefined();
        });
        it('should return bad request error if status 400', async () => {
            const serviceResult = { status: 400 };
            authService.validateUser = jest.fn().mockResolvedValue(serviceResult);

            await expect(async () => {
                await localStrategy.validate(id, pw);
            }).rejects.toThrow();
            expect(authService.validateUser).toBeCalled();
        });
        it('should return unauthorized error if status 401', async () => {
            const serviceResult = { status: 401 };
            authService.validateUser = jest.fn().mockResolvedValue(serviceResult);

            await expect(async () => {
                await localStrategy.validate(id, pw);
            }).rejects.toThrow();
            expect(authService.validateUser).toBeCalled();
        });
        it('should return unauthorized error if data is undefined', async () => {
            const serviceResult = { status: 200 };
            authService.validateUser = jest.fn().mockResolvedValue(serviceResult);

            await expect(async () => {
                await localStrategy.validate(id, pw);
            }).rejects.toThrow();
            expect(authService.validateUser).toBeCalled();
        });
        it('should return internal server error if status 500', async () => {
            const serviceResult = { status: 500 };
            authService.validateUser = jest.fn().mockResolvedValue(serviceResult);

            await expect(async () => {
                await localStrategy.validate(id, pw);
            }).rejects.toThrow();
            expect(authService.validateUser).toBeCalled();
        });
        it('should return User data without pw', async () => {
            const user = { id, pw };
            const serviceResult = { status: 200, data : { ...user } };
            authService.validateUser = jest.fn().mockResolvedValue(serviceResult);

            const result = await localStrategy.validate(id, pw);
            expect(authService.validateUser).toBeCalled();
            expect(result).toEqual(user);
        });
    });
});
