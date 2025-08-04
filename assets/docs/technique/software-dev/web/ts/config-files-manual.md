# TS 配置文件手册 / TS Config Files Manual

TS 配置文件，即：`jsconfig.json` 和 `tsconfig.json`，前者是后者的子集。

TS 配置文件用于控制 TS 编译器的行为。

然鹅现如今，我们通常只用 TypeScript 做类型检查，编译的任务则交给 Vite & Unbuild 等构建工具。此种情况下，我们配置 TS 的目标就仅仅是获得更好的类型检查 & 开发体验。

本文基于此种情况，介绍 TS 配置文件的配置。

## ⚙️ 编译器选项

### 基本选项

基于我们使用 Vite & Unbuild 等构建工具做构建，只使用 TypeScript 做类型检查的大背景，我们需要启用 `noEmit` 选项，它会阻止 TS 编译器编译源代码。

```json
{
  "compilerOptions": {
    "noEmit": true
  }
}
```

同时，我们会希望在源代码中能使用最新的 ES 语法，降级和 Polyfill 的工作同样交给构建工具，因此要将 TypeScript 支持的语言目标设置成 `ESNext`，并增加类型支持（通过在库选项中增加 `ESNext` 来实现）。

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": [
      "ESNext"
    ]
  }
}
```

也正因为构建工作都交给了构建工具，我们需要将 TypeScript 的模块解析 & 转换策略分别设置成 `"moduleDetection": "force"` & `"module": "preserve"`。它们强制 TypeScript 把所有模块都视为 ES 模块，并保留原有的模块语法。

你可能会好奇，为什么我们设置了 `"noEmit": true` 阻止 TypeScript 编译源代码后，还要关心 TypeScript 的模块解析 & 转换策略？

因为：模块解析 & 转换策略不仅会影响编译输出，也会影响 TypeScript 在类型检查时的行为。

👉️ [官方说明](https://www.typescriptlang.org/tsconfig/#module)

```json
{
  "compilerOptions": {
    "moduleDetection": "force",
    "module": "preserve"
  }
}
```

### 路径解析

我们还需要基于构建工具中配置的路径解析规则，配置 TypeScript 的路径解析规则。

例如 Vue 项目，我们将 `@` 路径解析为 `src` 目录，那就同样需要告诉 TypeScript，否则它看到 `@` 时会一脸懵逼：

```json
{
  "compilerOptions": {
    "paths": {
      "@": ["src"],
      "@/*": ["src/*"]
    }
  }
}
```

### JSON 支持

TypeScript 默认不支持将 JSON 文件解析为模块，需要手动启用：

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

Why? That's really makeing no sense & troubling some.

### 全局类型

如果不设置 `types` 选项，TypeScript 会自动加载 `node_modules/@types` 目录下的所有类型定义，问题在于：

- 大项目导致加载慢
- 类型污染

因此，尽量不要使用任何的全局类型注入，最佳实践是显示导入时让 TypeScript 自己解析依赖包中 `package.json` 中提供的类型定义。

我们需要设置 `types` 选项为空数组来禁用自动加载行为：

```json
{
  "compilerOptions": {
    "types": []
  }
}
```

### 限制 & 兼容

来不及解释了，直接上配置：

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "allowJs": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noUncheckedSideEffectImports": true
  }
}
```

慢慢顾名思义，查阅 [官方文档](https://www.typescriptlang.org/tsconfig/) 或者 [Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet) 吧。

## 🎯 目标文件

通过 `include` 和 `exclude` 选项，我们可以控制 TypeScript 编译器检查哪些文件的类型。

例如 Vue 项目：

```json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules/**/*", "dist/**/*"]
}
```

## 📦️ 模块化

TypeScript 通过 `extends`，`references` 支持模块化的配置。

好处是：

- 复用配置
- 灵活配置
- 在指定目录下才加载配置，提升类型检查的性能

例如 Vue 项目：

tsconfig.json:

```json
/**
 * Root TSConfig for Vue 2 Project, using `references` to combine other TSConfig.
 */
{
  "references": [
    {
      "path": "./tsconfig.src.json"
    },
    {
      "path": "./tsconfig.others.json"
    }
  ],
  "files": []
}
```

tsconfig.src.json:

```json
/**
 * TSConfig for src, based on https://www.totaltypescript.com/tsconfig-cheat-sheet
 * Only for IDE type support. I prefer to use `unbuild` & `vite` as bundler to build the project.
 */
{
  // Compiler options
  "compilerOptions": {
    // Base options
    "target": "ESNext", // Allow to use the latest ECMAScript features, bundler will handle the ES downleveling & polyfill for us.
    "jsx": "preserve",
    "lib": [
      "ESNext",
      "webworker",
      "dom",
      "dom.iterable"
      // "ScriptHost" // OPTIONAL: If you are preparing to support IE, you can uncomment this.
    ],
    "moduleDetection": "force",
    "module": "preserve",

    // Path resolution
    "paths": {
      "~": ["./src"],
      "~/*": ["./src/*"],
      "@": ["./src"],
      "@/*": ["./src/*"],
      "~~": ["./"],
      "~~/*": ["./*"],
      "@@": ["./"],
      "@@/*": ["./*"]
      /* Add your custom paths resolution here, should align with your bundler config */
    },

    // JSON support
    "resolveJsonModule": true,

    // Do not load any global types
    "types": [],

    // Strictness & compatibility
    "allowImportingTsExtensions": true,
    "allowJs": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noUncheckedSideEffectImports": true
  },

  // Include files
  "include": [
    /* Custom your include files below */
    "src/**/*"
  ],

  // Excluded files
  "exclude": [
    /* Custom your excluded files below */
    "node_modules/**/*",
    "dist/**/*"
  ]
}
```

tsconfig.others.json:

```json
/**
 * TSConfig for other files, based on https://www.totaltypescript.com/tsconfig-cheat-sheet
 * Only for IDE type support. I prefer to use `unbuild` & `vite` as bundler to build the project.
 */
{
  // Compiler options
  "compilerOptions": {
    // Base options
    "target": "ESNext", // Allow to use the latest ECMAScript features, bundler will handle the ES downleveling & polyfill for us.
    "lib": [
      "ESNext"
    ],
    "moduleDetection": "force",
    "module": "preserve",

    // Path resolution
    "paths": {
      /* Add your custom paths resolution here, should align with your bundler config */
    },

    // JSON support
    "resolveJsonModule": true,

    // Do not load any global types
    "types": [],

    // Strictness & compatibility
    "allowImportingTsExtensions": true,
    "allowJs": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noUncheckedSideEffectImports": true
  },

  // Include files
  "include": [
    /* Custom your include files below */
    "**/*"
  ],

  // Excluded files
  "exclude": [
    /* Custom your excluded files below */
    "node_modules/**/*",
    "dist/**/*",
    "src/**/*"
  ]
}
```

## 🔗 TSConfig Helper

快速查看本配置目标文件文件（生效或排除的）。

👉️ [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-tsconfig-helper)
