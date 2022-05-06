import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../user/user.entity';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: () => {},
                },
                {
                    provide: JwtService,
                    useFactory: () => ({
                        secret: 'test',
                    }),
                },
            ],
        }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should throw if status is not 200', async () => {
            const request = { id: 'test' };
            const result = { status: 400 };
            jest.spyOn(authService, 'login').mockImplementation(() => result);

            await expect(async () => {
                await authController.login(request) 
            }).rejects.toThrow();
        });

        it('should throw if data is not defined', async () => {
            const request = { id: 'test' };
            const result = null;
            jest.spyOn(authService, 'login').mockImplementation(() => result);

            await expect(async () => {
                await authController.login(request);
            }).rejects.toThrow();
        });
        it('should return data', async () => {
            const request = { id: 'test' };
            const result = { status: 200, data: 'TOKEN' };
            jest.spyOn(authService, 'login').mockImplementation(() => result);

            expect(await authController.login(request)).toBe(result.data);
        });

    });

    describe('regist', () => {
        it('should 500 error if authService.save return false', async () => {
            const request = { id: '01012341234', pw: 'test' };
            jest.spyOn(authService, 'regist').mockResolvedValue(false);

            await expect(async () => {
                await authController.regist(request)
            }).rejects.toThrow();
        });
        it('should return true', async () => {
            const request = { id: '01012341234', pw: 'test' };
            jest.spyOn(authService, 'regist').mockResolvedValue(true);

            expect(await authController.regist(request)).toBe(true);
        });
    });
});