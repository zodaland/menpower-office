import { IsString, Length } from 'class-validator';

export class InputUser {
    @IsString()
    @Length(11, 11)
    id: string;

    @IsString()
    pw: string;
}