import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  level: string;

  @Column('text')
  title: string;

  @Column('text')
  institution: string;

  @Column('date')
  startDate: string;

  @Column('date', {
    nullable: true,
  })
  endDate: string;

  @Column('boolean')
  completed: boolean;

  @ManyToOne(() => Member, (member) => member.education, {
    onDelete: 'CASCADE',
  })
  member: Member;
}
