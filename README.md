<h1 align="center">
  <a href="https://github.com/lumirelle/impurities" rel="noopener">
</h1>

<h3 align="center">🥰 Impurities</h3>

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/impurities)](https://www.npmjs.com/package/impurities)
[![Status](https://img.shields.io/badge/status-active-success.svg)](.)
[![GitHub Issues](https://img.shields.io/github/issues/lumirelle/impurities.svg)](https://github.com/lumirelle/impurities/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/lumirelle/impurities.svg)](https://github.com/lumirelle/impurities/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

> [!Caution]
>
> This project is still under heavy development, and the usage & assets may change frequently.
>
> This project only supports Windows now.
>
> I swear, this is the last time I have an obsessive-compulsive disorder attack. 🥰

<p align="center"> It includes all kinds of impurities, demos, docs, preferences, resources, templates, etc.
    <br>
</p>

## 📝 Table of Content

- [About](#about)
- [Catalogs](#catalogs)
- [Usage](#usage)
  - [Install Preferences](#install-preferences)
  - [Uninstall Preferences](#uninstall-preferences)
  - [Paste Anything](#paste-anything)
- [Authors](#authors)

## 🧐 About <a name="about"></a>

It includes all kinds of impurities, preferences, docs, resources, templates, etc.

## 📑 Catalogs <a name="catalogs"></a>

- `/assets`: **&lt;assets&gt;** Collection of assets, such as preferences, resources, templates, etc.
  - `/preferences`: **&lt;preferences&gt;** Collection of preferences, such as `.gitconfig`
    - `/setup-env`: **&lt;type&gt;** Preferences used by setting up environment
    - `/setup-os`: **&lt;type&gt;** Preferences used by setting up OS
    - `/setup-project`: **&lt;type&gt;** Preferences used by setting up project
    - `/setup-tools`: **&lt;type&gt;** Preferences used by setting up tools
  - `/resources`: **&lt;resources&gt;** Collection of resources, such as fonts
    - `/fonts`: **&lt;type&gt;** Font resources
    - `/images`: **&lt;type&gt;** Image resources
  - `/templates`: **&lt;templates&gt;** Collection of template, such as `README.md`, `LICENSE`
    - `/license`: **&lt;type&gt;** License templates
    - `/log`: **&lt;type&gt;** Log templates
    - `/readme`: **&lt;type&gt;** Readme templates
    - `/scss`: **&lt;type&gt;** SCSS templates
    - `/vue`: **&lt;type&gt;** Vue templates
- `/docs`: **&lt;docs&gt;** Collection of documents, such as manuals and logs
  - `/life`: **&lt;type&gt;** Documents about life
  - `/technique`: **&lt;type&gt;** Documents about technique
- `/playground`: **&lt;playground&gt;** Collection of playgrounds, such as `vue2-scss-bem`

See total catalogs [here](CATALOGS.json).

## 🎈 Usage <a name="usage"></a>

### Install Preferences <a name="install-preferences"></a>

> NOTE: In high version of node.js, you may need to run this command as Administrator.

Install this package globally by node.js package manager likes `npm`, `yarn`, `pnpm` and so on.

```shell
pnpm i impurities -g
# or
npm i impurities -g
```

Then, use the command `we install` to install all the preferences

```shell
we install
```

Now, please enjoy! See the help information by using the `--help` option:

```shell
we install --help
```

### Uninstall Preferences <a name="uninstall-preferences"></a>

> NOTE: In high version of node.js, you may need to run this command as Administrator.

Install this package globally by node.js package manager likes `npm`, `yarn`, `pnpm` and so on.

```shell
pnpm i impurities -g
# or
npm i impurities -g
```

Then, use the command `we uninstall` to uninstall all the preferences

```shell
we uninstall
```

Now, please enjoy! See the help information by using the `--help` option:

```shell
we uninstall --help
```

### Paste Anything <a name="paste-anything"></a>

Follow the step above to install this package by node.js package manager, then, use the command `we paste` to paste anything

```shell
# Copy into current dir
we paste eslint.config.mjs

# Copy into `./src`, if `./src` is an existing folder
we paste eslint.config.mjs ./src
```

See the help information by using the `--help` option:

```shell
we paste --help
```

## ✍️ Authors <a name="authors"></a>

- [@Lumirelle](https://github.com/lumirelle) - Anything
