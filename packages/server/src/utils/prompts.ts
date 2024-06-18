import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MessagesPlaceholder } from '@langchain/core/prompts';

// Variation of 'rlm/rag-prompt'
const promptRagRaw = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. When responding, keep the original formatting, including markdown and HTML tags.

{context}`;

const promptContextualizeRaw = `Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.

{chat_history}`;

const promptIsAnsweredRaw = `You are a helpful assistant. Use the tools provided to best assist the user.`;

const promptRag = ChatPromptTemplate.fromMessages([
  ['system', promptRagRaw],
  ['human', '{question}'],
]);

const promptContextualize = ChatPromptTemplate.fromMessages([
  ['system', promptContextualizeRaw],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
]);

const promptIsAnswered = ChatPromptTemplate.fromMessages([
  ['system', promptIsAnsweredRaw],
  ['human', '{input}'],
]);

export { promptRag, promptContextualize, promptIsAnswered };
