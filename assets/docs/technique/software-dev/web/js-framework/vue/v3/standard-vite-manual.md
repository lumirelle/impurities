# Vue 3 规范手册（Vite） / Vue 3 Standard Manual (Vite)

Project Running requires (for docker image): node@'^20.19.0 || >=22.12.0', npm@>=10.

Project Developing requires (for us): node@'^20.19.0 || >=22.12.0', npm@>=10, pnpm@>=7, yarn@>=1.

This article is based on node@20.19.0, npm@10.9.2, corepack@0.33.0, pnpm@10.13.1.

Main dependencies:

- vite@latest (@vitejs/plugin-legacy@latest, @vitejs/plugin-vue2@latest)
- vue@latest (vue-router@latest, vuex@latest, @vueuse/core@latest)
- eslint@latest, stylelint@latest
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
we paste vue3/tsconfig.json -f
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
npm pkg set 'engines.node=^20.19.0 || >=22.12.0' 'engines.npm=>=10'
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
    "node": "^20.19.0 || >=22.12.0",
    "npm": ">=10"
  }

  // ...
}
```

## 🥡 基础依赖

shell

```shell
# Vite & It's plugins
# vite, @vitejs/plugin-vue
ni vite@latest @vitejs/plugin-vue@latest -D

# Vue 3
# vue, vue-router, pinia, vueuse
ni vue@latest vue-router@latest pinia@latest @vueuse/core@latest
# `@vitejs/plugin-vue` provide the ability to compiler vue template, we don't need vue-template-compiler anymore

# Others
# vite-plugin-vue-devtools
ni vite-plugin-vue-devtools@latest -D
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

## ✨ 设置样式检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 前置任务

shell

```shell
# stylelint
ni stylelint@latest -D

# stylelint config for html
ni stylelint-config-html@latest -D
# stylelint config for scss
ni stylelint-config-standard-scss@latest -D
# stylelint config for vue
ni stylelint-config-standard-vue@latest -D
# stylelint config for stylistic
ni @stylistic/stylelint-config@latest stylelint-config-recess-order@latest -D
```

### 快速配置

shell

```shell
we paste vue/stylelint.config.js -f
```

### 手动配置

stylelint.config.js

See [here](/assets/preferences/setup-project/vue/stylelint.config.js).

## 📜 配置 npm 快速检查与格式化脚本

### 前置任务

shell

```shell
ni npm-run-all2@latest -D
```

### 快速配置

shell

```shell
npm pkg set 'scripts.lint=run-s lint:*'
npm pkg set 'scripts.lint:js=eslint --cache --quiet .'
npm pkg set 'scripts.lint:style=stylelint --cache --quiet **/*.{css,postcss,scss,html,vue}'
npm pkg set 'scripts.fix=run-s fix:*'
npm pkg set 'scripts.fix:js=eslint --cache --fix --quiet .'
npm pkg set 'scripts.fix:style=stylelint --cache --fix --quiet **/*.{css,postcss,scss,html,vue}'
```

### 手动配置

package.json

```json
{
  // ...
  "scripts": {
    // ...

    "lint": "run-s lint:*",
    "lint:js": "eslint --cache --quiet .",
    "lint:style": "stylelint --cache --quiet **/*.{css,postcss,scss,html,vue}",
    "fix": "run-s fix:*",
    "fix:js": "eslint --cache --fix --quiet .",
    "fix:style": "stylelint --cache --fix --quiet **/*.{css,postcss,scss,html,vue}"

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

# lint-staged & commitlint
ni lint-staged@latest @commitlint/cli@latest @commitlint/config-conventional@latest -D
```

### 快速配置

shell

```shell
npm pkg set 'scripts.prepare=simple-git-hooks'
npm pkg set 'simple-git-hooks.pre-commit=npx lint-staged'
npm pkg set 'simple-git-hooks.commit-msg=npx commitlint --edit $1'
npm pkg set 'lint-staged.*=eslint --cache --fix'
npm pkg set 'lint-staged[*.{css,postcss,scss,html,vue}]=stylelint --cache --fix'

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
    "*": "eslint --cache --fix",
    "*.{css,postcss,scss,html,vue}": "stylelint --cache --fix"
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
