import { Person } from 'src/person/entity/person.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Family extends Person {
  @Column('text')
  relation: string;

  @ManyToOne(() => Member, (member) => member.family, {
    onDelete: 'CASCADE',
  })
  member: Member;
}
