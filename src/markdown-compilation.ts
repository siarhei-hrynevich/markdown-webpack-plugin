import { marked } from 'marked';
import path from 'path'
import fs from 'fs';

type IterationCallback = (token: marked.Token) => void;

const resolveLink = (link: string, source: string) => {
  const filePath = path.join(source, link)
  if (!fs.existsSync(filePath)) return link;

  const file = path.parse(filePath);

  // return link not to .md file without changes
  if (file.ext !== '.md') return link;
  
  // return link to generated HTML file
  return link.replace(/.md$/, '.html');
}

const iterateByTokens = (tokens: marked.TokensList | marked.Token[], callback: IterationCallback) => 
  tokens.forEach(token => {
    callback(token);
    switch (token.type) {
      case 'paragraph':
        const paragraph = token as marked.Tokens.Paragraph;
        iterateByTokens(paragraph.tokens, callback);
        break;
      case 'table':
        const table = token as marked.Tokens.Table;
        table.header.forEach(headerItem => iterateByTokens(headerItem.tokens, callback));
        table.rows.forEach(row => row.forEach(rowItem => iterateByTokens(rowItem.tokens, callback)));
    }
});

const resolveLinks = (tokens: marked.TokensList, source: string) => iterateByTokens(tokens, token => {
  if (token.type !== 'link') return;
  const link = token as marked.Tokens.Link;
  link.href = resolveLink(link.href, source);
})

export const compileMarkdown = (markdown: string, source: string) => {
  const lexer = new marked.Lexer();
  const parser = new marked.Parser();

  const tokens = lexer.lex(markdown);

  resolveLinks(tokens, source);

  return parser.parse(tokens);
};