# 开发与维护指南

本文面向 dsh-cloudq 的开发者与维护者，覆盖环境准备、日常开发、调试、测试、发版与社区收录更新的完整流程。

## 目录

- [仓库结构](#仓库结构)
- [环境准备](#环境准备)
- [日常开发](#日常开发)
- [调试](#调试)
- [测试](#测试)
- [发布新版本（npm）](#发布新版本npm)
- [更新社区收录（awesome-dsh-plugin）](#更新社区收录awesome-dsh-plugin)
- [常见问题](#常见问题)

## 仓库结构

```text
src/
  index.js            # Host 端：Cordis 插件入口，注册 Skill、设置命名空间与 /api/dsh-cloudq/* 路由
  client/index.js     # Web 客户端：输入栏入口、能力面板、设置卡片、插件管理卡片（无构建期 JSX，直接写 DOM/Compiled JSX 调用）
  http.js             # 本机 HTTP 安全工具：回环/同源校验、64KiB 请求体上限、稳定错误信封
  script-runner.js    # Python 辅助脚本执行器：stdin 传密钥、输出上限、错误脱敏
  plugin-manager.js   # Profile 插件枚举与 cordis.patch.yml 原子启停写入
skills/cloudq/        # 内置 CloudQ Skill（SKILL.md + Python 脚本 + API 参考文档）
assets/cloudq.png     # Host 通过 /api/dsh-cloudq/logo.png 提供的运行时图标
assets/screenshots/   # 插件市场展示截图（由 screenshots.json 声明）
scripts/              # 构建、类型复制、客户端契约与密钥扫描脚本
tests/                # Vitest 单元/集成/契约测试
cordis.patch.yml      # DSH bundle 挂载层（ui-dsh-cloudq → dsh-cloudq）
```

关键约束：

- `package.json` 同时声明 `dsh.bundle.patch`（Host）和 `dsh.client`（Web 客户端），两者缺一不可。
- 客户端产物 `lib/client.js` 是 DSH ModuleLoader 的 lazy-CJS factory，由 `tsdown.config.ts` 构建，`scripts/check-client-bundle.mjs` 校验单次注册、无 ESM import、无调试残留。
- Host 产物 `lib/index.js` 为 ESM；`tsdown` 配置里 `fixedExtension: false` 保证输出 `.js` 后缀。

## 环境准备

```bash
git clone https://github.com/TencentCloud/cloudq-for-dsh.git
cd cloudq-for-dsh
corepack enable && corepack prepare pnpm@11.7.0 --activate
pnpm install
```

要求：Node.js >= 22.19.0、Python 3（`python3` 可执行）、DSH CLI（`npm i -g @deepseek-ai/dsh` 或使用 `npx @deepseek-ai/dsh`）。

`.npmrc` 已锁定官方 registry；`pnpm-workspace.yaml` 中 `allowBuilds` 全部置 `false`（本仓库不依赖任何依赖的构建脚本，请勿打开）。

## 日常开发

```bash
pnpm run lint          # ESLint
pnpm run typecheck     # tsc --noEmit（checkJs，对 src 做类型检查）
pnpm run test          # 全部 Vitest 测试
pnpm run test:unit     # tests/unit（HTTP 安全、子进程、插件管理）
pnpm run test:integration  # tests/integration（Host 生命周期）
pnpm run test:contract # tests/contract（包契约：manifest/入口/资源/安全约束）
pnpm run test:python   # skills/cloudq/tests（Python 凭证 stdin 回归）
pnpm run build         # 清理并重建 lib/（Host + Client + 类型）
pnpm run check:client  # 校验 lib/client.js 的 ModuleLoader 契约
```

典型改动路径：

- **改 Host 路由/凭证逻辑**：`src/index.js` → `pnpm run test` → `pnpm run build`。
- **改界面**：`src/client/index.js`（样式在同文件的 `installStyles` 模板字符串中）→ `pnpm run build` → 在 DSH 中验证。
- **改 Skill 行为**：`skills/cloudq/SKILL.md` 或 `scripts/*.py` → `pnpm run test:python`。

## 调试

### 在干净隔离环境中调试（推荐）

不污染日常使用的 `~/.dsh`：

```bash
# 1. 打包（产物进 lib/，生成 tgz）
npm pack --registry=https://registry.npmjs.org/

# 2. 用独立 DSH_HOME 安装并启动
export DSH_HOME=/tmp/dsh-cloudq-dev
dsh plugin --profile web add /绝对路径/cloudq-for-dsh/dsh-cloudq-<版本>.tgz
dsh --profile web
```

要点：

- **安装/卸载/换包后必须重启 `dsh --profile web`**：bundle 只在启动时加载，页面刷新不会加载新插件。
- 若端口被占用（`EADDRINUSE 3080`），先找到并结束旧进程：`lsof -nP -iTCP:3080 -sTCP:LISTEN`。
- 注意 pnpm 的 `minimumReleaseAge` 策略：刚发布的 npm 版本在短期内不会被裸包名解析到，调试时用 tarball 路径或显式版本号。

### 浏览器侧调试

用 Chrome 远程调试配合 DevTools MCP 或直接 DevTools：

```bash
# 带调试端口启动 Chrome（项目内提供脚本）
# 然后访问 http://127.0.0.1:3080，用 evaluate_script 检查：
# document.querySelector('.dsh-cloudq-settings-card') 等节点与布局
```

常用自检：

```bash
curl -s http://127.0.0.1:3080/api/dsh-cloudq/credential        # Host 凭证状态
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3080/plugins/dsh-cloudq/client.js  # 客户端 bundle
```

### Host 侧调试

- 插件日志在 `dsh --profile web` 的终端输出中；启动失败会带 `failed to apply loader entry ui-dsh-cloudq` 的完整 cause 链。
- Host 对子进程错误做了脱敏（固定返回稳定错误码），排查真实原因时直接手动跑脚本：
  `python3 skills/cloudq/scripts/login.py --status`

## 测试

CI 与本地共用同一组门禁，提交前至少跑：

```bash
pnpm run lint && pnpm run typecheck && pnpm run test:all && pnpm run build && pnpm run check:client
```

- 新增功能必须带测试：HTTP/子进程逻辑进 `tests/unit`，Cordis 生命周期进 `tests/integration`，发布约束进 `tests/contract`。
- `npm pack` / `npm publish` 会自动执行 `prepack`（契约测试 + 密钥扫描）与 `prepare`（构建 + 客户端校验），无需手工干预。

## 发布新版本（npm）

1. **完成改动并更新文档**：`CHANGELOG.md` 增加对应版本小节；`README.md` 同步用户可见变化。
2. **升版本**：`package.json` 的 `version` 与 `tests/contract/package-contract.test.js` 中的版本断言必须同时修改（语义化版本：修复用 patch，功能用 minor）。
3. **验证**：跑上面的完整门禁；再用隔离 DSH_HOME 从 tarball 安装并启动一次，确认真实可用。
4. **提交并推送**：

   ```bash
   git add -A && git commit -m "Release 0.x.y"
   git push origin main
   ```

   等 GitHub CI 变绿（含 tarball 解包安装验证）。

5. **发布**（需要 npm 发布权限 + 满足 2FA 的 Token）：

   ```bash
   npm publish --registry=https://registry.npmjs.org/ --access public
   ```

6. **发布后验证**：

   ```bash
   npm view dsh-cloudq version --registry=https://registry.npmjs.org/
   # 全新环境安装验证（注意 minimumReleaseAge，刚发布时可显式指定版本）
   DSH_HOME=/tmp/dsh-verify dsh plugin --profile web add dsh-cloudq@<新版本>
   ```

## 更新社区收录（awesome-dsh-plugin）

插件已收录于 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，条目为 `data/plugins/TencentCloud__cloudq-for-dsh.yml`。

- **更新描述/分类**：Fork 社区仓库，只改这一个 yml 文件后提 PR（README 由脚本生成，禁止手改；描述含 `": "` 必须加引号）。
- **换截图**：只需把新图推到自己仓库并更新 `screenshots.json`，社区侧无需 PR，下一次构建自动生效。
- **npm 关联**：自动从 registry 采集，前提是 `package.json` 的 `repository` 字段始终指向 `TencentCloud/cloudq-for-dsh`。
- 规则细节见社区 `contributing.md`（仓库年龄/提交数门槛、PR 最多 3 条、评审标准等）。

## 常见问题

**装完插件页面没有变化？**
bundle 只在启动时加载。安装/更新/卸载后重启 `dsh --profile web`。

**启动报 `EADDRINUSE 127.0.0.1:3080`？**
有旧实例占用端口：`lsof -nP -iTCP:3080 -sTCP:LISTEN` 找到 PID 后结束它。

**刚发布的新版本装不上、装到旧版？**
pnpm 的 `minimumReleaseAge` 会暂时排除刚发布的版本。显式指定版本（`dsh-cloudq@x.y.z`）即可安装；或等版本度过时间窗。

**CI 里 `npm pack --json` 解析失败？**
生命周期脚本会往 stdout 写日志，CI 用 `tar -tzf` 检查包内容而不是解析 JSON（见 `.github/workflows/ci.yml`）。
