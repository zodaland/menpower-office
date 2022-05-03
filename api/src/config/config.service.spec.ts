import { Test } from '@nestjs/testing';

import { ConfigService } from './config.service';

import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

jest.mock('path', () => ({
    resolve: jest.fn(),
}));
jest.mock('dotenv', () => ({
    parse: jest.fn().mockReturnValue({ TEST: 'test' }),
}));
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
}));


describe('configService', () => {
    let configService: ConfigService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: new ConfigService({ folder: './config' }),
                },
            ],
        }).compile();
        
        configService = moduleRef.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(configService).toBeDefined();
    });

    describe('get', () => {
        it('should return key value', () => {
            const returnObject = { TEST: 'test' };
            const param = 'TEST';

            jest.spyOn(dotenv, 'parse').mockReturnValue(returnObject);

            expect(configService.get(param)).toBe(returnObject[param]);
        });
    });
});