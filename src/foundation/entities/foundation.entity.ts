import { Member } from 'src/member/entities/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Foundation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  identification: string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('text')
  adminEmail: string;

  @Column('text')
  address: string;

  @Column('text')
  email: string;

  @Column('text')
  phone: string;

  @Column('text')
  logo: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('date')
  creationDate: Date;

  @OneToMany(() => Member, (member) => member.foundation, {
    cascade: true,
    eager: true,
  })
  members?: Member[];
}
