import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastName: string;

  @Column('text', {
    unique: true,
  })
  identification: string;

  @Column('date')
  birthDate: string;
}
