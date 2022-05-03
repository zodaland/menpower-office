import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import { User } from '../user/user.entity';

import { ResultWithStatus } from '../status/interfaces';

class UserMockService {
    findOne(id: string): Promise<User | null> {
        return null;
    }
    async save(user: User): Promise<boolean> {
        return true;
    }
}

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useClass: UserMockService,
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
        userService = moduleRef.get<UserService>(UserService);
        jwtService = moduleRef.get<JwtService>(JwtService);
    });
    
    it('should be defined', () => {
        expect(authService).toBeDefined(); 
    });

    describe('regist', () => {
        it('should be defined', () => {
            expect(authService.regist).toBeDefined();   
        });
        it('should return false if error occur', async () => {
            const user = new User();
            jest.spyOn(userService, 'save').mockRejectedValue(null);

            const result = await authService.regist(user);
            expect(userService.save).toBeCalled();
            expect(result).toBeFalsy();
        });
        it('should return true', async () => {
            const user = new User();
            jest.spyOn(userService, 'save').mockResolvedValue(null);

            const result = await authService.regist(user);
            expect(userService.save).toBeCalled();
            expect(result).toBeTruthy();
        });
    });

    describe('login', () => {
        it('should be defined', () => {
            expect(authService.login).toBeDefined();   
        });
        it('should return status 200 and data', () => {
            const user = new User();
            const returnValue = { status: 200, data: 'TOKEN' };
            jwtService.sign = jest.fn().mockReturnValue(returnValue.data);

            const result = authService.login(user);
            expect(jwtService.sign).toBeCalled();
            expect(authService.login(user)).toEqual(returnValue);
        });
    });

    describe('validateUser', () => {
        it('should be defined', () => {
            expect(authService.validateUser).toBeDefined();   
        });
        it('should return status 400 if userService.findOne return null', async () => {
            const user = new User();
            const returnValue = { status: 400 };
            userService.findOne = jest.fn().mockResolvedValue(null);

            const result = await authService.validateUser(user);
            expect(userService.findOne).toBeCalled();
            expect(result).toEqual(returnValue);
        });
        it('should return status 401 if pw is now equal', async () => {
            const user: User = { id: '01012341234', pw: 'test' };
            const findUser: User = { id: '01012341234', pw: 'tes' };
            const returnValue = { status: 401 };
            userService.findOne = jest.fn().mockResolvedValue(findUser);

            const result = await authService.validateUser(user);
            expect(userService.findOne).toBeCalled();
            expect(result).toEqual(returnValue);
        });
        it('should return status 500 if error occur', async () => {
            const user = new User();
            const returnValue = { status: 500 };
            userService.findOne = jest.fn().mockRejectedValue(null);

            const result = await authService.validateUser(user);
            expect(userService.findOne).toBeCalled();
            expect(result).toEqual(returnValue);
        });
        it('should return status 200 and data', async () => {
            const user: User = { id: '01012341234', pw: 'test' };
            const { pw, ...data } = user;
            const returnValue = { status: 200, data };
            userService.findOne = jest.fn().mockResolvedValue(user);

            const result = await authService.validateUser(user);
            expect(userService.findOne).toBeCalled();
            expect(result).toEqual(returnValue);
        });
    });
});