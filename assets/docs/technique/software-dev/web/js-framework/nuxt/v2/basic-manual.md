# Nuxt 2 基础手册 / Nuxt 2 Basic Manual

## 📑 为什么使用？ / Why use it?

1. 基于 Vue 生态
2. 模块化功能，无需重复造轮子
3. 高性能和默认的应用优化
4. 封装好的 SSR 渲染模式，开箱即用，SEO 友好

## 📦 依赖 / Dependency

核心支持:

- @nuxt/core: 核心功能支持
- @nuxt/utils: Nuxt 工具库、工具函数集
- @nuxt/vue-app: Nuxt 的 Vue 集成
- @nuxt/components: Vue 组件自动导入能力支持
- @nuxt/webpack: Nuxt 的 Webpack 集成
- @nuxt/babel-preset-app: Nuxt 的 Babel 集成
- @nuxt/config: Nuxt 默认的应用优化配置以及 nuxt.config 配置处理
- @nuxt/server: Nuxt 服务器支持
- @nuxt/vue-renderer: Nuxt 渲染器，对 Universal（SSR/SSG） 和 SPA 的支持
- @nuxt/generator: Nuxt 对 SSG 的支持
- @nuxt/builder: 构建工具
- @nuxt/cli: 命令行支持

其他:

- @nuxt/opencollective: 在本包被安装时展示 opencollective 链接
- @nuxt/loading-screen: 项目启动页面
- @nuxt/telemetry: Nuxt 遥测数据收集

## 最佳使用！ / Best practice!

### 1. 配置！ / Setup!

基于任意的 Nuxt 2 项目模板依照 [Nuxt 2 Standard Manual](standard-manual.md) 完成基础设置。

参考的配置文件格式：

nuxt.config

```js
// Uncomment if you want to analyze unimported files, just works on dev mode
// import UnimportedAnalyzerWebpackPlugin from 'unimported-analyzer-webpack-plugin'

export default {
  /**
   * Web page head
   */
  head: {
    title: 'XXX',
    meta: [
      // ...
    ],
    link: [
      // ...
    ],
    script: [
      // ...
    ],
  },

  /**
   * Web page global css
   */
  css: [
    // ...
  ],

  /**
   * Loading bar style
   */
  loading: {
    // ...
  },

  /**
   * Directory configuration
   */
  dir: {
    // ...
  },

  /**
   * Build-time modules
   */
  buildModules: [
    '@nuxtjs/style-resources',
    // ...
  ],

  styleResources: {
    scss: '@/assets/css/var.scss',
  },

  /**
   * Runtime modules
   */
  modules: [
    'nuxt-precompress',
    // ...
  ],

  nuxtPrecompress: {
    enabled: true,
    report: false,
    test: /\.(js|css|json|txt|html|ico|svg|xml)$/,
    middleware: {
      enabled: true,
      enabledStatic: true,
      encodingsPriority: ['br', 'gzip'],
    },
    gzip: {
      enabled: true,
      filename: '[path].gz[query]',
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 },
    },
    brotli: {
      enabled: true,
      filename: '[path].br[query]',
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    },
  },

  /**
   * Plugins
   */
  plugins: [
    // ...
  ],

  /**
   * Vue configuration
   */
  vue: {
    config: {
      productionTip: false,
    },
  },

  /**
   * Vue Router configuration
   */
  router: {
    // ...
  },

  /**
   * Build configuration
   */
  build: {
    cache: false,
    parallel: true,
    // If you want to use element ui
    transpile: [/^element-ui/],

    // Babel
    babel: {
      // 按需导入 element-ui 样式 scss
      plugins: [
        [
          'component',
          { libraryName: 'element-ui', styleLibraryName: 'theme-chalk' },
        ],
      ],
    },

    // PostCSS
    postcss: {
      preset: {
        autoprefixer: true,
      },
    },

    // Webpack Loaders
    loaders: {
      imgUrl: {
        limit: 0,
      },
      scss: {
        sassOptions: {
          // scss 支持本身不需要任何配置
          // 只有代码中使用到大量的弃用 API 时，才需要禁用警告（因为实在是太多咧）
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

    // Webpack Optimization Plugins
    // nuxt@2.18.1 依赖的 @nuxt/webpack 内置了如下优化插件
    // extract-css-chunks-webpack-plugin
    extractCSS: true,
    // optimize-css-assets-webpack-plugin
    optimizeCSS: {
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    },
    // terser-webpack-plugin
    terser: ['preprod', 'production'].includes(process.env.BUILD_ENV)
      ? {
          extractComments: false,
          terserOptions: {
            // 移除 console.*
            compress: { drop_console: true },
            // 混淆变量名
            mangle: true,
            // 去除注释 & 压缩代码
            output: { comments: false, beautify: false },
          },
        }
      : {},

    // Uncomment if you want to analyze unimported files, just works on dev mode
    // plugins: [
    //   new UnimportedAnalyzerWebpackPlugin({
    //     preset: 'nuxt',
    //     ignores: [
    //       // 添加你需要忽略的文件... / Add files you need to ignore...
    //     ],
    //     important: [
    //       // 添加你不想忽略的文件... / Add files you don't want to ignore...
    //     ],
    //   }),
    // ],

    // Webpack Optimization Configuration
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 244 * 1024, // 244kb
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue|scss)$/,
            chunks: 'all',
            enforce: true,
          },
          elementUI: {
            name: 'element-ui',
            test: /node_modules[\\/]element-ui/,
            priority: 20,
          },
        },
      },
    },

    extend(config, { isDev, isClient }) {
      // ...
    },
  },

  /**
   * Environment variables
   */
  env: {
    // ...
  },

  /**
   * Server configuration
   */
  server: {
    port: 80,
    host: '0.0.0.0',
  },
}
```
