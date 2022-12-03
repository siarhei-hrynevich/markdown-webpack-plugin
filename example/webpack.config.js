const { MarkdownPlugin } = require('../dist');

module.exports = {
  entry: ['webpack/hot/dev-server'],
  plugins: [
    new MarkdownPlugin({
      sourcePath: './src/content',
      exportPath: './dist/',
      template: './src/template.html'
    })
  ],
  devServer: {
    static: './dist/',
    watchFiles: ['src/**/*.md'],
    port: 9000,
  },
}