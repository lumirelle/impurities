# Node.js 手册 / Node.js Manual

## 📚 什么是 Node.js？ / What is Node.js?

独立于浏览器运行的 JS 运行时环境。

## 🔧 如何配置？ / How to setup?

### 1. 安装并配置（基于 Windows 11，PowerShell 7，fnm）

fnm 是一个跨平台的 Node.js 版本管理器，支持读取项目级 `.node-version` 或 `.nvmrc` 配置，支持自动切换终端中使用的 node 版本。

安装 fnm：

```shell
winget install Schniz.fnm
```

设置 Shell 环境（临时方案）：

- Nushell

  ```ps1
  # 启用 fnm 环境
  # NOTE: 不是所有版本的 node 都支持 corepack
  # 临时启动 FNM 环境（No official support for Nushell now）
  if not (which fnm | is-empty) {
    ^fnm env --json | from json | load-env
    $env.PATH = $env.PATH | prepend ($env.FNM_MULTISHELL_PATH | path join (if $nu.os-info.name == 'windows' {''} else {'bin'}))
    $env.config.hooks.env_change.PWD = (
      $env.config.hooks.env_change.PWD? | append {
        condition: {|| ['.nvmrc' '.node-version', 'package.json'] | any {|el| $el | path exists}}
        code: {|| ^fnm use --install-if-missing --corepack-enabled}
      }
    )
  }

  # 安装 node lts （将被设为默认版本）
  fnm install lts
  ```

- PowerShell

  ```ps1
  # 允许执行本地脚本
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

  fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression

  # 安装 node lts （将被设为默认版本）
  fnm install lts
  ```

推荐方案：

- 使用 [impurities](https://github.com/lumirelle/impurities) 完成 Shell Profile 配置，支持自动启用 fnm 环境。

官方 [FNM Shell Setup](https://github.com/Schniz/fnm?tab=readme-ov-file#shell-setup) 指南。

### 2. 安装必备全局依赖

```shell
# For latest LTS
npm i nrm @antfu/ni @antfu/nip taze @sxzz/create commitizen cz-git -g
# For 14 (LTS)
npm i @antfu/ni -g

# 如果你使用 node 18，推荐升级 npm 至 >= 10.9.2，修复了许多要命的功能性问题
npm i npm@^10.9.2 -g
```

## 💪🏼 如何使用？ / How to use?

### 1. 新建项目

```shell
cd your-node-project

# 设置项目 node 版本，并重启你的终端
fnm use 18
echo (node -v) > .node-version

# 使用 corepack 设置包管理器 (pnpm@>=9 需要 node@>=18)
# 包管理器发布新版本时，可以重新运行此命令
corepack use pnpm@latest-10
```

### 2. 包管理器

- [npm](nodejs-pm-npm-manual.md)
- [pnpm（推荐）](nodejs-pm-pnpm-manual.md)
- [yarn](nodejs-pm-yarn-manual.md)
- ...
