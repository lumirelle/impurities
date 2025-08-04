# Nuxt 2 规范手册 / Nuxt 2 Standard Manual

Running requires for dev ops: node@'^14.21.3 || ^16.10.0 || >=18.0.0', npm@>=6.

Developing requires for developers: node@'^18.20.0 || ^20.10.0 || >=22.0.0', npm@>=9, pnpm@>=7, yarn@>=1.

NOTE: This article is based on node@22.17.1, npm@10.9.2, corepack@0.33.0, pnpm@10.14.0.

Dependencies:

- Nuxt
  - nuxt@2.17.3
- Nuxt modules
  - @nuxtjs/axios@latest
  - @nuxtjs/i18n@^7
- Vue
  - vue@^2
- Vue Addons
  - vue-router@legacy
  - vuex@^3
  - vue-i18n@^8
  - @vueuse/core@^11
- UI libraries
  - element-ui@^2

Dev dependencies:

- Nuxt build modules
  - @nuxt/typescript-build@^2 (If you are writing TS)
- TypeScript & Types
  - typescript@~5.8.3
  - @nuxt/types@2.17.3
- ESLint
  - eslint@latest
  - @antfu/eslint-config@~4.14.1
  - jiti@latest (If you are using TypeScript config of ESLint)
- Git tools
  - simple-git-hooks@latest
  - lint-staged@latest
- Sass support (If you are using Sass)
  - sass@latest
  - sass-loader@version-10
- CrossEnv
  - cross-env@^7 (If you are using NPM scripts with environment variables without PNPM)

Deep dependencies, you don't need to concern about, but must to know the version they are:

Builders:

- JS Like Compiler (Compile JS/TS/JSX/TSX/Vue to JS):
  - webpack@^4
  - babel-loader@^8
    - @babel/core@latest
  - vue-loader@latest
    - vue-template-compiler@latest
- JS Transpiler (ES Downleveling & Polyfill & Other transpile):
  - @babel/core@latest
  - @nuxt/babel-preset-app@latest
  - caniuse-lite@latest
  - core-js@latest
- CSS Like Compiler (Compile Sass/SCSS to CSS):
  - webpack@^4
  - sass-loader@^10
    - sass@latest
- CSS Transpiler (Autoprefixer & minify the compiled CSS):
  - postcss@latest
    - autoprefixer@latest
    - cssnano@^6
- Bundler:
  - webpack@^4

HTTP Client & Server:

- Client:
  - axios@^0.21
- Server:
  - @nuxt/server@latest
    - connect@^3.7.0

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
we paste nuxt2/jsconfig.json -f
# 或者你使用 TypeScript
we paste nuxt2/tsconfig.json -f

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

nuxt2/jsconfig.json

See [here](/assets/preferences/setup-project/nuxt2/jsconfig.json).

nuxt2/tsconfig.json

See [here](/assets/preferences/setup-project/nuxt2/tsconfig.json).

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

# Running requires for dev ops
npm pkg set 'engines.node=^14.21.3 || ^16.10.0 || >=18.0.0' 'engines.npm=>=6'
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
    "node": "^14.21.3 || ^16.10.0 || >=18.0.0",
    "npm": ">=6"
  }

  // ...
}
```

## 🥡 主要依赖版本

Dependencies:

```shell
# Nuxt 2
# `nuxt@>2.17.3` is not compatible with `node@^14.21.3`, so we should specify the exact version 2.17.3
ni nuxt@2.17.3 -E

# Nuxt modules
# >> Axios support
ni @nuxtjs/axios@latest
# >> i18n support
ni @nuxtjs/i18n@^7.3.1

# Vue 2
ni vue@^2.7.16

# Vue Addons
# >> Vue Router
ni vue-router@legacy
# >> Vuex
ni vuex@^3.6.2
# >> Vue I18n
ni vue-i18n@^8.28.2
# >> VueUse
ni @vueuse/core@^11.3.0

# UI libraries
ni element-ui@^2.15.14
```

Dev dependencies, as-it, for better dev experience:

```shell
# Nuxt build modules
# >> TypeScript builder
# >> OPTIONAL: If you are writing TypeScript
ni @nuxt/typescript-build@^2 -D

# TypeScript & Types
ni typescript@~5.8.3 -D
ni @nuxt/types@2.17.3

# ESLint
ni eslint@latest -D
# >> ESLint config & related plugins
# >> `@antfu/eslint-config@^4.15.0` requires `node@>=20` caused by `eslint-plugin-jsdoc`
# >> So we should use the version 4.14.x
ni @antfu/eslint-config@~4.14.1 eslint-plugin-format@latest @prettier/plugin-xml@latest -D
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
# >> Strongly coupled with node version, the root of all evil, please do not use!
nun node-sass
# >> Sass and loader for Webpack 4
# >> `sass-loader@^10` is not compatible with `sass-embedded`
ni sass@latest sass-loader@^10 -D

# Cross Env
# OPTIONAL: Only non-PNPM projects need to use. PNPM natively supports the shellEmulator option, which supports cross-platform setting of environment variables.
# Provide cross-platform compatibility for setting environment variables when running NPM scripts, currently only seen in projects based on webpack 4 (not including vue-cli that wraps webpack 4)
# `cross-env@^10` requires `node@>=20`, the previous major version is `cross-env@^7`
ni cross-env@^7 -D
```

## 🧾 配置 Nuxt

### 启用 modern 模式

启用 modern 模式，可以使现代浏览器访问项目时，得到的是没有额外 Polyfill 的代码，从而获得更好的性能。

nuxt.config.js / nuxt.config.ts

```ts
export default {
  // ...

  modern: 'server',

  // ...
}
```

### 开发环境启用 Webpack Devtool

启用 Devtool，可以获得更好的开发 & Debug 体验。

`cheap-module-eval-source-map` 适用于开发环境，有更快的打包速度。

nuxt.config.js / nuxt.config.ts

```ts
export default {
  // ...

  build: {
    // ...

    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.devtool = 'cheap-module-eval-source-map'
      }
    },

    // ...
  },

  // ...
}
```

### 处理 mjs 文件

如果你遇到错误 `Can't import the named export 'xxx' from non EcmaScript module (only default export is available)`，表明 Webpack 无法识别 mjs 文件，需要手动配置：

nuxt.config.js / nuxt.config.ts

```ts
export default {
  // ...

  build: {
    // ...

    extend(config, { isDev, isClient }) {
      if (config.module) {
        config.module.rules.push({
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        })
      }
    },

    // ...
  },
}
```

## 🌟 设置代码检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 快速配置

shell

```shell
we paste vue2/eslint.config.js -f

npm pkg set 'scripts.lint=eslint .'
```

### 手动配置

eslint.config.js

See [here](/assets/preferences/setup-project/vue2/eslint.config.js).

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

### 手动配置

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
export default {
  // ...

  build: {
    // ...

    loaders: {
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

```shell
# minor: 升级 minor 版本
# -r: 递归升级依赖，提供对 Monorepo 项目的支持
# -I: 交互模式
# -w: 直接将结果写入 package.json 或 pnpm-workspace.yaml
nlx taze minor -rIw
```

### [cross-env](https://www.npmjs.com/package/cross-env)

Cross Env 用来在 Windows 上支持 Bash 环境变量的设置语法，即 `ENV=value command`。

需要使用 cross-env 代理的 npm 脚本应手动配置。设置了环境变量，才需要改为通过 cross-env 来执行。

package.json

```json
{
  // ...

  "scripts": {
    // ...

    // 设置了环境变量，改为通过 cross-env 来执行
    "dev": "cross-env BUILD_ENV=develop nuxt",
    "dev:test": "cross-env BUILD_ENV=test nuxt",
    "dev:preprod": "cross-env BUILD_ENV=preprod nuxt",
    "dev:prod": "cross-env BUILD_ENV=production nuxt",
    "build:dev": "cross-env BUILD_ENV=develop nuxt build",
    "build:test": "cross-env BUILD_ENV=test  nuxt build",
    "build:preprod": "cross-env BUILD_ENV=preprod  nuxt build",
    "build:prod": "cross-env BUILD_ENV=production  nuxt build",
    // 没设置环境变量，无需改变
    "start": "nuxt start"

    // ...
  }

  // ...
}
```
