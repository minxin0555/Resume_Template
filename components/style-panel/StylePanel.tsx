"use client";

import { useStore } from "@/lib/store";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { GripVertical, Check } from "lucide-react";
import {
  DEFAULT_SECTION_ORDER,
  OPTIONAL_SECTION_LABELS,
  TEMPLATE_KEYS,
  TEMPLATE_META,
  type OptionalSectionKey,
  type TemplateKey,
} from "@/lib/schema";
import {
  Field,
  Segmented,
  ToggleSwitch,
} from "@/components/form/shared/atoms";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { value: "#1f4e8c", label: "ink-blue" },
  { value: "#444444", label: "graphite" },
  { value: "#b91c1c", label: "crimson" },
  { value: "#166534", label: "forest" },
  { value: "#6b21a8", label: "amethyst" },
];

const CJK_FONTS = [
  { value: "Noto Serif SC" as const, label: "宋体 · Noto Serif SC" },
];

const LATIN_FONTS = [
  { value: "Libertinus Serif" as const, label: "Times · Libertinus Serif" },
];

const MARGINS = [
  { value: "compact" as const, label: "紧凑" },
  { value: "standard" as const, label: "标准" },
  { value: "loose" as const, label: "宽松" },
];

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-paper-border rounded-lg bg-paper-surface overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-paper-surface-2 border-b border-paper-border text-[12px] font-medium text-ink-soft">
        {title}
      </div>
      <div className="p-3 flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field
      label={label}
      hint={<span className="tabular-nums">{display}</span>}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-paper-surface-3 rounded-full outline-none appearance-none accent-paper-accent
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paper-surface [&::-webkit-slider-thumb]:border-[1.5px] [&::-webkit-slider-thumb]:border-paper-accent [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-paper-surface [&::-moz-range-thumb]:border-[1.5px] [&::-moz-range-thumb]:border-paper-accent [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
      />
    </Field>
  );
}

export function StylePanel() {
  const { style, setStyle } = useStore();
  const [showPicker, setShowPicker] = useState(false);
  const [dragKey, setDragKey] = useState<OptionalSectionKey | null>(null);
  const [overKey, setOverKey] = useState<OptionalSectionKey | null>(null);

  const sectionOrder: OptionalSectionKey[] =
    style.sectionOrder && style.sectionOrder.length > 0
      ? style.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const reorder = (from: OptionalSectionKey, to: OptionalSectionKey) => {
    if (from === to) return;
    const next = [...sectionOrder];
    const fromIdx = next.indexOf(from);
    const toIdx = next.indexOf(to);
    if (fromIdx === -1 || toIdx === -1) return;
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, from);
    setStyle({ sectionOrder: next });
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* 模板 */}
      <Card title="模板">
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATE_KEYS.map((key) => {
            const meta = TEMPLATE_META[key];
            const on = style.template === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setStyle({ template: key as TemplateKey })}
                className={cn(
                  "flex flex-col items-stretch gap-1 p-1.5 bg-paper-surface border rounded-md cursor-pointer transition-all text-left",
                  on
                    ? "border-paper-accent bg-paper-accent-soft ring-[3px] ring-paper-accent/15"
                    : "border-paper-border hover:border-paper-border-strong hover:-translate-y-px",
                )}
              >
                {key === "minimal" ? (
                  <TemplateThumbMinimal />
                ) : (
                  <TemplateThumbBanner />
                )}
                <span className="text-[12px] font-medium px-1 mt-0.5 text-ink">
                  {meta.label}
                </span>
                <span className="font-mono text-[10px] text-paper-muted px-1">
                  {meta.sub}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 字体 */}
      <Card title="字体">
        <Field label="中文字体">
          <Segmented
            value={style.fontCJK}
            onChange={(v) =>
              setStyle({ fontCJK: v as typeof style.fontCJK })
            }
            options={CJK_FONTS}
            fill
          />
        </Field>
        <Field label="西文字体">
          <Segmented
            value={style.fontLatin}
            onChange={(v) =>
              setStyle({ fontLatin: v as typeof style.fontLatin })
            }
            options={LATIN_FONTS}
            fill
          />
        </Field>
        <SliderRow
          label="基础字号"
          value={style.baseFontSize}
          min={8}
          max={12}
          step={0.5}
          display={`${style.baseFontSize} pt`}
          onChange={(v) => setStyle({ baseFontSize: v })}
        />
      </Card>

      {/* 主题色 */}
      <Card title="主题色">
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => {
            const on = style.themeColor === c.value;
            return (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setStyle({ themeColor: c.value })}
                className="relative size-[22px] rounded-md border border-paper-border cursor-pointer transition-transform hover:scale-110"
                style={{ background: c.value }}
              >
                {on && (
                  <span className="absolute -inset-[3px] rounded-[8px] border-[1.5px] border-ink pointer-events-none" />
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowPicker((p) => !p)}
            title="自定义颜色"
            className={cn(
              "size-[22px] rounded-md border border-paper-border cursor-pointer transition-transform hover:scale-110 grid place-items-center",
            )}
            style={{
              background: PRESET_COLORS.some(
                (c) => c.value === style.themeColor,
              )
                ? `linear-gradient(45deg, transparent 45%, var(--ink-soft) 45%, var(--ink-soft) 55%, transparent 55%)`
                : style.themeColor,
            }}
          >
            {!PRESET_COLORS.some((c) => c.value === style.themeColor) && (
              <Check className="size-3 text-white drop-shadow" />
            )}
          </button>
          <span className="inline-flex items-center h-[22px] px-2 border border-paper-border rounded-full font-mono text-[11px] text-paper-muted bg-paper-surface">
            {style.themeColor}
          </span>
        </div>
        {showPicker && (
          <div className="flex flex-col gap-2">
            <HexColorPicker
              color={style.themeColor}
              onChange={(c) => setStyle({ themeColor: c })}
              style={{ width: "100%" }}
            />
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="text-[11.5px] text-paper-muted hover:text-ink self-end"
            >
              关闭
            </button>
          </div>
        )}
      </Card>

      {/* 排版 */}
      <Card title="排版">
        <SliderRow
          label="行距"
          value={style.lineHeight}
          min={1.1}
          max={1.8}
          step={0.1}
          display={style.lineHeight.toFixed(1)}
          onChange={(v) => setStyle({ lineHeight: v })}
        />
        <SliderRow
          label="段距"
          value={style.paragraphSpacing}
          min={0.2}
          max={1.2}
          step={0.1}
          display={`${style.paragraphSpacing.toFixed(1)} em`}
          onChange={(v) => setStyle({ paragraphSpacing: v })}
        />
        <SliderRow
          label="列表条目间距"
          value={style.bulletSpacing}
          min={0.1}
          max={1.0}
          step={0.1}
          display={`${style.bulletSpacing.toFixed(1)} em`}
          onChange={(v) => setStyle({ bulletSpacing: v })}
        />
        <SliderRow
          label="板块间距"
          value={style.sectionSpacing}
          min={0.3}
          max={2.0}
          step={0.1}
          display={`${style.sectionSpacing.toFixed(1)} em`}
          onChange={(v) => setStyle({ sectionSpacing: v })}
        />
        <Field label="页面边距">
          <Segmented
            value={style.margin}
            onChange={(v) => setStyle({ margin: v })}
            options={MARGINS}
            fill
          />
        </Field>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[12px] text-ink">显示照片</span>
          <ToggleSwitch
            checked={style.showPhoto}
            onChange={(v) => setStyle({ showPhoto: v })}
            ariaLabel="显示照片"
          />
        </div>
      </Card>

      {/* 板块顺序 */}
      <Card title="板块顺序">
        <p className="text-[11px] text-paper-muted -mt-1">
          拖动手柄调整板块在简历中的排列顺序。
        </p>
        <ul className="flex flex-col gap-1">
          {sectionOrder.map((key, i) => {
            const hidden = !style.sections[key];
            const isDragging = dragKey === key;
            const isOver =
              overKey === key && dragKey !== null && dragKey !== key;
            return (
              <li
                key={key}
                onDragOver={(e) => {
                  if (!dragKey) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (overKey !== key) setOverKey(key);
                }}
                onDragLeave={() => {
                  if (overKey === key) setOverKey(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragKey) reorder(dragKey, key);
                  setDragKey(null);
                  setOverKey(null);
                }}
                className={cn(
                  "grid items-center gap-2 px-2.5 py-2 border border-paper-border rounded-md bg-paper-surface transition-colors text-[12.5px]",
                  "hover:border-paper-border-strong",
                  isDragging && "opacity-40",
                  isOver && "border-paper-accent bg-paper-accent-soft",
                  hidden && "text-paper-muted",
                )}
                style={{ gridTemplateColumns: "20px 1fr auto auto" }}
              >
                <span className="font-mono text-[10.5px] text-paper-muted text-right">
                  {i + 1}
                </span>
                <span className="truncate">
                  {OPTIONAL_SECTION_LABELS[key]}
                </span>
                {hidden && (
                  <span className="font-mono text-[9.5px] tracking-wider text-paper-muted px-1.5 py-px bg-paper-surface-3 rounded uppercase">
                    Hidden
                  </span>
                )}
                <span
                  draggable
                  onDragStart={(e) => {
                    setDragKey(key);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", key);
                  }}
                  onDragEnd={() => {
                    setDragKey(null);
                    setOverKey(null);
                  }}
                  aria-label={`拖动以调整 ${OPTIONAL_SECTION_LABELS[key]} 的顺序`}
                  className="inline-grid place-items-center size-6 cursor-grab text-paper-muted-2 hover:text-ink active:cursor-grabbing"
                >
                  <GripVertical className="size-4" />
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function TemplateThumbMinimal() {
  return (
    <svg
      viewBox="0 0 120 150"
      className="w-full h-[96px] rounded bg-white border border-paper-border"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="120" height="150" fill="oklch(1 0 0)" />
      <text
        x="12"
        y="22"
        fontSize="11"
        fontWeight="700"
        fill="oklch(0.42 0.13 250)"
        fontFamily="serif"
        letterSpacing="2"
      >
        姓名
      </text>
      <line
        x1="12"
        y1="30"
        x2="108"
        y2="30"
        stroke="oklch(0.42 0.13 250)"
        strokeWidth="1.2"
      />
      <rect x="12" y="38" width="28" height="2" fill="oklch(0.42 0.13 250)" />
      <rect x="12" y="44" width="68" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="49" width="80" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="54" width="60" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="66" width="28" height="2" fill="oklch(0.42 0.13 250)" />
      <rect x="12" y="72" width="80" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="77" width="64" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="82" width="76" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="94" width="28" height="2" fill="oklch(0.42 0.13 250)" />
      <rect x="12" y="100" width="84" height="1.4" fill="oklch(0.7 0 0)" />
      <rect x="12" y="105" width="68" height="1.4" fill="oklch(0.7 0 0)" />
    </svg>
  );
}

function TemplateThumbBanner() {
  return (
    <svg
      viewBox="0 0 120 150"
      className="w-full h-[96px] rounded bg-white border border-paper-border"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="120" height="150" fill="oklch(1 0 0)" />
      <path
        d="M0 0 L120 0 L120 24 L78 24 L72 30 L0 30 Z"
        fill="oklch(0.82 0.05 240)"
      />
      <path
        d="M0 4 L120 4 L120 6 L0 6 Z"
        fill="oklch(1 0 0 / 0.35)"
      />
      <text
        x="8"
        y="20"
        fontSize="11"
        fontWeight="700"
        fill="oklch(1 0 0)"
        letterSpacing="1.5"
      >
        个人简历
      </text>
      <circle cx="92" cy="14" r="3" fill="oklch(1 0 0)" opacity="0.55" />
      <circle cx="102" cy="14" r="3" fill="oklch(1 0 0)" opacity="0.55" />
      <circle cx="112" cy="14" r="3" fill="oklch(1 0 0)" opacity="0.55" />
      {[40, 70, 100].map((y, i) => (
        <g key={i}>
          <path
            d={`M6 ${y} L40 ${y} L46 ${y + 6} L6 ${y + 6} Z`}
            fill="oklch(0.86 0.04 240)"
          />
          <rect
            x="6"
            y={y + 5}
            width="108"
            height="0.8"
            fill="oklch(0.86 0.04 240)"
          />
          <text
            x="10"
            y={y + 5}
            fontSize="5"
            fill="oklch(0.35 0.08 240)"
            fontWeight="600"
          >
            板块
          </text>
          <rect
            x="10"
            y={y + 12}
            width="54"
            height="1.4"
            fill="oklch(0.7 0 0)"
          />
          <rect
            x="10"
            y={y + 17}
            width="84"
            height="1.4"
            fill="oklch(0.7 0 0)"
          />
          <rect
            x="10"
            y={y + 22}
            width="70"
            height="1.4"
            fill="oklch(0.7 0 0)"
          />
        </g>
      ))}
    </svg>
  );
}
