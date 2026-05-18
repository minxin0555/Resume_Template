"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ContactRow,
  OptionalSectionKey,
  ResumeData,
  StyleConfig,
} from "./schema";
import {
  CONTACT_ROW_COUNT,
  DEFAULT_SECTION_ORDER,
  OPTIONAL_SECTION_KEYS,
} from "./schema";
import { demoData, defaultStyle } from "./defaults";

type PartialStyle = Partial<StyleConfig> & {
  sections?: Partial<StyleConfig["sections"]>;
};

export type EditorSectionKey = "basic" | OptionalSectionKey | "style";

type CompileStatus = {
  compiling: boolean;
  elapsedMs: number;
  lastUpdated?: string;
  error?: string;
};

type Store = {
  data: ResumeData;
  style: StyleConfig;
  livePreview: boolean;
  pendingChange: number;
  activeSection: EditorSectionKey;
  compile: CompileStatus;
  setData: (data: ResumeData) => void;
  patchBasic: (patch: Partial<ResumeData["basic"]>) => void;
  setStyle: (patch: Partial<StyleConfig>) => void;
  toggleLive: () => void;
  bumpManual: () => void;
  loadDemo: () => void;
  resetStyle: () => void;
  setActiveSection: (key: EditorSectionKey) => void;
  setCompile: (patch: Partial<CompileStatus>) => void;
};

type LegacyBasic = {
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  photoDataUrl?: string;
  contactRows?: ContactRow[];
};

function sanitizeSectionOrder(raw: unknown): OptionalSectionKey[] {
  const valid = new Set<OptionalSectionKey>(OPTIONAL_SECTION_KEYS);
  const seen = new Set<OptionalSectionKey>();
  const result: OptionalSectionKey[] = [];
  if (Array.isArray(raw)) {
    for (const k of raw) {
      if (typeof k === "string" && valid.has(k as OptionalSectionKey)) {
        const key = k as OptionalSectionKey;
        if (!seen.has(key)) {
          seen.add(key);
          result.push(key);
        }
      }
    }
  }
  for (const k of DEFAULT_SECTION_ORDER) {
    if (!seen.has(k)) result.push(k);
  }
  return result;
}

function migrateBasic(basic: LegacyBasic): ResumeData["basic"] {
  if (Array.isArray(basic.contactRows)) {
    const rows = basic.contactRows.slice(0, CONTACT_ROW_COUNT);
    while (rows.length < CONTACT_ROW_COUNT) rows.push([]);
    return {
      name: basic.name ?? "姓名",
      contactRows: rows,
      photoDataUrl: basic.photoDataUrl,
    };
  }
  const row2: ContactRow = [];
  if (basic.phone) row2.push({ label: "电话", value: basic.phone });
  if (basic.email) row2.push({ label: "邮箱", value: basic.email });
  if (basic.wechat) row2.push({ label: "微信", value: basic.wechat });
  return {
    name: basic.name ?? "姓名",
    contactRows: [
      basic.title ? [{ label: "求职意向", value: basic.title }] : [],
      row2,
      [],
    ],
    photoDataUrl: basic.photoDataUrl,
  };
}

const EDITOR_SECTIONS = new Set<EditorSectionKey>([
  "basic",
  "style",
  ...OPTIONAL_SECTION_KEYS,
]);

function sanitizeActive(raw: unknown): EditorSectionKey {
  if (typeof raw === "string" && EDITOR_SECTIONS.has(raw as EditorSectionKey)) {
    return raw as EditorSectionKey;
  }
  return "basic";
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      data: demoData,
      style: defaultStyle,
      livePreview: true,
      pendingChange: 0,
      activeSection: "basic",
      compile: { compiling: false, elapsedMs: 0 },
      setData: (data) =>
        set((s) => ({ data, pendingChange: s.pendingChange + 1 })),
      patchBasic: (patch) =>
        set((s) => ({
          data: { ...s.data, basic: { ...s.data.basic, ...patch } },
          pendingChange: s.pendingChange + 1,
        })),
      setStyle: (patch) =>
        set((s) => ({
          style: { ...s.style, ...patch },
          pendingChange: s.pendingChange + 1,
        })),
      toggleLive: () => set((s) => ({ livePreview: !s.livePreview })),
      bumpManual: () => set((s) => ({ pendingChange: s.pendingChange + 1 })),
      loadDemo: () =>
        set((s) => ({ data: demoData, pendingChange: s.pendingChange + 1 })),
      resetStyle: () =>
        set((s) => ({
          style: defaultStyle,
          pendingChange: s.pendingChange + 1,
        })),
      setActiveSection: (activeSection) => set({ activeSection }),
      setCompile: (patch) =>
        set((s) => ({ compile: { ...s.compile, ...patch } })),
    }),
    {
      name: "resume-draft-v2",
      version: 7,
      partialize: (state) => ({
        data: state.data,
        style: state.style,
        livePreview: state.livePreview,
        activeSection: state.activeSection,
      }),
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<Store> & {
          data?: Partial<ResumeData> & { basic?: LegacyBasic };
          style?: PartialStyle & { sectionOrder?: unknown };
          activeSection?: unknown;
        };
        if (state.data?.basic) {
          state.data = {
            ...state.data,
            basic: migrateBasic(state.data.basic),
          };
        }
        if (state.data) {
          state.data = {
            ...(state.data as ResumeData),
            courses: state.data.courses ?? {
              overall: "",
              items: [],
            },
            strengths: state.data.strengths ?? {
              mode: "bullets",
              bullets: [],
              paragraph: "",
            },
          };
        }
        const rawOrder = state.style?.sectionOrder;
        const sanitizedOrder = sanitizeSectionOrder(rawOrder);
        state.style = {
          ...defaultStyle,
          ...(state.style ?? {}),
          sections: {
            ...defaultStyle.sections,
            ...(state.style?.sections ?? {}),
          },
          sectionOrder: sanitizedOrder,
        };
        state.activeSection = sanitizeActive(state.activeSection);
        return state as Store;
      },
    },
  ),
);
