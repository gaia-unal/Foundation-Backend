import { Foundation } from 'src/foundation/entities/foundation.entity';
import { Person } from 'src/person/entity/person.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';
import { Education } from './education.entity';
import { Family } from './family.entity';
import { Level } from './level.entity';

@Entity()
export class Member extends Person {
  @Column('text')
  address: string;

  @Column('text')
  phone: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @OneToMany(() => Level, (level) => level.member, {
    cascade: true,
    eager: true,
  })
  level?: Level[];

  @OneToMany(() => Family, (family) => family.member, {
    cascade: true,
    eager: true,
  })
  family?: Family[];

  @OneToMany(() => Education, (education) => education.member, {
    cascade: true,
    eager: true,
  })
  education?: Education[];

  @OneToMany(() => Activity, (activity) => activity.member, {
    cascade: true,
    eager: true,
  })
  activity?: Activity[];

  @ManyToOne(() => Foundation, (foundation) => foundation.members, {
    onDelete: 'CASCADE',
  })
  foundation: Foundation;
}
