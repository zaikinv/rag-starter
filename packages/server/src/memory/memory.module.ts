import { Module } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

const MemoryFactory: FactoryProvider<Redis> = {
  provide: 'MemoryClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    });

    redisInstance.on('error', (error) => {
      throw new Error(`Redis connection failed: ${error}`);
    });

    return redisInstance;
  },
  inject: [],
};

@Module({
  providers: [MemoryFactory],
  exports: [MemoryFactory],
})
export class MemoryModule {}
