# 部署到 Vercel —— 一键托管指南

本文档介绍如何把本项目（Next.js 16 在线简历生成器）部署到 [Vercel](https://vercel.com)，让你**不用自己买服务器、不用配 Nginx、不用申请证书**，几分钟就有一个 `https://xxx.vercel.app/` 域名可以远程访问。

> **为什么选 Vercel**：Vercel 是 Next.js 的官方亲爹，零配置部署、自动 HTTPS、全球 CDN、Git 推送自动重新部署、个人项目永久免费。本项目纯前端渲染（PDF 在浏览器里用 Typst WASM 编译，没有后端 / 数据库 / 鉴权），用 Vercel 几乎是 0 成本最优解。

---

## 0. 准备工作

- 一个 **GitHub / GitLab / Bitbucket** 账号（Vercel 通过 Git 仓库部署，推荐 GitHub）。
- 把本项目推送到一个 Git 仓库（公开 / 私有都可以，Vercel 都支持）。
- 一个 **Vercel 账号**：https://vercel.com/signup ，直接用 GitHub 一键登录最省事。

---

## 1. 把项目推到 GitHub

如果项目还没在 GitHub 上：

```bash
# 在项目根目录
cd /Users/minixin/Desktop/code/AI_coding/Resume_Template

# 如果还没初始化 git
git init
git add .
git commit -m "init"

# 到 GitHub 新建一个空仓库（不要勾 README / .gitignore），拿到仓库地址
git remote add origin https://github.com/<你的用户名>/resume-template.git
git branch -M main
git push -u origin main
```

> `node_modules/`、`.next/`、`*.tsbuildinfo` 已经在项目 `.gitignore` 里，不会被推上去，放心。

---

## 2. 在 Vercel 导入项目

### 2.1 登录并新建项目

1. 打开 https://vercel.com/new
2. 用 GitHub 登录，第一次会让你授权 Vercel 访问仓库（可以选「All repositories」全开，或「Only select repositories」只授权 `resume-template` 一个）。
3. 在列表里找到 `resume-template`，点右边的 **Import**。

### 2.2 项目配置

Vercel 会自动识别为 Next.js 项目，**所有默认值都不用改**：

| 字段 | 值 | 说明 |
|------|-----|------|
| Framework Preset | `Next.js` | 自动识别 |
| Root Directory | `./` | 项目就在仓库根目录 |
| Build Command | `next build` | 默认 |
| Output Directory | `.next` | 默认 |
| Install Command | `npm install` | 默认 |
| Node.js Version | `20.x` 或更高 | 默认即可（Next.js 16 要求 ≥ 20） |

**Environment Variables**（环境变量）：本项目当前不需要任何环境变量，留空即可。

点 **Deploy**。

### 2.3 等待首次构建

首次构建大约 **2-4 分钟**（装依赖 + Next.js 构建 + 全球 CDN 分发）。完成后会跳到一个庆祝页，给你一个域名：

```
https://resume-template-<随机串>.vercel.app
```

点开就是部署好的简历生成器，可以从任何地方访问。

---

## 3. 绑定自定义域名（可选）

如果你想用自己的域名（比如 `resume.example.com`）替代 `xxx.vercel.app`：

### 3.1 在 Vercel 添加域名

1. 进项目 → **Settings** → **Domains**
2. 输入你要绑定的域名，比如 `resume.example.com`，点 **Add**
3. Vercel 会显示需要添加的 DNS 记录

### 3.2 在域名服务商配置 DNS

到你的域名服务商（Cloudflare / 阿里云 / 腾讯云 / Namecheap 等）后台：

**绑定子域名**（推荐，例如 `resume.example.com`）：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| CNAME | `resume` | `cname.vercel-dns.com` |

**绑定裸域名**（`example.com`）：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | `@` | `76.76.21.21` |

> 实际值以 Vercel 控制台显示的为准，可能会调整。

DNS 生效通常 1-10 分钟，Vercel 会自动检测并**自动申请 Let's Encrypt 证书**，全程零操作。完成后 `https://resume.example.com/` 自带小绿锁。

> **Cloudflare 用户特别注意**：如果用 Cloudflare 做 DNS，添加 CNAME 时**关闭橙色云朵**（设为「Proxied」会变成「DNS only」灰色云朵）。否则会和 Vercel 的 CDN 冲突，证书签发也会失败。

---

## 4. 持续部署 —— 推代码自动上线

Vercel 的杀手锏：**Git 推送 = 自动部署**。

- 推到 **main 分支** → 自动构建并发布到生产域名（`resume.example.com`）。
- 推到**其他分支**或开 PR → 自动构建一个 **Preview 域名**（如 `resume-template-git-feat-xxx.vercel.app`），用于预览未合并的改动，不影响生产。
- 每次部署都有独立 URL 永久保留，方便回滚和对比。

**日常更新流程就是一行 `git push`**：

```bash
git add .
git commit -m "tweak: 调整字号"
git push
# 30 秒后 Vercel 自动部署完，生产域名已是新版本
```

---

## 5. 回滚到旧版本

万一新版本翻车了：

1. 进项目 → **Deployments**
2. 找到上一个正常的部署版本，点右边的 **⋯** → **Promote to Production**
3. 30 秒内生产域名切回旧版本，零停机

比自己改服务器爽太多。

---

## 6. 查看日志和构建状态

- **构建日志**：Deployments → 点某次部署 → **Build Logs**，能看到 `npm install` 和 `next build` 的完整输出。
- **运行时日志**：Deployments → 某次部署 → **Runtime Logs**（本项目纯前端渲染，几乎不会有运行时日志）。
- **分析数据**：项目 → **Analytics**（免费版有基础访问统计）。

---

## 7. 免费额度和限制

Vercel 免费版（Hobby plan）对个人项目足够用：

| 项目 | 免费额度 | 本项目实际占用 |
|------|----------|----------------|
| 带宽 | 100 GB / 月 | 单次访问约 5-10MB（含 WASM 和字体），按 1000 人/月算约 10 GB |
| 构建时长 | 6000 分钟 / 月 | 单次构建约 2-3 分钟 |
| 部署次数 | 无限 | 随便推 |
| 自定义域名 | 无限 | 免费送 HTTPS |
| 团队成员 | 仅本人 | 个人简历项目够用 |

**唯一硬限制**：免费版**禁止商业用途**。如果你只是放自己的简历或个人作品集，完全没问题；如果给客户做服务收钱，需要升级到 Pro（$20/月）。

---

## 8. 本项目部署特别说明

由于本项目用浏览器端 Typst WASM 编译 PDF，部署到 Vercel 时有几个点要注意：

1. **WASM 文件能正常分发**：`public/typst_ts_web_compiler_bg.wasm` 等文件在 Vercel 是作为静态资源直接走 CDN 的，无需任何配置。
2. **首次预览较慢是正常的**：用户首次打开页面要下载几 MB WASM + 中文字体（约 10-30 秒），这是客户端行为，与 Vercel 无关。后续访问会走浏览器缓存。
3. **不需要任何环境变量**：项目无后端、无数据库、无第三方 API key，Vercel 上 Environment Variables 完全留空。
4. **不需要 `vercel.json`**：默认配置完美适配 Next.js 16，不用额外写部署配置文件。
5. **服务端区域不重要**：本项目几乎所有逻辑在客户端跑，Vercel Functions 区域随便选默认即可。

---

## 9. 常见问题

### Q1：部署失败，构建日志报错 `Module not found` 或 TypeScript 报错

本地能 build 但 Vercel 不行？常见原因：

- 文件名大小写：macOS 文件系统不区分大小写，Linux（Vercel）区分。检查 import 路径里的大小写是否和实际文件名完全一致。
- 漏推了文件：本地有但忘了 `git add`。`git status` 看看。
- Node 版本不一致：Vercel 默认 Node 20，本地若用了 22 的新语法可能挂。在项目 `package.json` 里指定：
  ```json
  {
    "engines": {
      "node": ">=20.0.0"
    }
  }
  ```

### Q2：网站打开后 PDF 预览不出来

打开浏览器 DevTools → Console，看报错：

- WASM 文件 404 → 检查 `public/` 下文件是否被 git 跟踪（默认 `.gitignore` 不会忽略 `public/`，但仔细确认）。
- 字体加载失败 → 字体走的是远端 CDN，国内访问可能不稳，与 Vercel 无关。
- 与 Vercel 部署本身无关的问题，本地复现一下能更快定位。

### Q3：自定义域名一直显示「Invalid Configuration」

- DNS 记录没生效：等 10 分钟，或用 `dig +short resume.example.com` 验证。
- Cloudflare 没关橙色云朵：见第 3.2 节注意事项。
- CNAME 写错：必须是 `cname.vercel-dns.com`（不是 `vercel.com` 或别的）。

### Q4：能不能用 Vercel CLI 部署而不是连 Git？

可以，但不推荐。CLI 方式失去了「Git 推送自动部署」「Preview 部署」「回滚」等核心优势。如果一定要用：

```bash
npm install -g vercel
cd /Users/minixin/Desktop/code/AI_coding/Resume_Template
vercel              # 首次会引导登录和配置
vercel --prod       # 直接发布到生产
```

### Q5：想关掉某次自动部署

进 **Settings** → **Git** → 关掉 **Auto Deploy** 即可。也可以只对某些分支启用自动部署。

---

## 10. 部署完成自检清单

- [ ] GitHub 仓库代码是最新版本
- [ ] Vercel Dashboard 显示最近一次 Deployment 状态为 **Ready**（绿点）
- [ ] 默认 `*.vercel.app` 域名能打开页面
- [ ] 自定义域名（如绑定）能打开页面，地址栏小绿锁
- [ ] PDF 预览能正常生成、下载
- [ ] `git push` 后 1-2 分钟内 Dashboard 自动出现新的部署

全部打勾即部署完成。

---

## 对比：Vercel vs 自建 VPS

| 维度 | Vercel | 自建 VPS（见 `deployment.md`） |
|------|--------|-------------------------------|
| 上手难度 | ⭐ 5 分钟 | ⭐⭐⭐⭐ 1-2 小时 |
| 服务器费用 | 免费（个人用） | 几十到几百元/月 |
| HTTPS 证书 | 自动 | 手动 Certbot |
| CDN 加速 | 自带全球 CDN | 需自配 Cloudflare 等 |
| 自动部署 | Git 推送即部署 | 自己写脚本或 CI |
| 回滚 | 一键 | 手动 git revert + 重新部署 |
| 可控性 | 受平台限制 | 完全自主 |
| 商业用途 | 需付费升级 | 无限制 |
| 国内访问速度 | 一般（境外节点） | 国内 VPS 快 |

**结论**：
- **个人简历 / 作品集 / 演示项目** → 闭眼选 Vercel。
- **国内访问为主、需要长期商业化、要接后端 / 数据库** → 选 VPS（见 `docs/deployment.md`）。
