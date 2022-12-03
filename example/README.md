# Plugin usage

Including markdown plugin:

```js
module.exports = {
  plugins: [
    new MarkdownPlugin({
      sourcePath: './src/content',
      exportPath: './dist/',
      template: './src/template.html'
    })
  ],
}
```

Configuring dev server:

```js
module.exports = {
  devServer: {
    static: './dist/',
    watchFiles: ['src/**/*.md'],
    port: 9000,
  },
}
```

