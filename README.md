<h1 align="center">
  <a href="https://github.com/Lumirelle/impurities" rel="noopener">
</h1>

<h3 align="center">🥰 Impurities</h3>

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/impurities)](https://www.npmjs.com/package/impurities)
[![Status](https://img.shields.io/badge/status-active-success.svg)](.)
[![GitHub Issues](https://img.shields.io/github/issues/Lumirelle/impurities.svg)](https://github.com/Lumirelle/impurities/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Lumirelle/impurities.svg)](https://github.com/Lumirelle/impurities/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

> I swear, this is the last time I have an obsessive-compulsive disorder attack.

<p align="center"> It includes all kinds of impurities, preferences, docs, resources, templates, etc.
    <br>
</p>

## 📝 Table of Content

- [About](#about)
- [Catalogs](#catalogs)
- [Usage](#usage)
  - [Preferences](#preferences)
    - [Manually Setup](#manually_setup)
    - [Command Setup](#command_setup)
    - [Copy & Paste](#copy_paste_preferences)
  - [Templates](#templates)
    - [Copy & Paste](#copy_paste_templates)
- [Authors](#authors)

## 🧐 About <a name="about"></a>

It includes all kinds of impurities, preferences, docs, resources, templates, etc.

## 📑 Catalogs <a name="catalogs"></a>

- `/impurities`
  - `/personal`: **&lt;use-case&gt;** Personal usage
    - `/docs`: **&lt;docs&gt;** Collection of documents, such as manuals and logs
      - `/life`: **&lt;type&gt;** Documents about life
      - `/technique`: **&lt;type&gt;** Documents about technique
    - `/preferences`: **&lt;preferences&gt;** Collection of preferences, such as `.gitconfig`
      - `/deployer`: **&lt;type&gt;** Preferences used by deployer
      - `/editor`: **&lt;type&gt;** Preferences used by editor
      - `/formatter`: **&lt;type&gt;** Preferences used by formatter
      - `/linter`: **&lt;type&gt;** Preferences used by linter
      - `/package-manager`: **&lt;type&gt;** Preferences used by package manager
      - `/project`: **&lt;type&gt;** Preferences used by project
      - `/terminal`: **&lt;type&gt;** Preferences used by terminal
      - `/vcs`: **&lt;type&gt;** Preferences used by version control system
      - `/vpn`: **&lt;type&gt;** Preferences used by vpn
    - `/resources`: **&lt;resources&gt;** Collection of resources, such as fonts
      - `/fonts`: **&lt;type&gt;** Font resources
    - `/templates`: **&lt;templates&gt;** Collection of template, such as `README.md`, `LICENSE`
      - `/code`: **&lt;type&gt;** Code template
      - `/license`: **&lt;type&gt;** License template
      - `/project`: **&lt;type&gt;** Project template
      - `/readme`: **&lt;type&gt;** Readme template
  - `/work`: **&lt;use-case&gt;** Work-only (Of course, it should be ignored by git)
    - **THE SAME TO THE FOLDERS UNDER `/personal`**

See total catalogs [here](CATALOGS.json).

## 🎈 Usage <a name="usage"></a>

### Preferences <a name="preferences"></a>

#### Manually Setup <a name="manually_setup"></a>

Just download the preferences you want under the folder marked as `preferences` introduced above and put them into the right place.

#### Command Setup <a name="command_setup"></a>

Install this package globally by node.js package manager likes `npm`, `yarn`, `pnpm` and so on.

```shell
pnpm i impurities -g
# or
npm i impurities -g
```

Then, use the command `iip` to <u>i</u>nstall all the <u>p</u>references

```shell
iip
```

Now, please enjoy! See the help information by using the `--help` option:

```shell
iip --help
```

#### Copy & Paste <a name="copy_paste_preferences"></a>

Follow the step above to install this package by node.js package manager, then, use the command `icp` to <u>c</u>opy and paste <u>p</u>references

```shell
# Copy into current dir
icp eslint.config.mjs

# Copy into `./src`, if `./src` is an existing folder
icp eslint.config.mjs ./src
```

See the help information by using the `--help` option:

```shell
icp --help
```

### Templates <a name="templates"></a>

#### Copy & Paste <a name="copy_paste_templates"></a>

Follow the step above to install this package by node.js package manager, then, use the command `ict` to <u>c</u>opy and paste <u>t</u>emplates

```shell
# Copy into current dir
ict LICENSE

# Copy into `./src`, if `./src` is an existing folder
ict LICENSE ./src
```

See the help information by using the `--help` option:

```shell
ict --help
```

## ✍️ Authors <a name="authors"></a>

- [@Lumirelle](https://github.com/Lumirelle) - Anything
