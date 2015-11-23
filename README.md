# grunt-file-modify

> modify file content.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-file-modify --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-modify');
```

## The "file_modify" task

### Overview
In your project's Gruntfile, add a section named `file_modify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  file_modify: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.process
Type: `Function(content, srcpath)`

`options.process` 将被传递给 `grunt.file.copy` ，用于控制哪些内容可以被拷贝（保存）。**该函数需要返回一个新的文件的内容**。

- `content` ： 该文件的原始内容，可以通过修改 `content` 从而获得新的文件内容
- `srcpath` ： 该文件先对与Gruntfile.js的路径


### Usage Examples

#### 自定义方法修改文件内容
在下面的例子中，我们将去掉包含了 “//@debug” 的行的内容。为什么需要这么做？因为很多时候我们在调试时需要打印各种内容，但构建发布版本时，我们就需要移除这些代码。使用单行注释中增加“//@debug”的标志，就能够使得我们能够更灵活控制哪些代码是需要在发布版本中删除的。

```js
grunt.initConfig({
  file_modify: {
    options: {
        process: function (content, srcpath) {
            /**
             * 去掉包含了 “//@debug” 的行的内容，例如下面这一行因为包含了@debug，则该行内容将被替换为空白
             * console.log(s1); // @debug remove this line, too!
             */
            return content.replace(/[^\n]+\/\/\s*@\s*debug.*/g, '');
        }
    },
    src: ['tmp/options_process.js']
  },
});
```


## Release History
2015.11.23 v0.1.0 Support `options.process` to modify file content.
2015.11.23 v0.0.1 Init.
