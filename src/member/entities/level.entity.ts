import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  level: number;

  @Column('date')
  date: Date;

  @Column('boolean')
  active: boolean;

  @ManyToOne(() => Member, (member) => member.level, {
    onDelete: 'CASCADE',
  })
  member: Member;
}
