import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({
        type: 'varchar',
        length: 11,
        unsigned: true,
    })
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    pw: string;
}