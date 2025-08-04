# Nuxt Latest 规范手册（Vite） / Nuxt Latest Standard Manual (Vite)

Running requires for dev ops: node@'^20.19.0 || >=22.12.0', npm@>=10.

Developing requires for developers: node@'^20.19.0 || >=22.12.0', npm@>=10, pnpm@>=7, yarn@>=1.

NOTE: This article is based on node@22.17.1, npm@10.9.2, corepack@0.33.0, pnpm@10.14.0.

Dependencies:

- Nuxt
  - nuxt@latest
- Nuxt modules
  - @pinia/nuxt@latest
  - @nuxtjs/i18n@latest
  - @vueuse/nuxt@latest
- Vue
  - vue@latest
- Vue Addons
  - vue-router@latest
  - pinia@latest
  - vue-i18n@latest
  - @vueuse/core@latest
- UI libraries?

Dev dependencies:

- TypeScript
  - typescript@~5.8.3
- ESLint
  - eslint@latest
  - @antfu/eslint-config@latest
  - jiti@latest (If you are using TypeScript config of ESLint)
- Git tools
  - simple-git-hooks@latest
  - lint-staged@latest
- Sass support (If you are using Sass)
  - sass-embedded@latest

Deep dependencies, you don't need to concern about, but must to know the version they are:

Builders:

- JS Like Compiler (Compile JS/TS/JSX/TSX/Vue to JS):
  - vite@latest
    - rollup@latest
    - esbuild@latest
  - @vitejs/plugin-vue@latest
  - @vitejs/plugin-vue-jsx@latest
    - @babel/core@latest
    - @babel/transform-typescript@latest
    - @vue/babel-plugin-jsx@latest
- JS Transpiler (ES downleveling & polyfill the compiled JS):
  - vite@latest # For modern browsers
    - rollup@latest
    - esbuild@latest
  - @vitejs/plugin-legacy@latest # For legacy browsers, lower than ES6
    - @babel/core@latest
    - @babel/preset-env@latest
    - browserslist@latest
    - core-js@latest
    - systemjs@latest
- CSS Like Compiler (Compile Sass/SCSS to CSS):
  - vite@latest
    - sass-embedded@latest
- CSS Transpiler (Autoprefixer & minify the compiled CSS):
  - postcss@latest
    - autoprefixer@latest
    - cssnano@latest
- Bundler:
  - vite@latest
    - rollup@latest
    - esbuild@latest

HTTP Client & Server:

- Client:
  - ofetch@latest
- Server:
  - nitropack@latest
    - h3@latest

## 🔧 更新 VSCode 配置和 Git 配置

### 快速配置

shell（For command `we paste`, please see [README.md#paste-anything](/README.md#paste-anything)）

```shell
# VSCode 配置
# >> 推荐扩展
we paste vue/.vscode/extensions.json .vscode/ -f

# >> 工作区设置
we paste vue/.vscode/settings.json .vscode/ -f
# 或者你喜欢 stylelint
we paste vue-stylelint/.vscode/settings.json .vscode/ -f

# >> TS 编译器设置
# Nuxt Latest is fully typed & has auto-generated `tsconfig.json`
# We don't need to configure the TS compiler ourselves

# >> EditorConfig
we paste .editorconfig -f

# Git 配置
# >> 文件属性
we paste .gitattributes -f

# >> 忽略文件
we paste nodejs.gitignore .gitignore -f
```

### 手动配置

vue/.vscode/extensions.json

See [here](/assets/preferences/setup-project/vue/.vscode/extensions.json).

vue/.vscode/settings.json

See [here](/assets/preferences/setup-project/vue/.vscode/settings.json).

.editorconfig

See [here](/assets/preferences/setup-tools/editor/.editorconfig).

.gitattributes

See [here](/assets/preferences/setup-project/common/.gitattributes).

.gitignore

See [here](/assets/preferences/setup-project/js/nodejs.gitignore).

## 📦 使用 PNPM 并配置

### 前置任务

shell

```shell
npm i corepack@latest -g
npm i @antfu/ni@latest -g
```

### 快速配置

shell（This syntax of command `npm pkg set` requires npm@>=10.9.2）

```shell
# 推荐的新配置方式
we paste pnpm-workspace.yaml -f
# 或者使用兼容的旧配置方式
we paste pnpm.npmrc .npmrc -f

corepack use pnpm@latest-10

# Project running requires
npm pkg set 'engines.node=^20.19.0 || >=22.12.0' 'engines.npm=>=10'
```

### 手动配置

pnpm-workspace.yaml

See [here](/assets/preferences/setup-project/common/pnpm-workspace.yaml).

.npmrc

See [here](/assets/preferences/setup-project/common/pnpm.npmrc).

package.json

```json
{
  // ...

  // Used by corepack
  "packageManager": "pnpm@10.14.0",
  "engines": {
    "node": "^20.19.0 || >=22.12.0",
    "npm": ">=10"
  }

  // ...
}
```

## 🥡 主要依赖版本

Dependencies:

```shell
# Nuxt Latest
ni nuxt@latest

# NOTE: The latest version of Nuxt combines build modules with modules

# Nuxt modules
# >> Pinia support
ni @pinia/nuxt@latest
# >> i18n support
ni @nuxtjs/i18n@latest
# >> VueUse auto importing
ni @vueuse/nuxt@latest

# Vue Latest
ni vue@latest

# Vue Addons
# >> Vue Router
ni vue-router@latest
# >> Pinia
ni pinia@latest
# >> Vue I18n
ni vue-i18n@latest
# >> VueUse
ni @vueuse/core@latest

# TODO: UI libraries
```

Dev dependencies, as-it, for better dev experience:

```shell
# TypeScript
ni typescript@~5.8.3 -D

# ESLint
ni eslint@latest -D
# >> ESLint config & related plugins
ni @antfu/eslint-config@latest eslint-plugin-format@latest @prettier/plugin-xml@latest -D
# >> Jiti
# >> OPTIONAL: If you are using TypeScript config of ESLint
ni jiti@latest -D

# Git tools
# >> Simple Git Hooks
# >> The performance of `simple-git-hooks` is much better than `husky`
ni simple-git-hooks@latest -D
# >> Lint Staged
ni lint-staged@latest -D

# Sass support
# OPTIONAL: If you are using Sass
# `sass-embedded` has much better performance than `sass`
# They are made by the same team and provide the same features
# NOTE: Vite has built-in support for sass, so there isn't an plugin for Vite, like `sass-loader` for Webpack
ni sass-embedded@latest -D
```

## 🧾 配置 Nuxt

TODO: WIP...

## 🌟 设置代码检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 快速配置

shell

```shell
we paste vue3/eslint.config.js -f

npm pkg set 'scripts.lint=eslint .'
```

### 手动配置

eslint.config.js

See [here](/assets/preferences/setup-project/vue3/eslint.config.js).

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

### StyleLint

如果你需要 StyleLint，请参考此流程，安装 StyleLint 本体和配置文件中列出的插件。

See [here](/assets/preferences/setup-project/vue-stylelint/stylelint.config.js).

## 🤖 配置提交检查与格式化

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

### 捂嘴

如果你想捂嘴，不让它天天喊我弃用了 XXX API，请参考如下配置：

nuxt.config.js / nuxt.config.ts

```ts
export default defineNuxtConfig({
  // ...

  vite: {
    // ...

    preprocessorOptions: {
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
})
```

## 🧹 项目兼容性 & 可维护性

### [taze](https://www.npmjs.com/package/taze)

```shell
# minor: 升级 minor 版本
# -r: 递归升级依赖，提供对 Monorepo 项目的支持
# -I: 交互模式
# -w: 直接将结果写入 package.json 或 pnpm-workspace.yaml
nlx taze minor -rIw
```
