# 在线简历生成器

一个基于 Next.js 16、React 19 和 Typst 的中文简历生成器。用户可以在浏览器中编辑简历内容、调整排版样式、实时预览 PDF，并下载最终简历。

## 功能概览

- 简历内容编辑：基本信息、教育背景、实习经历、项目经历、课程成绩、获奖情况、技能特长、个人优势。
- 样式配置：中文/西文字体、基础字号、主题色、行距、段距、列表间距、板块间距、页边距、照片显示。
- 板块控制：可隐藏可选板块，也可以拖动调整板块顺序。
- PDF 预览：浏览器端通过 Typst WASM 编译 PDF，支持实时预览和手动刷新。
- 本地草稿：使用 Zustand 持久化草稿和样式设置。
- PDF 下载：按姓名生成文件名并下载当前预览结果。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- Zod
- Typst / `@myriaddreamin/typst.ts`
- Base UI、lucide-react、react-colorful

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

生产构建：

```bash
npm run build
```

启动生产服务：

```bash
npm run start
```

代码检查：

```bash
npm run lint
```

## 目录结构

```text
.
├── app/                    # Next.js 页面、布局和全局样式
├── components/             # 表单、预览、顶部栏、样式面板和基础 UI
├── lib/                    # 数据结构、默认数据、状态管理和 Typst 渲染逻辑
├── public/                 # 静态资源和 Typst WASM 文件
├── docs/                   # 项目文档
├── package.json            # 项目脚本与依赖
└── README.md               # 项目说明
```

更详细的目录约定见 [docs/project-structure.md](docs/project-structure.md)。

## 核心文件

- `app/page.tsx`：应用首页入口，渲染简历编辑器布局。
- `components/EditorLayout.tsx`：左侧表单和右侧 PDF 预览的主布局。
- `components/form/FormAccordion.tsx`：简历各板块表单入口和板块显示开关。
- `components/style-panel/StylePanel.tsx`：排版样式与板块顺序配置。
- `components/preview/PdfPreview.tsx`：PDF 编译、预览、错误展示和下载入口。
- `lib/schema.ts`：简历数据、样式配置和板块枚举。
- `lib/store.ts`：客户端状态、草稿持久化和旧数据迁移。
- `lib/typst/`：Typst 模板、编译器初始化和 PDF 渲染。

## 开发说明

- 项目使用浏览器端 Typst 编译，首次预览需要加载 WASM 和字体资源，可能耗时 10-30 秒。
- 中文字体通过远程 OTF 资源加载；如果预览一直失败，优先检查网络和浏览器控制台。
- `public/typst_ts_web_compiler_bg.wasm` 是 PDF 编译必需文件，不要删除。
- `node_modules/`、`.next/`、`*.tsbuildinfo`、`.DS_Store` 等本地文件已通过 `.gitignore` 忽略。
- 本项目使用 Next.js 16。修改 Next.js 相关代码前，应先查看 `node_modules/next/dist/docs/` 中对应版本文档。
