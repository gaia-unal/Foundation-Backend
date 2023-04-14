import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  type: string;

  @Column('text')
  description: string;

  @Column('int')
  experience: number;

  @ManyToOne(() => Member, (member) => member.activity, {
    onDelete: 'CASCADE',
  })
  member: Member;
}
