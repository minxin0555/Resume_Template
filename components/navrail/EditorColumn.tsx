"use client";

import { useStore, type EditorSectionKey } from "@/lib/store";
import { OPTIONAL_SECTION_LABELS } from "@/lib/schema";
import { BasicInfoForm } from "@/components/form/BasicInfoForm";
import { EducationForm } from "@/components/form/EducationForm";
import { ExperienceForm } from "@/components/form/ExperienceForm";
import { ProjectForm } from "@/components/form/ProjectForm";
import { CoursesForm } from "@/components/form/CoursesForm";
import { AwardsForm } from "@/components/form/AwardsForm";
import { SkillsForm } from "@/components/form/SkillsForm";
import { StrengthsForm } from "@/components/form/StrengthsForm";
import { StylePanel } from "@/components/style-panel/StylePanel";

type SectionMeta = {
  title: string;
  subtitle: string;
  body: React.ReactNode;
};

const SECTIONS: Record<EditorSectionKey, SectionMeta> = {
  basic: {
    title: "基本信息",
    subtitle: "BASIC · 姓名、联系方式与照片",
    body: <BasicInfoForm />,
  },
  education: {
    title: OPTIONAL_SECTION_LABELS.education,
    subtitle: "EDUCATION · 学校、专业与亮点",
    body: <EducationForm />,
  },
  experience: {
    title: OPTIONAL_SECTION_LABELS.experience,
    subtitle: "EXPERIENCE · 实习与工作经历",
    body: <ExperienceForm />,
  },
  projects: {
    title: OPTIONAL_SECTION_LABELS.projects,
    subtitle: "PROJECTS · 个人或团队项目",
    body: <ProjectForm />,
  },
  courses: {
    title: OPTIONAL_SECTION_LABELS.courses,
    subtitle: "COURSES · 综合成绩与课程",
    body: <CoursesForm />,
  },
  awards: {
    title: OPTIONAL_SECTION_LABELS.awards,
    subtitle: "AWARDS · 奖项与荣誉",
    body: <AwardsForm />,
  },
  skills: {
    title: OPTIONAL_SECTION_LABELS.skills,
    subtitle: "SKILLS · 技能与工具",
    body: <SkillsForm />,
  },
  strengths: {
    title: OPTIONAL_SECTION_LABELS.strengths,
    subtitle: "STRENGTHS · 个人优势",
    body: <StrengthsForm />,
  },
  style: {
    title: "样式设置",
    subtitle: "STYLE · 字体、颜色与排版",
    body: <StylePanel />,
  },
};

export function EditorColumn() {
  const { activeSection, style, setStyle } = useStore();
  const meta = SECTIONS[activeSection];
  const isOptional =
    activeSection !== "basic" &&
    activeSection !== "style";
  const enabled = isOptional
    ? style.sections[activeSection as Exclude<EditorSectionKey, "basic" | "style">]
    : true;

  return (
    <section className="w-[420px] bg-paper-surface border-r border-paper-border flex flex-col min-h-0">
      <header className="px-4 pt-4 pb-3 border-b border-paper-border flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="m-0 text-[15px] font-medium tracking-tight text-ink">
            {meta.title}
          </h2>
          <span className="text-[11.5px] text-paper-muted font-mono">
            {meta.subtitle}
          </span>
        </div>
        {isOptional && (
          <label className="flex items-center gap-2 text-[11.5px] text-ink-soft cursor-pointer select-none">
            <span>{enabled ? "显示" : "已隐藏"}</span>
            <button
              type="button"
              aria-pressed={enabled}
              aria-label="切换板块可见"
              onClick={() =>
                setStyle({
                  sections: {
                    ...style.sections,
                    [activeSection]: !enabled,
                  },
                })
              }
              className={[
                "relative w-[30px] h-[18px] rounded-full transition-colors border-0",
                enabled ? "bg-paper-accent" : "bg-paper-border-strong",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-[2px] left-[2px] size-[14px] rounded-full bg-paper-surface shadow-sm transition-transform",
                  enabled ? "translate-x-[12px]" : "translate-x-0",
                ].join(" ")}
              />
            </button>
          </label>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 flex flex-col gap-5">
        {isOptional && !enabled && (
          <p className="text-[11px] text-paper-muted -mt-1">
            此板块已隐藏，不会出现在简历上；以下内容仍会保留。
          </p>
        )}
        <div className={isOptional && !enabled ? "opacity-60" : undefined}>
          {meta.body}
        </div>
      </div>
    </section>
  );
}
