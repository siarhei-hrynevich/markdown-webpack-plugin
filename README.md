# Markdown HTML plugin

Webpack plugin for building markdown in HTML static site

Plugin options

| Option      | Type        | Description                |
| ----------- | ----------- | -------------------------- |
| sourcePath  | string      | Path to markdown content   |
| exportPath  | string      | Path to output directory   |
| template    | string      | Path to html template      |

## Template

Example of HTML template. `{{markdownContent}}` will be replaced to generated HTML


```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <div id="app">{{markdownContent}}</div>
</body>
</html>
```
## Example

[Plugin usage](https://github.com/siarhei-hrynevich/markdown-webpack-plugin/tree/master/example)

## Link resolver:

Plugin can recognize links on another markdown files:

```md
[Linked page](./linked-page.md)
```

Will be compiled to:

```html
<a href="./linked-page.html">Linked page</a>
```
