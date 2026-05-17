import { z } from "zod";

export const BulletSchema = z.object({
  label: z.string(),
  content: z.string(),
});

export const ContactItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const CONTACT_ROW_COUNT = 3;

export const ResumeSchema = z.object({
  basic: z.object({
    name: z.string().min(1),
    contactRows: z.array(z.array(ContactItemSchema)).length(CONTACT_ROW_COUNT),
    photoDataUrl: z.string().optional(),
  }),
  education: z.array(
    z.object({
      period: z.string(),
      school: z.string(),
      major: z.string(),
      degree: z.string(),
      bullets: z.array(BulletSchema),
    })
  ),
  experience: z.array(
    z.object({
      period: z.string(),
      org: z.string(),
      role: z.string(),
      bullets: z.array(BulletSchema),
    })
  ),
  projects: z.array(
    z.object({
      period: z.string(),
      name: z.string(),
      subtitle: z.string().optional(),
      bullets: z.array(BulletSchema),
    })
  ),
  awards: z.array(z.string()),
  skills: z.array(
    z.object({
      category: z.string(),
      detail: z.string(),
    })
  ),
  courses: z.object({
    overall: z.string().default(""),
    items: z.array(z.string()).default([]),
  }),
  strengths: z.object({
    mode: z.enum(["bullets", "paragraph"]).default("bullets"),
    bullets: z.array(z.string()).default([]),
    paragraph: z.string().default(""),
  }),
});

export const OPTIONAL_SECTION_KEYS = [
  "education",
  "experience",
  "projects",
  "courses",
  "awards",
  "skills",
  "strengths",
] as const;

export type OptionalSectionKey = (typeof OPTIONAL_SECTION_KEYS)[number];

export const OPTIONAL_SECTION_LABELS: Record<OptionalSectionKey, string> = {
  education: "教育背景",
  experience: "实习经历",
  projects: "项目经历",
  courses: "课程成绩",
  awards: "获奖情况",
  skills: "技能特长",
  strengths: "个人优势",
};

export const DEFAULT_SECTION_ORDER: OptionalSectionKey[] = [
  "education",
  "experience",
  "projects",
  "courses",
  "awards",
  "skills",
  "strengths",
];

export const SectionVisibilitySchema = z.object({
  education: z.boolean().default(true),
  experience: z.boolean().default(true),
  projects: z.boolean().default(true),
  courses: z.boolean().default(true),
  awards: z.boolean().default(true),
  skills: z.boolean().default(true),
  strengths: z.boolean().default(true),
});

export const SectionOrderSchema = z
  .array(z.enum(OPTIONAL_SECTION_KEYS))
  .default(DEFAULT_SECTION_ORDER);

export const StyleSchema = z.object({
  fontCJK: z
    .enum(["Noto Serif SC"])
    .catch("Noto Serif SC")
    .default("Noto Serif SC"),
  fontLatin: z
    .enum(["Libertinus Serif"])
    .catch("Libertinus Serif")
    .default("Libertinus Serif"),
  baseFontSize: z.number().min(8).max(12).default(10),
  themeColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .default("#1f4e8c"),
  lineHeight: z.number().min(1.1).max(1.8).default(1.4),
  paragraphSpacing: z.number().min(0.2).max(1.2).default(0.5),
  bulletSpacing: z.number().min(0.1).max(1.0).default(0.3),
  sectionSpacing: z.number().min(0.3).max(2.0).default(0.5),
  margin: z.enum(["compact", "standard", "loose"]).default("standard"),
  showPhoto: z.boolean().default(true),
  sections: SectionVisibilitySchema.default({
    education: true,
    experience: true,
    projects: true,
    courses: true,
    awards: true,
    skills: true,
    strengths: true,
  }),
  sectionOrder: SectionOrderSchema,
});

export type ResumeData = z.infer<typeof ResumeSchema>;
export type StyleConfig = z.infer<typeof StyleSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type ContactItem = z.infer<typeof ContactItemSchema>;
export type ContactRow = ContactItem[];
