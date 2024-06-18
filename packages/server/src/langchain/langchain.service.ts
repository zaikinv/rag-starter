import { Injectable } from '@nestjs/common';
import { ChatOpenAI, OpenAIChatInput } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { IterableReadableStream } from '@langchain/core/dist/utils/stream';

import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Runnable } from '@langchain/core/runnables';
import { z } from 'zod';
import type { ClientOptions } from 'openai';
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import {
  promptContextualize,
  promptIsAnswered,
  promptRag,
} from '../utils/prompts';
import { Document } from '@langchain/core/documents';

@Injectable()
export class LangchainService {
  constructor() {}
  private llmOptions: Partial<OpenAIChatInput> &
    BaseChatModelParams & {
      configuration?: ClientOptions;
    } = {
    temperature: 0,
    configuration: {
      defaultHeaders: {
        'api-key': process.env.OPENAI_API_KEY,
      },
      baseURL: process.env.OPENAI_BASE_URL,
    },
  };

  private llm: Record<string, ChatOpenAI> = {
    base: new ChatOpenAI(this.llmOptions),
    streaming: new ChatOpenAI({
      ...this.llmOptions,
      streaming: true,
    }),
  };

  private async createRagChain() {
    const ragChain = await createStuffDocumentsChain({
      llm: this.llm.streaming,
      prompt: promptRag,
      outputParser: new StringOutputParser(),
    });

    return ragChain;
  }

  public async getContextualizedQuestion(
    input: string,
    chat_history: Array<HumanMessage | AIMessage>,
  ): Promise<string> {
    if (chat_history.length === 0) {
      return Promise.resolve(input);
    }

    const contextualizeQChain = promptContextualize
      // const contextualizeQChain = prompt
      .pipe(this.llm.base)
      .pipe(new StringOutputParser());

    return contextualizeQChain.invoke({
      chat_history,
      input,
    });
  }

  public async isAnswered(answer: string): Promise<boolean> {
    const input = `This is the answer from AI: ${answer}. Did the AI know the answer?`;

    const Schema = z.object({
      isAnswered: z.boolean().describe('Whether AI knew the answer or not.'),
    });

    let chain: Runnable;

    chain = promptIsAnswered.pipe(
      this.llm.base.withStructuredOutput(Schema, {
        name: 'isAnswered',
      }),
    );

    const result = await chain.invoke({
      input,
    });

    return result.isAnswered;
  }

  public async getAnswerStream(
    question: string,
    context: Array<Document>,
  ): Promise<IterableReadableStream<string>> {
    const ragChain = await this.createRagChain();

    return await ragChain.stream({
      context,
      question,
    });
  }
}
