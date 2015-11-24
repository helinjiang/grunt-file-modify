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
> 同时支持 `options.reg`、 `options.template` 和 `options.process`，对文件内容的处理顺序依次为 `options.template`、 `options.reg` 和 `options.process`。但必须要有其中一种，否则将对文件不做任何处理。

#### options.reg
Type: `Object`
Default value: `null`
支持使用正则表达式快速替换，这样就可以避免在 `options.process` 这个方法里面定义了，更简单。`options.reg` 有三个参数：

- `pattern` ：用于生成正则表达式的字符串，详见 [RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `flags` ：正则表达式的参数，必须是 `g` 、 `i` 、 `m` 其中之一或任意组合，详见 [RegExp](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)，不过此参数可以不写，默认为 `gi`
- `replaceStr` ：要替换的字符串，此参数如果不写，则默认为空字符串

其用法：
```js
options: {
    reg: {
        pattern: 'world',
        flags: 'gi', //可以省略，默认值为'gi'
        replaceStr: 'grunt-file-modify'
    },
}
```
其等效于定义：
```js
options: {
    process: function(content, srcpath) {
        //return content.replace(new RegExp(pattern, flags), replaceStr);
        return content.replace(new RegExp('world', 'gi'), 'grunt-file-modify');
    }
}
```

#### options.template
Type: `Object`
Default value: `null`
支持模版替换，核心算法是采用 [underscore](http://underscorejs.org/)的 `_.template` 方法，其中 `src` 文件为模版，而数据则由 `options.template.data` 传入。`options.template` 有一个参数：

- `data` ：模版的数据，`Object` 或 `String` 类型。如果是 `String`，则会认为其是文件路径，会请求这个文件，将其转换为JSON，因此该文件务必符合JSON格式的文件。

其用法：
```js
options: {
    template: {
        data: {
            listName: 'student',
            detail: [{
                name: 'LiLei',
                sex: 'male',
                age: 15
            }, {
                name: 'HanMeimei',
                sex: 'female',
                age: 15
            }, {
                name: 'Jim',
                sex: 'male',
                age: 16
            }]
        }
    }
}
```
或者：
```js
options: {
    template: {
        data: 'tmp/data.json'
    }
},
```

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
2015.11.24 v0.2.1 Modify readme.md

2015.11.24 v0.2.0 Support `options.reg`([#1](https://github.com/helinjiang/grunt-file-modify/issues/1)) and `options.template`([#2](https://github.com/helinjiang/grunt-file-modify/issues/2)) .

2015.11.23 v0.1.0 Support `options.process` to modify file content.

2015.11.23 v0.0.1 Init.
