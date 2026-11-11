# dsh-cloudq

[![npm version](https://img.shields.io/npm/v/dsh-cloudq)](https://www.npmjs.com/package/dsh-cloudq)
[![npm downloads](https://img.shields.io/npm/dt/dsh-cloudq)](https://www.npmjs.com/package/dsh-cloudq)
[![node](https://img.shields.io/node/v/dsh-cloudq)](https://www.npmjs.com/package/dsh-cloudq)
[![license](https://img.shields.io/github/license/TencentCloud/cloudq-for-dsh)](LICENSE)

[English](README.md) | 简体中文

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 CloudQ 集成插件。插件为 Web Profile 提供 CloudQ 模式，内置 `cloudq` Skill，并提供 CloudQ 用量、架构视图、本地凭证配置和插件管理能力。

## 功能介绍

- **CloudQ 对话**：通过内置技能进行云运维问答，使用 DSH 原生输入框提问。
- **首页灵感**：按分类浏览推荐问题，点击填入草稿；可在首页快捷弹窗或插件设置中配置凭证。
- **套餐和用量**：查看订阅额度、有效积分加量包及分页用量明细，前往官方页面购买套餐。
- **会话制品**：浏览、下载会话产物，CloudQ 回复完成后列表后台静默刷新。
- **只读架构画布**：在当前页面查看已保存的架构图，支持 2D/3D、缩放、适应及全屏，也可前往云顾问查看。
- **工作台集成**：支持深浅色主题、可折叠侧面板、插件管理与版本更新提示。

版本变更记录请参阅[更新日志](CHANGELOG.md)。

## 演示

![dsh-cloudq 演示](assets/demo.gif)

演示内容：欢迎页分类推荐、套餐用量、会话制品及只读架构画布。

## 环境要求

- Node.js `>=22.19.0`
- DeepSeek Harness `0.1.1-rc.2` 或兼容的更高 `0.1.x` 版本
- `dsh plugin` 命令可调用 `pnpm`
- macOS、Linux 或 Windows
- CloudQ 对话模式需要可通过 `python3` 命令运行的 Python 3；凭证配置、首页灵感、套餐用量、制品和架构画布不依赖 Python。
- 架构画布需要浏览器支持 WebGPU 或 WebGL2。内置 Tessera 优先使用 WebGPU，不可用时回退 WebGL2；两者均不可用时，可通过外链前往云顾问查看。

## 安装

```sh
dsh plugin --profile web add dsh-cloudq
```

安装完成后重启 Web Profile：

```sh
dsh --profile web
```

打开 DSH 输出的访问地址，即可在对话输入区和侧边栏看到 CloudQ 入口。也可以通过 `/cloudq` 显式调用内置 Skill。

## 升级与卸载

```sh
dsh plugin --profile web update dsh-cloudq
dsh plugin --profile web remove dsh-cloudq
```

修改已安装的插件后，需要重启 Web Profile。

## 使用步骤

1. 打开 **设置 → 插件**，展开 **CloudQ** 卡片。
2. 填入腾讯云 `SecretId` 和 `SecretKey`（可前往 [访问密钥控制台](https://console.cloud.tencent.com/cam/capi) 获取）。
3. 点击 **测试连接** 验证密钥，再点击 **保存配置**；卡片显示 **AKSK有效** 即配置成功。
4. 从侧栏进入 CloudQ 会话，或通过 `/cloudq` 显式调用技能。未配置凭证时，也可在欢迎页点击 **配置 AK/SK**，在快捷弹窗中完成配置。
5. 在首页切换问题分类，点击推荐卡片填入草稿，确认内容后使用 DSH 原生输入框发送。
6. 点击页面右侧中部把手展开 **用量 / 制品 / 架构图**。用量页展示套餐与积分；架构图卡片打开本页只读画布，支持 2D/3D、适应、缩放及全屏，右上角 **在云顾问查看** 可跳转对应控制台页面。

## 工作原理

```mermaid
flowchart LR
  U["用户"] --> W["DSH Web Profile"]
  W --> P["dsh-cloudq 插件"]
  P --> CL["client 端<br/>侧栏 / 能力面板 / 设置"]
  P --> HOST["host 端（Node）<br/>凭证 / 用量 / 制品 / 架构图 / 自更新"]
  CL -- "/api/dsh-cloudq/*" --> HOST
  HOST -- "TC3-HMAC-SHA256 签名<br/>进程内完成，零外部依赖" --> TC["腾讯云智能顾问 API"]
  P --> SK["内置 cloudq Skill"]
  SK -- "CloudQ 对话模式<br/>由 Agent 执行" --> PY["Python 辅助脚本"]
  PY --> TC
  style HOST fill:#ddf4ff
  style SK fill:#dafbe1
  style TC fill:#fff1e5
```

## 凭证配置

设置卡片支持配置腾讯云 `SecretId` 和 `SecretKey` 凭证。

- 凭证以明文保存在本机 `~/.tencent-cloudq/credential.json`，并非加密保险库。Unix 使用目录 700、文件 600；Windows 的访问控制依赖用户目录 ACL，请妥善保护本机账户。
- 面板接口在 Host 进程内完成签名与调用（Node 原生实现），凭证不经过任何子进程，不会出现在进程列表中。
- 浏览器接口仅返回凭证状态和脱敏标识，不返回凭证内容或本地凭证路径。
- 可通过退出登录操作删除本地凭证。

请遵循最小权限原则，只授予 CloudQ 操作所需的权限。内置 Skill 可以调用云管理的读写操作，请在批准前检查每项操作的具体内容。

## 安全机制

- Host API 只接受来自回环地址的同源请求。
- JSON 请求体大小限制为 64 KiB。
- 非预期的内部错误不会返回到浏览器。
- 远程数据通过 DOM 文本节点渲染，不使用 HTML 注入。
- 下载链接必须使用 HTTPS。
- npm 包不包含凭证、Token 或本地环境文件。

如需报告安全问题，请通过 [GitHub Issues](https://github.com/TencentCloud/cloudq-for-dsh/issues) 提交，且不要附带真实凭证。

## 常见问题

**装/更新不到最新版本？**

先查看 npm 上的版本状态：**Validating** 表示自动审核中，版本尚未公开可用，指定版本号也不能绕过审核。

对于已公开发布的版本，pnpm 11 默认的 24 小时发布时间限制可能延迟安装。可等待冷却期结束，或在确认版本可信后使用 `dsh-cloudq@<版本号>` 显式选择，仍需遵循本机安全策略。

**Windows 能用吗？需要装 Python 吗？**

能。设置、用量、灵感、制品、架构图等功能为 Node 原生实现，macOS / Linux / Windows 均**不需要 Python**。仅 **CloudQ 对话模式**由内置 Skill 驱动，需要 `python3`。

**AK/SK 存在哪里？安全吗？**

存于 `~/.tencent-cloudq/credential.json`，存储方式与权限边界见[凭证配置](#凭证配置)。点击「退出登录」可删除本地凭证。

**为什么点「测试连接」失败？**

先确认本地 DSH 服务正在运行且能连接腾讯云，再根据返回错误检查密钥有效性、权限和 CloudQ 开通状态。测试连接不依赖 Python。

## 本地开发

```sh
pnpm install
pnpm run lint
pnpm run typecheck
pnpm run test:all
pnpm run build
pnpm run check:client
npm pack --dry-run --registry=https://registry.npmjs.org/
```

npm 包内包含预构建的 Host 和 Web Client 产物、Bundle Patch、CloudQ 运行时图标以及内置 Skill。用户从 Registry 安装时不需要执行构建脚本。

## 目录结构

```text
src/                         Host 与 Web Client 源码
skills/cloudq/               内置 CloudQ Skill 与 Python 辅助脚本
assets/cloudq.png            Host 提供的运行时图标
scripts/                     构建和发布检查脚本
tests/                       单元测试、集成测试与包契约测试
cordis.patch.yml             DSH Bundle 配置层
```

## 发布

源码在 [TencentCloud/cloudq-for-dsh](https://github.com/TencentCloud/cloudq-for-dsh) 完成评审和版本管理。只有仓库检查与安装包冒烟测试全部通过后，才可将 npm 版本发布到官方 Registry。

## 更多文档

- 更新日志：[`CHANGELOG.md`](CHANGELOG.md)
- 开发与维护指南：[`DEVELOPMENT.md`](DEVELOPMENT.md)

## 许可证

插件采用 MIT 许可证，详情请参阅 [`LICENSE`](LICENSE)。内置 Tessera 运行时及其第三方依赖的声明与许可文本见 [`assets/tessera/NOTICE`](assets/tessera/NOTICE)。
