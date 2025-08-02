# Nuxt 2 规范手册 / Nuxt 2 Standard Manual

Running requires for dev ops: node@'^14.21.3 || ^16.10.0 || >=18.0.0', npm@>=6.

Developing requires for developers: node@'^18.20.0 || ^20.10.0 || >=22.0.0', npm@>=9, pnpm@>=7, yarn@>=1.

NOTE: This article is based on node@22.17.1, npm@10.9.2, corepack@0.33.0, pnpm@10.14.0.

Dependencies:

- Nuxt
  - nuxt@2.17.3
- Nuxt modules
  - @nuxtjs/axios@latest
- Vue
  - vue@^2
- Vue Addons
  - vue-router@legacy
  - vuex@^3
- UI libraries
  - element-ui@^2
- CoreJS
  - core-js@^3

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
- Sass support
  - sass@latest
  - sass-loader@version-10 (If you are using Sass)
- CrossEnv
  - cross-env@latest (If you are using NPM scripts with environment variables without PNPM)

Deep dependencies, you don't need to concern about, but must to know the version they are:

- axios@^0.21
- webpack@^4
- postcss@^8
- babel@^7

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
we paste vue2/jsconfig.json -f

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

vue2/jsconfig.json

See [here](/assets/preferences/setup-project/vue2/jsconfig.json).

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

shell

```shell
# Nuxt
ni nuxt@2.17.3 -E

# Nuxt build modules
# >> Optional: TypeScript build, if you are writing TypeScript
ni @nuxt/typescript-build@^2 -D
# >> TODO: VueUse auto importing
# ni @vueuse/nuxt@latest

# Nuxt modules
# >> Axios support
ni @nuxtjs/axios@latest

# Vue
ni vue@^2.7.16

# Vue Addons
ni vue-router@legacy vuex@^3.6.2
# >> TODO: VueUse
# ni @vueuse/core@^11.3.0

# UI libraries
ni element-ui@^2.15.14

# CoreJS
ni core-js@latest

# TypeScript & Types, for better dev experience
ni typescript@~5.8.3 -D
ni @nuxt/types@2.17.3 -D
```

## 🌟 设置代码检查与格式化

> 真心期待前端有一个大统一的、完整的生态工具链！！！

### 前置任务

shell

```shell
# ESLint
ni eslint@latest -D

# ESLint config
# Since the version of 4.15.0, `@antfu/eslint-config` requires node@>=20 caused by `eslint-plugin-jsdoc`
ni @antfu/eslint-config@~4.14.1 -D

# ESLint & Prettier plugins
ni eslint-plugin-format@latest @prettier/plugin-xml@latest -D

# Optional: If you are using TypeScript config of ESLint, you need to install `jiti`
ni jiti@latest -D
```

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

### 捂嘴

如果你想捂嘴，不让它天天喊我弃用了 XXX API，请参考如下配置：

nuxt.config.js

```js
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

NOTE: 仅非 PNPM 项目需要使用。PNPM 原生支持 shellEmulator 选项，支持跨平台设置环境变量。

```shell
# cross-env：为运行 NPM 脚本时设置环境变量提供跨平台兼容性，目前仅在基于 webpack 4 的项目见到过使用案例（不包括封装了 webpack 4 的 vue-cli）
ni cross-env@latest -D
```

NOTE: 需要使用 cross-env 代理的 npm 脚本应手动配置。设置了环境变量，才需要改为通过 cross-env 来执行。

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
