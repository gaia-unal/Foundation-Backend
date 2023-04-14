import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';

@Controller('foundation')
export class FoundationController {
  constructor(private readonly foundationService: FoundationService) {}

  @Post()
  create(@Body() createFoundationDto: CreateFoundationDto) {
    return this.foundationService.create(createFoundationDto);
  }
  @Post(':id/member')
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.foundationService.addMember(id, createMemberDto);
  }

  @Get()
  findAll() {
    return this.foundationService.getFoundationNames();
  }

  @Get(':id')
  findOnePlain(@Param('id', ParseUUIDPipe) id: string) {
    return this.foundationService.findOnePlain(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFoundationDto: UpdateFoundationDto,
  ) {
    return this.foundationService.update(id, updateFoundationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.foundationService.remove(id);
  }
}
