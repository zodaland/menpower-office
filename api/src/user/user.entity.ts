import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({
        type: 'int',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    pw: string;
}