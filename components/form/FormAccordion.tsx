"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { OptionalSectionKey } from "@/lib/schema";
import { DEFAULT_SECTION_ORDER, OPTIONAL_SECTION_LABELS } from "@/lib/schema";
import { StylePanel } from "@/components/style-panel/StylePanel";
import { BasicInfoForm } from "./BasicInfoForm";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { ProjectForm } from "./ProjectForm";
import { AwardsForm } from "./AwardsForm";
import { SkillsForm } from "./SkillsForm";
import { CoursesForm } from "./CoursesForm";
import { StrengthsForm } from "./StrengthsForm";

type FixedSection = {
  value: string;
  label: string;
  component: React.ReactNode;
};

type OptionalSection = FixedSection & {
  key: OptionalSectionKey;
};

const fixedSections: FixedSection[] = [
  { value: "style", label: "样式设置", component: <StylePanel /> },
  { value: "basic", label: "基本信息", component: <BasicInfoForm /> },
];

const optionalSectionMap: Record<OptionalSectionKey, OptionalSection> = {
  education: {
    value: "education",
    key: "education",
    label: OPTIONAL_SECTION_LABELS.education,
    component: <EducationForm />,
  },
  experience: {
    value: "experience",
    key: "experience",
    label: OPTIONAL_SECTION_LABELS.experience,
    component: <ExperienceForm />,
  },
  projects: {
    value: "projects",
    key: "projects",
    label: OPTIONAL_SECTION_LABELS.projects,
    component: <ProjectForm />,
  },
  courses: {
    value: "courses",
    key: "courses",
    label: OPTIONAL_SECTION_LABELS.courses,
    component: <CoursesForm />,
  },
  awards: {
    value: "awards",
    key: "awards",
    label: OPTIONAL_SECTION_LABELS.awards,
    component: <AwardsForm />,
  },
  skills: {
    value: "skills",
    key: "skills",
    label: OPTIONAL_SECTION_LABELS.skills,
    component: <SkillsForm />,
  },
  strengths: {
    value: "strengths",
    key: "strengths",
    label: OPTIONAL_SECTION_LABELS.strengths,
    component: <StrengthsForm />,
  },
};

function OptionalSectionItem({ section }: { section: OptionalSection }) {
  const { style, setStyle } = useStore();
  const enabled = style.sections[section.key];

  return (
    <AccordionItem value={section.value}>
      <AccordionPrimitive.Header className="flex items-center">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group/accordion-trigger relative flex flex-1 items-center justify-between rounded-lg border border-transparent px-4 py-3 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            !enabled && "text-muted-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            {section.label}
            {!enabled && (
              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-normal text-gray-600">
                已隐藏
              </span>
            )}
          </span>
          <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:hidden"
          />
          <ChevronUpIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none ml-auto hidden size-4 shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:inline"
          />
        </AccordionPrimitive.Trigger>
        <Switch
          checked={enabled}
          onCheckedChange={(v) =>
            setStyle({
              sections: { ...style.sections, [section.key]: v },
            })
          }
          onClick={(e) => e.stopPropagation()}
          aria-label={`显示${section.label}`}
          className="mr-3 ml-2 shrink-0"
        />
      </AccordionPrimitive.Header>
      <AccordionContent className="px-4 pb-4">
        {!enabled && (
          <p className="mb-2 text-[11px] text-gray-500">
            此板块已隐藏，不会出现在简历上；以下内容仍会保留。
          </p>
        )}
        <div className={cn(!enabled && "opacity-60")}>{section.component}</div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function FormAccordion() {
  const order = useStore((s) => s.style.sectionOrder);
  const seen = new Set<OptionalSectionKey>();
  const orderedSections: OptionalSection[] = [];
  for (const key of order ?? DEFAULT_SECTION_ORDER) {
    const entry = optionalSectionMap[key];
    if (entry && !seen.has(key)) {
      seen.add(key);
      orderedSections.push(entry);
    }
  }
  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) orderedSections.push(optionalSectionMap[key]);
  }

  return (
    <Accordion defaultValue={["basic"]} className="w-full">
      {fixedSections.map((s) => (
        <AccordionItem key={s.value} value={s.value}>
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            {s.label}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {s.component}
          </AccordionContent>
        </AccordionItem>
      ))}
      {orderedSections.map((s) => (
        <OptionalSectionItem key={s.value} section={s} />
      ))}
    </Accordion>
  );
}

