import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LangchainModule } from './langchain/langchain.module';
import { ChatService } from './chat/chat.service';
import { LangchainService } from './langchain/langchain.service';
import { AppGateway } from './app.gateway';
import { HttpModule } from '@nestjs/axios';
import { MemoryModule } from './memory/memory.module';
import { MemoryService } from './memory/memory.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ChatModule,
    LangchainModule,
    MemoryModule,
  ],
  controllers: [],
  providers: [
    ChatService,
    LangchainService,
    AppGateway,
    MemoryService,
  ],
})
export class AppModule {}
