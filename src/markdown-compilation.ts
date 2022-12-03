import { marked } from 'marked';

export const compileMarkdown = (markdown: string) => {
  const lexer = new marked.Lexer();
  const parser = new marked.Parser();

  const tokens = lexer.lex(markdown);
  return parser.parse(tokens);
};