import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { FilterModule } from './filter/filter.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DivisionsModule } from './divisions/divisions.module';
import { OrganizersModule } from './organizers/organizers.module';
import { MeetingsModule } from './meetings/meetings.module';
import { GroupsModule } from './groups/groups.module';
import { MenteesModule } from './mentees/mentees.module';
import { MentoringsModule } from './mentorings/mentorings.module';
import { EventsModule } from './events/events.module';
import { SponsorsModule } from './sponsors/sponsors.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    FilterModule,
    AuthModule,
    UsersModule,
    DivisionsModule,
    OrganizersModule,
    MeetingsModule,
    GroupsModule,
    MenteesModule,
    MentoringsModule,
    EventsModule,
    SponsorsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
