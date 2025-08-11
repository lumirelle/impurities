# Windows 配置手册 / Windows Setup Manual

I mean, Windows is the best os to play games, the worst os to develop. Any agree, and any disagree?

It's sad that I can't afford a Mac Book, so I have to use Windows to develop and play games both.

## 😁 安装或重装系统

### 方法一：使用 U 盘启动器安装或重装系统

使用 Ventoy 制作 U 盘启动器，安装或重装 Windows 系统。

注意：Ventoy 默认跳过了 Windows 系统的设备检测和联网激活，如你不小心联网，可以通过拔掉网线再登录的方式实现本地账户登录。

当然，你也可以[通过命令跳过联网检测](#reset-pc)。

#### 安装 Ventoy

插入 U 盘，下载并安装 [Ventoy](https://www.ventoy.net/cn/download.html)，安装过程遵循[官方说明](https://www.ventoy.net/cn/doc_start.html)。

#### 下载 ISO

- 从 Microsoft 官网下载 ISO
  - 访问 Microsoft 官网，下载适用于你的设备的 Windows 磁盘映像 (ISO)
    - [Windows 11 ISO](https://www.microsoft.com/zh-cn/software-download/windows11)
    - [Windows 10 ISO](https://www.microsoft.com/zh-cn/software-download/windows10)
- 从 NEXT, ITELLYOU 下载特定的版本的 ISO
  - 下载并安装 BT 工具 [qBittorrent 增强版](https://github.com/c0re100/qBittorrent-Enhanced-Edition/releases)
  - 设置 Tracker <https://fastly.jsdelivr.net/gh/XIU2/TrackersListCollection/all.txt>
  - 使用 BT 工具下载 Windows ISO（推荐专业版），并放入 U 盘（如你正在使用 VPN，推荐切换到直连模式）
    - [Windows 11 ISO](https://next.itellyou.cn/Original/#cbp=Product?ID=42e87ac8-9cd6-eb11-bdf8-e0d4e850c9c6)
    - [Windows 10 ISO](https://next.itellyou.cn/Original/#cbp=Product?ID=f905b2d9-11e7-4ee3-8b52-407a8befe8d1)
    - [其他](https://next.itellyou.cn/Original/#)

#### 准备 U 盘

在 U 盘中准备必要的软件及配置。

通过 U 盘启动，选择 Ventoy 中的 Windows ISO 文件，启动执行引导程序，选择安装专业版系统，等待系统安装完毕。

### 方法二：重置电脑来重装系统 <a name="reset-pc"></a>

在系统设置选择 “系统 > 恢复 > 恢复选项 > 重置此电脑”，仅支持重装系统。

要想跳过联网权限，需要在重装完毕进入新系统的初始化设置页面后，使用 “Shift + F10” 进入 cmd，随后输入如下命令：

```shell
cd OOBE
BypassNRO.cmd
```

系统会自动重启，此后便可以跳过联网激活。

## 😘 初始化配置

按顺序搞掉恼人的垃圾捆绑系统软件，装上自己喜欢的工具。😍

### 步骤零：学会使用 winget

Install (User Scope):

```shell
winget install xxx.xxx
```

Install (Machine Scope, requires admin):

```shell
sudo winget install xxx.xxx --scope machine
```

Install on specific location:

```shell
winget install xxx.xxx --location "C:\Program Files\xxx"
```

### 步骤一：卸载垃圾捆绑软件，替换恼人的 Windows Defender

<!-- prettier-ignore-start -->

- 卸载系统捆绑软件（如：Office365、微软电脑管家等）
- 关闭 Windows Defender 的所有防病毒功能
- 安装火绒并**重启系统**

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | 火绒 | [火绒](https://www.huorong.cn/person) |

- 使用 Windows 11 轻松设置关闭防火墙、调整系统设置、卸载内置软件（Windows 10 可用）并重启

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | Windows 11 轻松设置 | [Bilibili 文章](https://www.bilibili.com/opus/904672369138729017) |

<!-- prettier-ignore-end -->

### 步骤二：搭梯子

<!-- prettier-ignore-start -->

- 安装 Clash for Windows，搭梯子！

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | Clash for Windows | [GitHub Releases](https://github.com/clashdownload/Clash_for_Windows/releases) |

<!-- prettier-ignore-end -->

### 步骤三：安装个人配置

<!-- prettier-ignore-start -->

- 准备运行环境

  | 软件名称 | 来源/安装命令 | 注意事项 |
  | -------- | ------------- | -------- |
  | Windows Terminal | [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701) | |
  | gsudo | `winget install gerardog.gsudo --scope machine` | Run as admin, because gsudo isn't installed yet |
  | Nushell | `sudo winget install nushell --scope machine` | Command `sudo` is powered by gsudo |
  | ~~PowerShell 7 (Will Deprecated)~~ | ~~[GitHub Releases](https://github.com/PowerShell/PowerShell/releases/latest)~~ | |
  | Oh My Posh | `sudo winget install JanDeDobbeleer.OhMyPosh --scope machine` | |
  | fnm | `sudo winget install Schniz.fnm` | Maybe not support `--scope machine` yet |

- 修改系统环境变量 PATH

  NOTE: 如果您安装的是较新版的 Windows 11，请务必将 `gsudo` 放于 PATH 的最前面，防止被系统内置的垃圾残缺 sudo 命令覆盖。

- 安装我的个人配置

  - Nushell

  ```ps1
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

  # 安装 Node.js 22
  fnm i 22

  # 安装必备全局依赖
  npm i nrm @antfu/ni @antfu/nip taze @sxzz/create czg -g
  # 如果你使用 node 18，推荐升级 npm 至 >= 10.9.2
  npm i npm@^10.9.2 -g

  # 安装个人配置 (Cli command: `we`)
  npm i impurities -g
  sudo we i -f
  ```

  - PowerShell (Deprecated)

  ```ps1
  # 允许执行本地脚本
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

  # 临时启动 FNM 环境（PowerShell）
  fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression

  # 安装 Node.js 22
  fnm i 22

  # 安装必备全局依赖
  npm i nrm @antfu/ni @antfu/nip taze @sxzz/create czg -g
  # 如果你使用 node 18，推荐升级 npm 至 >= 10.9.2
  npm i npm@^10.9.2 -g

  # 安装个人配置 (Cli command: `we`)
  npm i impurities -g
  sudo we i -f
  ```

<!-- prettier-ignore-end -->

### 步骤四：安装软件

<!-- prettier-ignore-start -->

- 按顺序安装并配置剩余的基建软件：

  | 软件名称 | 来源/安装命令 | 备注 |
  | -------- | ------------- | ---- |
  | Brave | [Brave](https://brave.com/download/) | [插件](#brave-extensions) |
  | uTools | [uTools](https://www.u-tools.cn/download/) | 插件：npm包实时搜索、编码小助手、聚合翻译、Any Rule |
  | Auto Dark Mode | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435) | |
  | NanaZip | [Microsoft Store](https://www.microsoft.com/store/apps/9N8G7TSCL18R) | |
  | KeePass 2 | [KeePass](https://keepass.info/download.html)  | 插件：ColoredPassword、HaveIBeenPwned、KeePassHttp |
  | Visual Studio Code | [Visual Studio Code](https://code.visualstudio.com/Download) | |
  | Cursor | [Cursor](https://www.cursor.com/cn/downloads) | |
  | IDM | [Internet Download Manager](https://www.internetdownloadmanager.com/download.html) | |
  | Git | [Git](https://git-scm.com/download/win) | |
  | Visual C++ Redistributable | [Microsoft](https://learn.microsoft.com/zh-cn/cpp/windows/latest-supported-vc-redist) | |
  | Context Menu Manager | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases) | |
  | Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | |
  | DISM++ | [GitHub Releases](https://github.com/Chuyu-Team/Dism-Multi-language/releases) | |
  | Driver Store Explorer | [GitHub Releases](https://github.com/lostindark/DriverStoreExplorer/releases) | |
  | Revo Uninstaller | [Revo Uninstaller](https://www.revouninstaller.com/zh/revo-uninstaller-free-download/) | |
  | HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) | |

- 按顺序安装如下工具软件：

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | 微信 | [微信](https://pc.weixin.qq.com/) |
  | QQ | [QQ](https://im.qq.com/pcqq/index.shtml) |
  | Telegram | [Telegram](https://desktop.telegram.org/) |
  | WPS Office | [123pan](https://www.123pan.com/s/sXtA-iLVEh.html) |
  | PixPin | [PixPin](https://pixpin.cn/) |
  | LX Music Desktop | [GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases) |
  | PotPlayer | [Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0) |
  | NVIDIA App | [NVIDIA](https://www.nvidia.cn/software/nvidia-app/) |
  | Steam | [Steam](https://store.steampowered.com/about) |
  | Epic Games | [Epic Games](https://store.epicgames.com/zh-CN/download) |
  | OBS Studio | [OBS Studio](https://obsproject.com/download) |

- 按顺序安装如下开发环境：

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | Mingw-w64 | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) |
  | Neovim | `winget install Neovim.Neovim` |
  | LazyVim | [LazyVim](https://www.lazyvim.org/installation) |
  | JDK | [Oracle](https://www.oracle.com/cn/java/technologies/downloads/#graalvmjava21) |
  | VEnv | `python -m venv /path/to/new/virtual/environment` |
  | JetBrains Toolbox | [JetBrains](https://www.jetbrains.com/zh-cn/lp/toolbox/) |
  | JetBrains IDEA | 使用 JetBrains Toolbox 安装 |
  | Visual Studio | [Visual Studio](https://visualstudio.microsoft.com/zh-hans/downloads/) |
  | Navicat Premium Lite | [Navicat](https://www.navicat.com.cn/download/navicat-premium-lite) |
  | WSL | `wsl --install` |
  | Docker Desktop | [Docker](https://www.docker.com/products/docker-desktop/) |

- （可选）安装配置其他软件

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | Ventoy | [GitHub Releases](https://github.com/ventoy/Ventoy/releases) |
  | qBittorrent Enhanced | [GitHub Releases](https://github.com/c0re100/qBittorrent-Enhanced-Edition/releases) |
  | AIDE64 | |
  | Crystal Disk Info | [CrystalDiskInfo](https://crystalmark.info/en/software/crystaldiskinfo/) |
  | KeyboardSplitter | [GitHub Releases](https://github.com/djlastnight/KeyboardSplitterXbox/releases) |
  | PDF SAM | [PDF SAM](https://pdfsam.org/zh/download-pdfsam-basic/) |

<!-- prettier-ignore-end -->

### 步骤五：配置 Brave 浏览器 <a name="brave-extensions"></a>

<!-- prettier-ignore-start -->

- 安装实用扩展（注意：`篡改猴` 扩展需要您启用开发者模式）

  | 扩展名称 | 来源/安装命令（空白同上） | 备注 |
  | -------- | ------------------------- | ---- |
  | 篡改猴 | Chrome 扩展商店 | 脚本：下载 VS Code 扩展插件 VSIX 包 |
  | ChromeKeePass | | |
  | Dark Reader | | |
  | 沉浸式翻译 | | |
  | Grammarly | | |

- 安装开发扩展

  | 扩展名称 | 来源/安装命令（空白同上） |
  | -------- | ------------------------- |
  | Vue.js devtools | Chrome 扩展商店 |
  | Vue.js devtools （Legacy） | |
  | Cookie Editor | Key：ookdjilphngeeeghgngjabigmpepanpl |
  | SEO META in 1 CLICK | |
  | Refined Github | |
  | File Icons for GitHub and GitLab | |

<!-- prettier-ignore-end -->

### 步骤六：配置系统设置

<!-- prettier-ignore-start -->

- （可选）使用 HEU KMS Activator 激活 Windows

  | 软件名称 | 来源/安装命令 |
  | -------- | ------------- |
  | HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

- 登录 Microsoft 账号，同步系统数据，调整系统设置

<!-- prettier-ignore-end -->

## 🙌 维护

- 程序应安装在如下路径：
  - 无空格路径
    - `<DRIVER>:/ProgramData/`
  - 标准应用程序安装路径
    - `<DRIVER>:/Program Files/`
    - `<DRIVER>:/Program Files (x86)/`
  - 便携程序安装路径
    - `<DRIVER>:/Program Files Portable/`
  - 用户级程序安装路径
    - `$LOCALAPPDATA/Programs/`
- 项目文件应放置在如下路径：
  - `<DRIVER>:/Projects/`
  - `<DRIVER>:/i/` (i means `I`, inspired by [antfu](https://github.com/antfu))
- 定期使用 Revo Uninstaller 卸载无用软件
- 定期使用 DISM++ 清理系统
- 定期断电关机重启
