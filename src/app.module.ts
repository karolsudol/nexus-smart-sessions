import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionController } from './controllers/session.controller';
import { SessionService } from './services/session.service';
import { NexusClientService } from './services/nexus-client.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService, NexusClientService],
})
export class AppModule {} 