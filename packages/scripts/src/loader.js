import { TextLoader } from 'langchain/document_loaders/fs/text';

export class MarkdownLoader extends TextLoader {
  constructor(filePathOrBlob) {
    super(filePathOrBlob);
  }

  async parse(raw) {
    return [raw];
  }
}
