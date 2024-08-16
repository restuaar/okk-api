import { PartialType } from '@nestjs/swagger';
import { CreateEventSpeakerDto, CreateSpeakerDto } from './create-speaker.dto';

export class UpdateSpeakerDto extends PartialType(CreateSpeakerDto) {}

export class UpdateEventSpeakerDto extends PartialType(CreateEventSpeakerDto) {}
