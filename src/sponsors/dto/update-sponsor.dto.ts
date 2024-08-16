import { PartialType } from '@nestjs/swagger';
import { CreateEventSponsorDto, CreateSponsorDto } from './create-sponsor.dto';

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {}

export class UpdateEventSponsorDto extends PartialType(CreateEventSponsorDto) {}
