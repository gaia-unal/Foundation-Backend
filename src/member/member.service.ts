import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Family } from './entities/family.entity';
import { Level } from './entities/level.entity';
import { Member } from './entities/member.entity';
import { Education } from './entities/education.entity';
import { Activity } from './entities/activity.entity';

@Injectable()
export class MemberService {
  private readonly logger = new Logger('MemberService');
  constructor(
    @InjectRepository(Member)
    public readonly memberRepository: Repository<Member>,

    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,

    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,

    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,

    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}
  async create(createMemberDto: CreateMemberDto) {
    try {
      const {
        family = [],
        education = [],
        activity = [],
        ...createMember
      } = createMemberDto;

      const initialLevel = [
        {
          level: 1,
          date: new Date(),
          active: true,
        },
      ];

      const member = this.memberRepository.create({
        ...createMember,
        level: initialLevel.map((l) => this.levelRepository.create(l)),
        family: family.map((f) => this.familyRepository.create(f)),
        education: education.map((e) => this.educationRepository.create(e)),
        activity: activity.map((a) => this.activityRepository.create(a)),
      });

      await this.memberRepository.save(member);
      return member;
    } catch (error) {
      this.logger.error(error.code);
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const querybuilder = this.memberRepository.createQueryBuilder('member');

    const members = await querybuilder
      .leftJoinAndSelect('member.level', 'level')
      .getMany();

    const membersWithLevels = members.map((member) => {
      const level = member.level.filter((lev) => lev.active === true);
      return {
        ...member,
        level: level[0].level,
      };
    });

    return membersWithLevels;
  }

  async findOne(id: string) {
    const member = await this.memberRepository.findOneBy({
      id,
    });
    if (!member)
      throw new BadRequestException(`Member with id ${id} not found`);

    return member;
  }

  async searchMembersByCategory(category: string, param: string, key: string) {
    const querybuilder = this.memberRepository.createQueryBuilder('member');
    let members = [];

    if (category === 'basic_info') {
      members = await querybuilder
        .leftJoinAndSelect(`member.level`, 'level')
        .where(`LOWER(member.${param}) LIKE :${key}`, { [key]: `%${key}%` })
        .getMany();
    } else {
      members = await querybuilder
        .leftJoinAndSelect(`member.${category}`, `${category}`)
        .leftJoinAndSelect(`member.level`, 'level')
        .where(`${category}.${param} LIKE  :${key}`, { [key]: `%${key}%` })
        .getMany();
    }

    if (!members)
      throw new BadRequestException(`No members found with ${param} ${key}`);

    const membersWithLevels = members.map((member) => {
      const level = member.level.filter((lev) => lev.active === true);
      return {
        id: member.id,
        name: member.name,
        lastName: member.lastName,
        address: member.address,
        birthDate: member.birthDate,
        email: member.email,
        phone: member.phone,
        identification: member.identification,
        level: level[0].level,
      };
    });

    return membersWithLevels;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id);

    const {
      family = [],
      education = [],
      activity = [],
      ...updateMember
    } = updateMemberDto;

    const familyIds = member.family.map((f) => f.id);
    const educationIds = member.education.map((e) => e.id);
    const activityIds = member.activity.map((a) => a.id);

    familyIds.map((f) => {
      this.familyRepository.delete(f);
    });

    educationIds.map((e) => {
      this.educationRepository.delete(e);
    });

    activityIds.map((a) => {
      this.activityRepository.delete(a);
    });

    const updatedMember = await this.memberRepository.merge(member, {
      ...updateMember,
      family: family.map((f) => this.familyRepository.create(f)),
      education: education.map((e) => this.educationRepository.create(e)),
      activity: activity.map((a) => this.activityRepository.create(a)),
    });

    await this.memberRepository.save(updatedMember);
    return this.findOne(id);
  }

  async levelUp(id: string) {
    const member = await this.findOne(id);

    const currentLevel = member.level.filter((l) => l.active === true);

    if (currentLevel[0].level === 3)
      throw new BadRequestException('Member is already at the highest level');

    const inactiveLevel = this.levelRepository.merge(currentLevel[0], {
      active: false,
    });
    const newLevel = this.levelRepository.create({
      level: currentLevel[0].level + 1,
      date: new Date(),
      active: true,
    });

    const updatedMember = this.memberRepository.merge(member, {
      level: [...member.level, inactiveLevel, newLevel],
    });

    await this.memberRepository.save(updatedMember);
    return updatedMember;
  }

  async remove(id: string) {
    const member = await this.findOne(id);
    await this.memberRepository.remove(member);
    return member;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === '23502')
      throw new BadRequestException(`${error.column} column is required`);

    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
