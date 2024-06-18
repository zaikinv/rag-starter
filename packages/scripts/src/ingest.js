import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { QdrantVectorStore } from '@langchain/qdrant';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownSplitter } from './splitter.js';
import { MarkdownLoader } from './loader.js';
import { OpenAIEmbeddings } from '@langchain/openai';

const docsPath = path.join('../../', process.env.DOCS_FOLDER_NAME);

const ingest = async () => {
  try {
    const subFolders = ['.'].concat(listSubFoldersSync(docsPath));

    for (const subFolder of subFolders) {
      try {
        await processSubFolder(subFolder);
        console.info(`Processed ${subFolder}`);
      } catch (error) {
        console.error(`Error processing folder ${subFolder}:`, error);
      }
    }

    console.info('Stored documents');
  } catch (error) {
    console.error('Error in ingest process:', error);
  }
};

const processSubFolder = async (subFolder) => {
  const loader = new DirectoryLoader(
    path.join(docsPath, subFolder),
    {
      '.md': (filePath) => new MarkdownLoader(filePath),
    },
  );
  const splitter = new MarkdownSplitter();

  const docs = await loader.load();
  const splitDocs = await splitter.splitDocuments(docs);

  await storeDocuments(splitDocs);
};

const storeDocuments = async (docs) => {
  try {
    const embeddings = new OpenAIEmbeddings({
      configuration: {
        defaultHeaders: {
          'api-key': process.env.OPENAI_API_KEY,
        },
        baseURL: process.env.OPENAI_EMBEDDINGS_BASE_URL,
      },
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.VECTOR_STORE_URL,
      apiKey: process.env.VECTOR_STORE_API_KEY,
      collectionName: process.env.VECTOR_STORE_COLLECTION_NAME,
    });
  } catch (error) {
    console.error('Error storing the documents:', error);
  }
};

const listSubFoldersSync = (directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.filter((file) => {
      const filePath = path.join(directoryPath, file);
      return fs.statSync(filePath).isDirectory();
    });
  } catch (err) {
    console.error('Unable to scan directory:', err);
    return [];
  }
};

ingest();
