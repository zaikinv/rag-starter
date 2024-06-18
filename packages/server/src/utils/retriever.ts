import {
  BaseRetriever,
  type BaseRetrieverInput,
} from '@langchain/core/retrievers';
import type { Document as DocumentType } from '@langchain/core/documents';
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';

export interface CustomRetrieverInput extends BaseRetrieverInput {}

export class CustomRetriever extends BaseRetriever {
  // @ts-ignore
  lc_namespace = ['langchain', 'retrievers'];
  collectionName: string;

  private embeddingsModel: OpenAIEmbeddings = new OpenAIEmbeddings({
    configuration: {
      defaultHeaders: {
        'api-key': process.env.OPENAI_API_KEY,
      },
      baseURL: process.env.OPENAI_BASE_URL,
    },
  });

  constructor(collectionName?: string, fields?: CustomRetrieverInput) {
    super(fields);
    this.collectionName = collectionName;
  }

  async _getRelevantDocuments(query: string): Promise<DocumentType[]> {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      this.embeddingsModel,
      {
        url: process.env.VECTOR_STORE_URL,
        apiKey: process.env.VECTOR_STORE_API_KEY,
        collectionName: this.collectionName,
      },
    );

    const result = await vectorStore.similaritySearchWithScore(query, 10);

    return result.map(([document, score]) => {
      return {
        ...document,
        metadata: {
          ...document.metadata,
          score,
        },
      };
    });
  }
}
