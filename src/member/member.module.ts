import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Level } from './entities/level.entity';
import { Family } from './entities/family.entity';
import { Education } from './entities/education.entity';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Level, Family, Education, Activity]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
