# Vue 3 规范手册（Webpack） / Vue 3 Standard Manual (Webpack)

Project Running requires (for docker image): node@'^12.22.0 || ^14.17.0 || ^16.10.0 || >=18.0.0', npm@>=6.

Project Developing requires (for us): node@'^20.19.0 || >=22.12.0', npm@>=10, pnpm@>=7, yarn@>=1.

This article is based on node@20.19.0, npm@10.9.2, corepack@0.33.0, pnpm@10.13.1.

Main dependencies:

- babel@^7, core-js@^3
- @vue/cli-service@latest (@vue/cli-plugin-babel@latest)
- vue@latest (vue-router@latest, vuex@latest, @vueuse/core@latest)
- eslint@latest
- simple-git-hooks@latest, lint-staged@latest, commitlint@latest

## 🔧 更新 vscode 配置和 git 配置

### 快速配置

shell（For command `we paste`, please see [README.md#paste-anything](/README.md#paste-anything)）

```shell
# vscode 配置
# -- 推荐扩展
we paste vue/.vscode/extensions.json .vscode/ -f
# -- 工作区设置
we paste vue/.vscode/settings.json .vscode/ -f
# -- js 编译器设置
we paste vue3/jsconfig.json -f
# -- ts 编译器设置
we paste vue3/jsconfig.json -f
# -- editor config
we paste .editorconfig -f

# git 配置
# -- 文件属性
we paste .gitattributes -f
# -- 忽略文件
we paste nodejs.gitignore .gitignore -f
```

### 手动配置

.vscode/extensions.json

See [here](/assets/preferences/setup-project/vue/.vscode/extensions.json).

.vscode/settings.json

See [here](/assets/preferences/setup-project/vue/.vscode/settings.json).

jsconfig.json

See [here](/assets/preferences/setup-project/vue3/jsconfig.json).

tsconfig.json

See [here](/assets/preferences/setup-project/vue3/tsconfig.json).

.editorconfig

See [here](/assets/preferences/setup-tools/editor/.editorconfig).

.gitattributes

See [here](/assets/preferences/setup-project/common/.gitattributes).

.gitignore

See [here](/assets/preferences/setup-project/js/nodejs.gitignore).

## 📦 配置包管理器和 .npmrc

### 前置任务

shell

```shell
npm i corepack@latest -g
npm i @antfu/ni@latest -g
```

### 快速配置

shell（This syntax of command `npm pkg set` requires npm@>=10.9.2）

```shell
we paste pnpm.npmrc -f

corepack use pnpm@latest-10

# Project running requires
npm pkg set 'engines.node=^12.22.0 || ^14.17.0 || ^16.10.0 || >=18.0.0' 'engines.npm=>=6'
```

### 手动配置

.npmrc

See [here](/assets/preferences/setup-project/common/pnpm.npmrc).

package.json

```json
{
  // ...

  // Used by corepack
  "packageManager": "pnpm@10.13.1",
  "engines": {
    "node": "^12.22.0 || ^14.17.0 || ^16.10.0 || >=18.0.0",
    "npm": ">=6"
  }

  // ...
}
```

## 🥡 基础依赖

shell

```shell
# Vue-Cli & It's plugins
# vue-cli, vue-cli-plugin
ni @vue/cli-service@latest @vue/cli-plugin-babel@latest -D
# @vue/cli-plugin-eslint does not support eslint@^9, please remove it
nun @vue/cli-plugin-eslint

# Vue 3
# vue, vue-router, pinia, vueuse
ni vue@latest vue-router@latest pinia@latest @vueuse/core@latest
# vue-template-compiler
ni vue-template-compiler@latest -D

# Others
# core-js
ni core-js@latest
```

## 🌟 设置代码检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 前置任务

shell

```shell
# eslint
ni eslint@latest -D

# eslint config
ni @antfu/eslint-config@latest -D

# eslint & prettier plugin
ni eslint-plugin-format@latest @prettier/plugin-xml@latest -D
```

### 快速配置

shell

```shell
we paste vue3/eslint.config.js -f
```

### 手动配置

eslint.config.js

See [here](/assets/preferences/setup-project/vue3/eslint.config.js).

## 📜 配置 npm 快速检查与格式化脚本

### 前置任务

shell

```shell
ni npm-run-all2@latest -D
```

### 快速配置

shell

```shell
npm pkg set 'scripts.lint=eslint .'
```

### 手动配置

package.json

```json
{
  // ...
  "scripts": {
    // ...

    "lint": "eslint ."

    // ...
  }
}
```

## 🤖 配置提交检查与格式化

### 前置任务

shell

```shell
# The performance of `simple-git-hooks` is much better than `husky`
ni simple-git-hooks@latest -D

# lint-staged
ni lint-staged@latest -D

# commitlint
ni @commitlint/cli@latest @commitlint/config-conventional@latest @commitlint/cz-commitlint@latest commitizen@latest inquirer@^9.3.7 -D
```

### 快速配置

shell

```shell
npm pkg set 'scripts.prepare=simple-git-hooks'
npm pkg set 'simple-git-hooks.pre-commit=npx lint-staged'
npm pkg set 'simple-git-hooks.commit-msg=npx commitlint --edit $1'
npm pkg set 'lint-staged.*=eslint --fix'

we paste commitlint/commitlint.config.js -f
```

### 手动配置

package.json（配置 simple-git-hooks）

```json
{
  // ...

  "scripts": {
    // ...
    "prepare": "simple-git-hooks"
  },

  // ...

  "simple-git-hooks": {
    "pre-commit": "npx lint-staged",
    "commit-msg": "npx commitlint --edit $1"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }

  // ...
}
```

commitlint.config.js

See [here](/assets/preferences/setup-project/common/commitlint.config.js).

## 💪🏼 使用 Dart Sass 提供 Sass 支持，移除 Node Sass

### 前置任务

shell

```shell
# 限制 node 版本的罪魁祸首！
nun node-sass

# sass 和 sass-loader
ni sass@latest sass-loader@version-10 -D
```

### 手动配置

vue.config.js

```js
module.exports = {
  // ...

  css: {
    loaderOptions: {
      scss: {
        sassOptions: {
          // scss 支持本身不需要任何配置
          // 只有代码中使用到大量的弃用 API 时，才需要禁用警告（因为警告输出实在是太多咧）
          silenceDeprecations: [
            'legacy-js-api',
            'mixed-decls',
            'import',
            'slash-div',
            'global-builtin',
            'function-units',
          ],
        },
      },
    },

    // ...
  },

  // ...
}
```

## 🧹 项目兼容性 & 可维护性

### [taze](https://www.npmjs.com/package/taze)

#### 使用

```shell
# taze：帮你轻松完成依赖升级
nlx taze minor -rIw
```
