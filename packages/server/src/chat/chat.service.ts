import { Inject, Injectable } from '@nestjs/common';
import { CustomRetriever } from '../utils/retriever';
import { Document } from '@langchain/core/documents';
import { LangchainService } from '../langchain/langchain.service';
import { Socket } from 'socket.io';
import { MemoryService } from '../memory/memory.service';

type Message = {
  status: 'streaming' | 'completed' | 'idle';
  data?: {
    message?: string;
    vectorStoreCollectionName?: string;
    sources?: Array<{ url: string; score: number }>;
    debug?: Record<any, any>;
  };
};

@Injectable()
export class ChatService {
  constructor(
    private langchainService: LangchainService,
    private memoryService: MemoryService,
  ) {}

  async getResponse(userMessage: Message, client: Socket) {
    const clientId = client.id;
    let assistantMessage = '';

    const chatHistory = await this.memoryService.getChatHistory(clientId);

    const contextualizedUserQuestion =
      await this.langchainService.getContextualizedQuestion(
        userMessage.data.message,
        chatHistory,
      );

    client.emit('message', {
      status: 'streaming',
      data: {
        debug: {
          question: contextualizedUserQuestion,
        },
      },
    } as Message);

    const documents: Array<Document> = await this.getRelevantDocuments(
      contextualizedUserQuestion,
      userMessage.data.vectorStoreCollectionName,
    );

    client.emit('message', {
      status: 'streaming',
      data: {
        debug: {
          documents,
        },
      },
    } as Message);

    const stream = await this.langchainService.getAnswerStream(
      contextualizedUserQuestion,
      documents,
    );

    for await (const chunk of stream) {
      client.emit('message', {
        status: 'streaming',
        data: {
          message: chunk,
        },
      } as Message);
      assistantMessage += chunk;
    }

    await this.memoryService.addToChatHistory(clientId, {
      type: 'human',
      text: userMessage.data.message,
    });

    await this.memoryService.addToChatHistory(clientId, {
      type: 'assistant',
      text: assistantMessage,
    });

    const isAnswered = await this.langchainService.isAnswered(assistantMessage);

    const sources = isAnswered ? await this.getDocumentSources(documents) : [];

    client.emit('message', {
      status: 'completed',
      data: {
        message: assistantMessage,
        sources,
      },
    } as Message);

    client.emit('message', {
      status: 'idle',
    } as Message);
  }

  private async getRelevantDocuments(
    query: string,
    vectorStoreCollectionName: string,
  ): Promise<Array<Document>> {
    const retriever = new CustomRetriever(vectorStoreCollectionName);

    return await retriever.invoke(query);
  }

  private async getDocumentSources(
    documents: Array<Document>,
  ): Promise<Array<{ url: string; score: number }>> {
    const sourcesMap = new Map<string, number>();

    documents.forEach((doc) => {
      const url = doc.metadata.source as string;
      const score = doc.metadata.score as number;
      if (!sourcesMap.has(url)) {
        sourcesMap.set(url, score);
      }
    });

    const sources = Array.from(sourcesMap).map(([url, score]) => ({
      url,
      score,
    }));

    return Promise.resolve(sources);
  }
}
