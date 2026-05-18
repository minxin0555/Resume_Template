"use client";

import { cn } from "@/lib/utils";
import { useStore, type EditorSectionKey } from "@/lib/store";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  BookOpen,
  Trophy,
  Wrench,
  Sparkles,
  Palette,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_SECTION_ORDER,
  OPTIONAL_SECTION_LABELS,
  type OptionalSectionKey,
} from "@/lib/schema";

type NavItem = {
  key: EditorSectionKey;
  label: string;
  icon: LucideIcon;
};

const OPTIONAL_ICON: Record<OptionalSectionKey, LucideIcon> = {
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  courses: BookOpen,
  awards: Trophy,
  skills: Wrench,
  strengths: Sparkles,
};

const SHORT_LABEL: Record<EditorSectionKey, string> = {
  basic: "基本",
  education: "教育",
  experience: "实习",
  projects: "项目",
  courses: "课程",
  awards: "获奖",
  skills: "技能",
  strengths: "优势",
  style: "样式",
};

export function NavRail() {
  const { activeSection, setActiveSection, style } = useStore();

  const order: OptionalSectionKey[] =
    style.sectionOrder && style.sectionOrder.length > 0
      ? style.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const fixedTop: NavItem[] = [{ key: "basic", label: SHORT_LABEL.basic, icon: User }];
  const optional: NavItem[] = order.map((key) => ({
    key,
    label: SHORT_LABEL[key],
    icon: OPTIONAL_ICON[key],
  }));
  const fixedBottom: NavItem[] = [
    { key: "style", label: SHORT_LABEL.style, icon: Palette },
  ];

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = activeSection === item.key;
    const dim =
      item.key !== "basic" &&
      item.key !== "style" &&
      !style.sections[item.key as OptionalSectionKey];
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => setActiveSection(item.key)}
        title={
          item.key === "basic"
            ? "基本信息"
            : item.key === "style"
              ? "样式设置"
              : OPTIONAL_SECTION_LABELS[item.key as OptionalSectionKey]
        }
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 mx-1.5 px-1 py-2 rounded-md border border-transparent transition-colors select-none",
          "text-paper-muted hover:bg-paper-surface-2 hover:text-ink",
          active &&
            "bg-paper-surface-2 text-ink border-paper-border",
          dim && "opacity-50",
        )}
      >
        {active && <span className="navrail-active-bar" aria-hidden />}
        <Icon className="size-[18px]" strokeWidth={1.75} />
        <span className="text-[10px] leading-tight tracking-tight">{item.label}</span>
        {dim && (
          <span
            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-paper-muted-2 border-[1.5px] border-paper-surface"
            aria-hidden
          />
        )}
      </button>
    );
  };

  return (
    <nav
      aria-label="侧边导航"
      className="w-16 bg-paper-surface border-r border-paper-border flex flex-col py-2.5 gap-0.5 overflow-y-auto"
    >
      <div className="flex flex-col gap-0.5">{fixedTop.map(renderItem)}</div>

      <div className="mt-2 pt-2 mx-1.5 border-t border-paper-border" />
      <div className="flex flex-col gap-0.5">{optional.map(renderItem)}</div>

      <div className="mt-2 pt-2 mx-1.5 border-t border-paper-border" />
      <div className="flex flex-col gap-0.5">{fixedBottom.map(renderItem)}</div>
    </nav>
  );
}
