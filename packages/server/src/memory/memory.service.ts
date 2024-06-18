import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

const oneDayInSeconds = 60 * 60 * 24;

type Message = {
  type: 'human' | 'assistant';
  text: string;
};

@Injectable()
export class MemoryService implements OnModuleDestroy {
  constructor(@Inject('MemoryClient') private readonly memoryClient: Redis) {}

  onModuleDestroy(): void {
    this.memoryClient.disconnect();
  }

  async getChatHistory(
    clientId: string,
  ): Promise<Array<HumanMessage | AIMessage>> {
    try {
      const chatHistoryRaw = await this.memoryClient.lrange(clientId, 0, -1);
      return chatHistoryRaw.map((message) => {
        const parsedMessage: Message = JSON.parse(message);
        if (parsedMessage.type === 'human') {
          return new HumanMessage(parsedMessage.text);
        } else if (parsedMessage.type === 'assistant') {
          return new AIMessage(parsedMessage.text);
        } else {
          throw new Error(`Unknown message type: ${parsedMessage.type}`);
        }
      });
    } catch (error) {
      console.error(
        `Failed to get chat history for client ${clientId}:`,
        error,
      );
      throw new Error('Failed to get chat history');
    }
  }

  async addToChatHistory(clientId: string, message: Message): Promise<number> {
    try {
      const messageString = JSON.stringify(message);
      const result = await this.memoryClient.rpush(clientId, messageString);
      await this.memoryClient.expire(clientId, oneDayInSeconds);
      return result;
    } catch (error) {
      console.error(
        `Failed to add message to chat history for client ${clientId}:`,
        error,
      );
      throw new Error('Failed to add message to chat history');
    }
  }
}
