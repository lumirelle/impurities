# Vue 2 规范手册（Vite） / Vue 2 Standard Manual (Vite)

Running requires for dev ops: node@'^14.18.0 || >=16.0.0', npm@>=6.

Developing requires for developers: node@'^18.20.0 || ^20.10.0 || >=22.0.0', npm@>=9, pnpm@>=7, yarn@>=1.

NOTE: This article is based on node@22.17.1, npm@10.9.2, corepack@0.33.0, pnpm@10.14.0.

Main dependencies:

- vite@^4 (@vitejs/plugin-legacy@^4, @vitejs/plugin-vue2@latest)
- vue@^2.7.16 (vue-router@legacy, vuex@^3.6.2, @vueuse/core@^11.3.0)
- eslint@latest
- simple-git-hooks@latest, lint-staged@latest

## 🔧 更新 VSCode 配置和 Git 配置

### 快速配置

shell（For command `we paste`, please see [README.md#paste-anything](/README.md#paste-anything)）

```shell
# vscode 配置
# -- 推荐扩展
we paste vue/.vscode/extensions.json .vscode/ -f
# -- 工作区设置
we paste vue/.vscode/settings.json .vscode/ -f
# -- js 编译器设置
we paste vue2/jsconfig.json -f
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

See [here](/assets/preferences/setup-project/vue2/jsconfig.json).

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
# Vite & It's plugins
# vite, @vitejs/plugin-legacy, @vitejs/plugin-vue2
ni vite@^4 @vitejs/plugin-legacy@^4 @vitejs/plugin-vue2@latest

# Vue 2
# vue, vue-router, vuex, vueuse
ni vue@^2.7.16 vue-router@legacy vuex@^3.6.2 @vueuse/core@^11.3.0
# `@vitejs/plugin-vue2` provide the ability to compiler vue template, we don't need vue-template-compiler anymore

# Others
# terser
ni terser@latest -D
```

## 🌟 设置代码检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 前置任务

shell

```shell
# eslint
ni eslint@latest -D

# eslint config
# Since the version of 4.15.0, `@antfu/eslint-config` requires node@>=20
ni @antfu/eslint-config@~4.14.1 -D

# eslint & prettier plugin
ni eslint-plugin-format@latest @prettier/plugin-xml@latest -D
```

### 快速配置

shell

```shell
we paste vue2/eslint.config.js -f
```

### 手动配置

eslint.config.js

See [here](/assets/preferences/setup-project/vue2/eslint.config.js).

## 📜 配置 npm 快速检查与格式化脚本

### 前置任务

shell

```shell
# Since the version of 8.0.0, `npm-run-all2` requires node@>=20
ni npm-run-all2@^7.0.2 -D
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
```

### 快速配置

shell

```shell
npm pkg set 'scripts.prepare=simple-git-hooks'
npm pkg set 'simple-git-hooks.pre-commit=npx lint-staged'
npm pkg set 'lint-staged.*=eslint --fix'
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
    "pre-commit": "npx lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }

  // ...
}
```

## 💪🏼 Sass 支持

### 前置任务

shell

```shell
# 强耦合 node 版本，万恶之源，请勿使用！
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
