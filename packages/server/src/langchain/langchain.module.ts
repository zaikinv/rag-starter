import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [LangchainService],
})
export class LangchainModule {}
