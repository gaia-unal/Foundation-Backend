import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { MemberService } from 'src/member/member.service';
import { Repository } from 'typeorm';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { Foundation } from './entities/foundation.entity';

@Injectable()
export class FoundationService {
  private readonly logger = new Logger('FoundationService');

  constructor(
    @InjectRepository(Foundation)
    private readonly foundationRepository: Repository<Foundation>,
    private readonly memberService: MemberService,
  ) {}

  async create(createFoundationDto: CreateFoundationDto) {
    try {
      const foundation = this.foundationRepository.create({
        ...createFoundationDto,
        creationDate: new Date(),
      });

      await this.foundationRepository.save(foundation);
      return foundation;
    } catch (error) {
      this.logger.error(error.code);
      this.handleDBExceptions(error);
    }
  }

  async getFoundationNames() {
    try {
      const queryBuilder =
        this.foundationRepository.createQueryBuilder('foundations');

      const foundationNames = await queryBuilder
        .select(['foundations.id', 'foundations.name'])
        .getMany();

      return foundationNames;
    } catch (error) {
      this.logger.error(error.code);
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const foundation = await this.foundationRepository.findOneBy({ id });
    if (!foundation)
      throw new BadRequestException(`Foundation with id ${id} not found`);

    return foundation;
  }

  async findOnePlain(id: string) {
    const { members = [], ...foundation } = await this.findOne(id);

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

    return {
      ...foundation,
      members: membersWithLevels,
    };
  }

  async update(id: string, updateFoundationDto: UpdateFoundationDto) {
    try {
      const foundation = await this.findOne(id);

      const updatedFoundation = this.foundationRepository.merge(foundation, {
        ...updateFoundationDto,
      });

      console.log(updatedFoundation);
      await this.foundationRepository.save(updatedFoundation);
      return updatedFoundation;
    } catch (error) {
      this.logger.error(error.code);
      this.handleDBExceptions(error);
    }
  }

  async addMember(id: string, member: CreateMemberDto) {
    const foundation = await this.findOne(id);

    const newMember = await this.memberService.create(member);
    // const newMember = await this.memberService.create(member);

    const updatedFoundation = this.foundationRepository.merge(foundation, {
      members: [...foundation.members, newMember],
    });

    await this.foundationRepository.save(updatedFoundation);
    return updatedFoundation;
  }

  async remove(id: string) {
    const foundation = await this.findOne(id);
    await this.foundationRepository.remove(foundation);
    return foundation;
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
