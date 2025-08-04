# JS Bundler -- Webpack Manual

## 📦 Bundle & Module & Chunk

Webpack treat every single file as a independent **module**.

While bundling, webpack will combine the modules shared the same entry point into a **chunk**.

If you haven't set chunk split rules, webpack will generate a **bundle** for every chunk.

## 😎 Optimization

### Split Chunks

The fact is, we will get a large bundle if we don't set any chunk split rules while we are working on a large project. When our user visit our website, they will have to take a long long time to load the bundle.

Split chunks let us can split a large bundle into smaller chunks, which can improve the user experience.

#### Default Configuration of Webpack 4

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'async',

      // If the chunk is smaller than this size, it must not be split.
      minSize: 30000,
      // If the chunk is larger than this size, it must be split.
      maxSize: 0,

      // If the times that a chunk is used by others less than this value, it must not be split.
      minChunks: 1,

      // The maximum spilt times of an async chunk.
      maxAsyncRequests: 5,
      // The maximum spilt times of an initial chunk.
      maxInitialRequests: 3,

      // The delimiter of the chunk name.
      automaticNameDelimiter: '~',
      // The maximum length of the chunk name.
      automaticNameMaxLength: 30,

      // Naming rules of the chunk.
      name: true,

      // The cache groups of the chunk.
      // It's a map of specific chunk split rules.
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // The higher the value, the more likely to effect.
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

#### `splitChunks.chunks`

<table width="100%">
<tr><th>Acceptable Value</th>
<th>Description</th></tr>
<tr><td>'async'</td>
<td>Split async chunks only.<br>
Async chunks are the chunks that are included in the entry points by dynamic import.<br>
For example:
<pre><code>import('./module.js').then(module => {
  module.default();
});</code></pre>
Or:
<pre><code>require.ensure([], () => {
  const module = require('./module.js');
  module.default();
});</code></pre>
</td></tr>
<tr><td>'initial'</td>
<td>Split initial chunks only.<br>
Initial chunks are the chunks that are included in the entry points by static import.<br>
For example:
<pre><code>import './module.js';</code></pre>
Or:
<pre><code>require('./module.js');</code></pre>
</td></tr>
<tr><td>'all'</td>
<td>Split all types of chunks referred above.</td></tr>
</table>

Commonly, we recommend to set `splitChunks.chunks` to `'all'` to split all types of chunks.
