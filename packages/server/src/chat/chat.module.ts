import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { LangchainService } from '../langchain/langchain.service';
import { HttpModule } from '@nestjs/axios';
import { MemoryService } from '../memory/memory.service';
import { MemoryModule } from '../memory/memory.module';

@Module({
  controllers: [],
  providers: [ChatService, LangchainService, MemoryService],
  imports: [HttpModule, MemoryModule],
  exports: [ChatService],
})
export class ChatModule {}
