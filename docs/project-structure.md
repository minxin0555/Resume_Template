# 项目目录说明

本项目是一个基于 Next.js App Router 的在线中文简历生成器。业务代码按运行入口、界面组件、渲染逻辑和静态资源分层。

```text
.
├── app/                    # Next.js App Router 页面、布局和全局样式
├── components/             # 页面组件和可复用 UI
│   ├── form/               # 简历内容表单
│   ├── preview/            # PDF 预览区域
│   ├── style-panel/        # 样式配置面板
│   ├── topbar/             # 顶部操作栏
│   └── ui/                 # 基础 UI 组件
├── lib/                    # 业务模型、状态、工具函数
│   └── typst/              # Typst 模板、编译器初始化和 PDF 渲染
├── public/                 # 静态资源和 Typst WASM 文件
├── docs/                   # 项目文档
├── AGENTS.md               # Codex/Agent 项目约束
├── CLAUDE.md               # Claude 入口提示
└── package.json            # 脚本与依赖
```

## 目录约定

- `app/` 只放路由入口、布局、全局样式和与框架强相关的文件。
- `components/form/` 按简历板块拆分表单，通用数组/列表控件放在 `components/form/shared/`。
- `components/ui/` 只放无业务语义的基础控件。
- `lib/schema.ts` 定义简历数据结构、样式结构和板块枚举。
- `lib/store.ts` 管理客户端状态和本地持久化迁移。
- `lib/typst/` 封装 Typst 编译、模板拼装、图片映射和 PDF 输出。
- `public/typst_ts_web_compiler_bg.wasm` 是浏览器端 Typst 编译必需资源。

## 不应提交的内容

以下内容属于本地依赖、构建产物或机器状态，已在项目 `.gitignore` 中忽略：

- `node_modules/`
- `.next/`
- `*.tsbuildinfo`
- `.DS_Store`
- `.env*.local`
- `.claude/settings.local.json`
