import type { ResumeData, StyleConfig } from "./schema";
import { DEFAULT_SECTION_ORDER } from "./schema";

export const defaultStyle: StyleConfig = {
  template: "minimal",
  fontCJK: "Noto Serif SC",
  fontLatin: "Libertinus Serif",
  baseFontSize: 10,
  themeColor: "#1f4e8c",
  lineHeight: 1.4,
  paragraphSpacing: 0.5,
  bulletSpacing: 0.3,
  sectionSpacing: 0.5,
  margin: "standard",
  showPhoto: true,
  sections: {
    education: true,
    experience: true,
    projects: true,
    courses: true,
    awards: true,
    skills: true,
    strengths: true,
  },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
};

export const emptyData: ResumeData = {
  basic: {
    name: "姓名",
    contactRows: [
      [{ label: "求职意向", value: "" }],
      [
        { label: "电话", value: "" },
        { label: "邮箱", value: "" },
        { label: "微信", value: "" },
      ],
      [],
    ],
    photoDataUrl: undefined,
  },
  education: [],
  experience: [],
  projects: [],
  awards: [],
  skills: [],
  courses: {
    overall: "",
    items: [],
  },
  strengths: {
    mode: "bullets",
    bullets: [],
    paragraph: "",
  },
};

export const demoData: ResumeData = {
  basic: {
    name: "王语涵",
    contactRows: [
      [
        {
          label: "求职意向",
          value: "Java/Python 开发工程师、数据分析、AI 算法实习生",
        },
      ],
      [
        { label: "电话", value: "(+86) XXXX-XXXX-9722" },
        { label: "邮箱", value: "邮件@com" },
        { label: "微信", value: "XXXX-XXXX-6288" },
      ],
      [],
    ],
    photoDataUrl: undefined,
  },
  education: [
    {
      period: "2021.09 - 2025.06",
      school: "西安电子科技大学",
      major: "计算机科学与技术",
      degree: "本科",
      bullets: [
        {
          label: "学业成绩",
          content:
            "平均绩点 3.8，专业排名 15%，多次获得校级奖学金。如 2022 - 2023 学年获校级三等奖学金。",
        },
        {
          label: "相关课程",
          content:
            "数据结构、操作系统、计算机网络、计算机组成原理、数据库原理、软件工程、计算机网络、人工智能基础、Java 程序设计、Python 程序设计。",
        },
      ],
    },
  ],
  experience: [
    {
      period: "2023.07 - 2023.09",
      org: "字节跳动科技有限公司",
      role: "软件研发实习生",
      bullets: [
        {
          label: "参与项目",
          content: "项目目是 XX 智能办公 开发一套企业管理系统，旨在提高企业的运营效率和信息化管理水平。",
        },
        {
          label: "个人职责",
          content:
            "负责后台接口设计，系统高负载情况下性能优化，使用 Java 语言和 Spring Boot 框架完成数据的增删改查，优化 SQL 查询句切，搭建微服务数据处理组件，参与数据库优化工作行行行行行行 Web 服务的开发。",
        },
      ],
    },
    {
      period: "2022.09 - 2024.06",
      org: "西安电子科技大学计算机视觉实验室",
      role: "实验室助理",
      bullets: [
        {
          label: "工作内容",
          content:
            "协助指导老师进行日常实验室管理工作，包括整理实验结果数据、维护实验室软硬件设备，使用 Python 编写脚本对大赛参赛数据进行分析，为研究工作提供数据支持。",
        },
      ],
    },
  ],
  projects: [
    {
      period: "2023.03 - 2023.06",
      name: "【基于深度学习的口罩佩戴检测系统】",
      subtitle: "基于人工智能的面部识别系统",
      bullets: [
        {
          label: "项目描述",
          content:
            "本项目旨在利用深度学习技术对实时视频流中的面部图像进行检测，通过训练神经网络模型，对大量面部数据进行学习，实现对人脸的精准识别。",
        },
        {
          label: "个人职责",
          content:
            "负责数据收集和标注工作，以及基于互联网和公开数据集批量数据图像数据集，开发专业标注工具对数据集进行标注，使用 Python 和 TensorFlow 搭建模型并完成训练，多次调整超参数提高模型准确率，搭建精准优化模型后，部署到测试和测试，测试通过到模型的调整范 Web 服务器上，开发 Web 界面供用户上传图像进行识别，并开系统运行功能测试和性能测试。",
        },
      ],
    },
    {
      period: "2023.03 - 2023.06",
      name: "【智能垃圾分类辅助系统项目】",
      subtitle: "学校创新创业大赛项目",
      bullets: [
        {
          label: "项目描述",
          content: "利用图像识别技术，实现对垃圾种类的自动识别和分类建议，辅助用户进行准确垃圾分类。",
        },
      ],
    },
  ],
  awards: [
    "2023 年，在 [XX 省大学生计算机设计大赛] 中获得 [三等奖]。",
    '2022 年，荣获学校“优秀学生干部”称号。',
    "2022 年，[智能垃圾分类辅助系统项目名称] 在学校创新创业大赛中获得 [二等奖]。",
  ],
  skills: [
    {
      category: "编程语言",
      detail:
        "精通 Java、Python，熟悉 C/C++ 语言，能够运用多种语言进行程序开发和算法实现。",
    },
    {
      category: "开发框架",
      detail:
        "熟悉 Spring Boot，掌握 Spring MVC 及 Java Web 开发框架，熟悉 Django、Flask 等 Python Web 开发框架，具备多种主流框架进行项目开发的能力。",
    },
    {
      category: "数据库",
      detail:
        "熟悉使用 MySQL、掌握 SQL 语言进行数据库设计、查询优化和数据管理，了解 MongoDB 等非关系型数据库的基本操作。",
    },
  ],
  courses: {
    overall: "GPA 3.8 / 4.0，专业排名前 15%，连续两年获得校级奖学金。",
    items: [
      "数据结构 95，操作系统 92，计算机网络 90。",
      "数据库原理 93，软件工程 89，编译原理 88。",
      "人工智能基础 94，机器学习 91。",
    ],
  },
  strengths: {
    mode: "bullets",
    bullets: [
      "扎实的算法功底：ACM 校赛二等奖，LeetCode 累计 600+ 题，能在高强度场景下设计高效解。",
      "工程落地能力强：独立完成多个全栈项目，从需求拆解到上线运维均可覆盖。",
      "学习能力出色：可在一周内自学新框架并产出可交付成果，例如自学 Rust 完成生产级 CLI 工具。",
    ],
    paragraph:
      "具备扎实的计算机基础和良好的工程素养，能够独立完成从需求分析、架构设计到代码实现的完整链路；善于在跨团队协作中沟通推进，能快速学习陌生技术栈并在短时间内交付可用方案。",
  },
};
