# dsh-cloudq

[English](README.md) | 简体中文

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 CloudQ 集成插件。插件为 Web Profile 提供 CloudQ 模式，内置 `cloudq` Skill，并提供 CloudQ 用量、架构视图、本地凭证配置和插件管理能力。

## 截图

![CloudQ 风险分析对话](assets/screenshots/chat-risk-analysis.png)

![CloudQ 设置与插件管理](assets/screenshots/settings.png)

## 环境要求

- Node.js `>=22.19.0`
- DeepSeek Harness `0.1.1-rc.2` 或兼容的更高 `0.1.x` 版本
- `dsh plugin` 命令可调用 `pnpm`
- 可通过 `python3` 命令运行 Python 3
- macOS 或 Linux

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

## 凭证配置

设置卡片支持配置腾讯云 `SecretId` 和 `SecretKey` 凭证。

- 凭证保存在本机 `~/.tencent-cloudq/credential.json`，文件权限仅允许当前用户访问。
- 敏感凭证通过标准输入传递给 Python 辅助脚本，不会放入命令行参数。
- 浏览器接口仅返回凭证状态和脱敏标识，不返回凭证内容或本地凭证路径。
- 可通过退出登录操作删除本地凭证。

请遵循最小权限原则，只授予 CloudQ 操作所需的权限。内置 Skill 可以调用云管理的读写操作，请在批准前检查每项操作的具体内容。

## 安全机制

- Host API 只接受来自回环地址的同源请求。
- JSON 请求体大小限制为 64 KiB。
- Python 辅助脚本的输出大小受到限制，非预期的内部错误不会返回到浏览器。
- 远程数据通过 DOM 文本节点渲染，不使用 HTML 注入。
- 下载链接必须使用 HTTPS。
- npm 包不包含凭证、Token 或本地环境文件。

如需报告安全问题，请通过 [GitHub Issues](https://github.com/TencentCloud/cloudq-for-dsh/issues) 提交，且不要附带真实凭证。

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

本项目采用 MIT 许可证，详情请参阅 [`LICENSE`](LICENSE)。
