import { CliPrettify } from 'markdown-table-prettify';
import { marked } from 'marked';
import { createMarkdownObjectTable } from 'parse-markdown-table';
import { TextSplitter } from '@langchain/textsplitters';

export class MarkdownSplitter extends TextSplitter {
  constructor() {
    super();
  }

  async splitText(text) {
    const splitText = parseMarkdown(text);
    return Promise.resolve(splitText);
  }
}

const parseMarkdown = async (content) => {
  const sections = [];
  const tokens = marked.lexer(content);

  let currentHeadingHierarchy = [];

  const getCurrentHeading = (depth) => {
    // Ensure the hierarchy is correctly filled with empty levels if skipped
    while (currentHeadingHierarchy.length < depth) {
      currentHeadingHierarchy.push('');
    }
    currentHeadingHierarchy = currentHeadingHierarchy.slice(0, depth - 1);
  };

  for (const token of tokens) {
    if (token.type === 'heading' && token.raw.startsWith('#')) {
      getCurrentHeading(token.depth);
      currentHeadingHierarchy[token.depth - 1] = token.raw;
      sections.push({ heading: currentHeadingHierarchy.join(''), content: '' });
      continue;
    }

    if (token.type === 'table') {
      const tableContent = await convertTableToText(token.raw);
      sections[sections.length - 1].content += tableContent;
      continue;
    }

    if (/!\[.*?\]\(.*?\)/g.test(token.raw)) {
      continue;
    }

    if (sections.length > 0) {
      sections[sections.length - 1].content += token.raw;
    }
  }

  return sections
    .filter((section) => section.content.trim().length > 50)
    .map((section) =>
      `${section.heading}${section.content}`
        .trim()
        .replace(/(\n\s*\n)+/g, '\n\n'),
    );
};

const convertTableToText = async (tableRaw) => {
  try {
    const tableFormatted = CliPrettify.prettify(tableRaw);
    const table = await createMarkdownObjectTable(tableFormatted);
    const result = [];

    for await (const row of table) {
      result.push(row);
    }

    const formattedRows = result.map((row) => {
      return Object.entries(row)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n');
    });

    return formattedRows.join('\n\n');
  } catch (e) {
    console.error('Error converting table to text', e);
    console.error(tableRaw);
  }
};
