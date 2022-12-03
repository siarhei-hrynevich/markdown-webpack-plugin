import webpack from 'webpack'
import { promises as fs } from 'fs';
import path from 'path';

import { compileMarkdown } from './markdown-compilation';

const mdReg = /\.md$/;

const getFilesToCompile = async (sourceDir: string): Promise<string[]> => {
  const readDirContent = async (dir: string): Promise<string[]> => {
    const files = await fs.readdir(dir)
    return (await Promise.all(
      files
        .map(file => path.join(dir, file))
        .map(async file => 
          (await fs.stat(file)).isDirectory() ? await readDirContent(file) : file
        )))
      .flat();
  };

  return Promise.all(
    (await readDirContent(sourceDir))
      .map(async file => path.relative(sourceDir, file))
  );
};

const writeFile = async (file: string, content: string): Promise<void> => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, { encoding: "utf8", });  
};

const readFileContent = async (file: string): Promise<string> =>
  (await fs.readFile(file)).toString();

const processMarkdownFile = async (
  file: string,
  template: string,
  source: string,
  destination: string,
): Promise<void> => {
  const markdown = await readFileContent(path.join(source, file));
  const html = template.replace('{{markdownContent}}', compileMarkdown(markdown));
  const fileInfo = path.parse(file);
  const fileName = `${fileInfo.dir}/${fileInfo.name}.html`
  await writeFile(path.join(destination, fileName), html);
};

const copyFile = async (source: string, destination: string) => {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}

const generate = async (source: string, destination: string, template: string) => {
  const files = await getFilesToCompile(source); 
  await Promise.all(files.map((file) =>
    mdReg.test(file) ?
      processMarkdownFile(file, template, source, destination)
      : copyFile(path.join(source, file), path.join(destination, file))
  ));
};

type MarkdownPluginOptions = {
  sourcePath: string,
  exportPath: string,
  template: string,
};

export class MarkdownPlugin implements webpack.WebpackPluginInstance {
  private sourcePath: string;
  private exportPath: string;
  private template: string;

  constructor(options: MarkdownPluginOptions) {
    this.sourcePath = options.sourcePath;
    this.exportPath = options.exportPath;
    this.template = options.template;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync('MarkdownWebpackPlugin', async (compilation: webpack.Compilation, callback) => {
      const templateContent = await fs.readFile(this.template, { encoding: "utf8" })
        compilation.contextDependencies.add(this.sourcePath)
        await generate(
          this.sourcePath,
          this.exportPath,
          templateContent,
        );
        callback();
    });
  };
}
