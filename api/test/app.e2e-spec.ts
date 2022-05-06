import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

import { getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            disableErrorMessages: false,
        }));
        await app.init();
    });

    describe('Auth', () => {
        it('/POST regist should return 201, true', () => {
            const send = {
                user: {
                    id: '01012341234',
                    pw: 'test',
                }
            };
            return request(app.getHttpServer())
                .post('/auth/regist')
                .set('Accept', 'application/json')
                .type('application/json')
                .send(send)
                .expect(201)
                .expect('true');
        });
        it('/POST regist should return 400', () => {
            const send  = { 
                user: {
                    id: '01012341234',
                }
            };
            return request(app.getHttpServer())
                .post('/auth/regist')
                .send(send)
                .expect(400);
        });
        it('/POST regist should return 500', () => {
            const send = {
                user: {
                    id: '01012341234',
                    pw: '12345',
                }
            };
            const userService = app.get(UserService);
            userService.save = jest.fn().mockRejectedValue(null);
            return request(app.getHttpServer())
                .post('/auth/regist')
                .send(send)
                .expect(500);
        });
    });

    describe('Login', () => {
        it('should return data that is string', async () => {
            const send = {
                user: {
                    id: '01012341234',
                    pw: 'test',
                },
            };
            await request(app.getHttpServer())
                .post('/auth/regist')
                .send(send)
                .expect(201);

            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ ...send.user })
                .expect(201);
        });
        it('should throw 401 error if params are not id, pw', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({})
                .expect(401);
        });
        it('should throw 400 error if id is not proper', async () => {
            const send = { id: '01012341235', pw: 'test' };

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(send)
                .expect(400);
        });
        it('should throw 401 error if pw is not proper', async () => {
            const send = {
                user: {
                    id: '01012341235',
                    pw: 'test',
                },
            };
            await request(app.getHttpServer())
                .post('/auth/regist')
                .send(send)
                .expect(201);

            const send2 = { ...send.user, pw: 'test2' };

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(send)
                .expect(401);
        });
        it('should throw 500 error if jwtService.sign return data that is not string', async () => {
            const send = {
                user: {
                    id: '01012341236',
                    pw: 'test',
                },
            };
            await request(app.getHttpServer())
                .post('/auth/regist')
                .send(send)
                .expect(201);

            const jwtService = app.get(JwtService);
            jwtService.sign = jest.fn().mockReturnValue(new Error());
            
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ ...send.user })
                .expect(500);
        });
        it('should throw 500 error if authService.validateUser throw error and return 500', () => {
            const send = { id: '01012341234', pw: 'test' };
            const authService = app.get(AuthService);
            authService.validateUser = jest.fn().mockResolvedValue({ status: 500 });
            return request(app.getHttpServer())
                .post('/auth/login')
                .send(send)
                .expect(500);
        });
        it('should throw 401 error if data is undefined', () => {
            const send = { id: '01012341234', pw: 'test' };
            const authService = app.get(AuthService);
            authService.validateUser = jest.fn().mockResolvedValue({ status: 200 });

            return request(app.getHttpServer())
                .post('/auth/login')
                .send(send)
                .expect(401);
        });
    });

    afterEach(async () => {
        await getConnection().dropDatabase();
        await app.close();
    });
});