"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import {
  DEFAULT_SECTION_ORDER,
  OPTIONAL_SECTION_LABELS,
  type OptionalSectionKey,
} from "@/lib/schema";

const PRESET_COLORS = ["#1f4e8c", "#444444", "#b91c1c", "#166534", "#6b21a8"];

const CJK_FONTS = [
  { value: "Noto Serif SC", label: "宋体（Noto Serif SC）" },
];

const LATIN_FONTS = [
  { value: "Libertinus Serif", label: "Times New Roman（Libertinus Serif）" },
];

const MARGINS = [
  { value: "compact", label: "紧凑" },
  { value: "standard", label: "标准" },
  { value: "loose", label: "宽松" },
];

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
    <div className="p-4 space-y-5 text-sm">
      {/* Font CJK */}
      <div className="space-y-1.5">
        <Label>中文字体</Label>
        <Select
          value={style.fontCJK}
          onValueChange={(v) => setStyle({ fontCJK: v as typeof style.fontCJK })}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CJK_FONTS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Latin */}
      <div className="space-y-1.5">
        <Label>西文字体</Label>
        <Select
          value={style.fontLatin}
          onValueChange={(v) =>
            setStyle({ fontLatin: v as typeof style.fontLatin })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LATIN_FONTS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>基础字号</Label>
          <span className="text-muted-foreground">{style.baseFontSize} pt</span>
        </div>
        <Slider
          min={8}
          max={12}
          step={0.5}
          value={style.baseFontSize}
          onValueChange={(v) => setStyle({ baseFontSize: v as number })}
        />
      </div>

      {/* Theme color */}
      <div className="space-y-2">
        <Label>主题色</Label>
        <div className="flex gap-2 items-center flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              title={c}
              onClick={() => setStyle({ themeColor: c })}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: style.themeColor === c ? "#000" : "transparent",
              }}
            />
          ))}
          <button
            className="w-6 h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center"
            style={{ backgroundColor: style.themeColor }}
            onClick={() => setShowPicker((p) => !p)}
            title="自定义颜色"
          />
        </div>
        {showPicker && (
          <div className="relative z-20">
            <HexColorPicker
              color={style.themeColor}
              onChange={(c) => setStyle({ themeColor: c })}
            />
            <button
              className="mt-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowPicker(false)}
            >
              关闭
            </button>
          </div>
        )}
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>行距</Label>
          <span className="text-muted-foreground">{style.lineHeight.toFixed(1)}</span>
        </div>
        <Slider
          min={1.1}
          max={1.8}
          step={0.1}
          value={style.lineHeight}
          onValueChange={(v) => setStyle({ lineHeight: v as number })}
        />
      </div>

      {/* Paragraph spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>段距</Label>
          <span className="text-muted-foreground">
            {style.paragraphSpacing.toFixed(1)} em
          </span>
        </div>
        <Slider
          min={0.2}
          max={1.2}
          step={0.1}
          value={style.paragraphSpacing}
          onValueChange={(v) => setStyle({ paragraphSpacing: v as number })}
        />
      </div>

      {/* Bullet spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>列表条目间距</Label>
          <span className="text-muted-foreground">
            {style.bulletSpacing.toFixed(1)} em
          </span>
        </div>
        <Slider
          min={0.1}
          max={1.0}
          step={0.1}
          value={style.bulletSpacing}
          onValueChange={(v) => setStyle({ bulletSpacing: v as number })}
        />
      </div>

      {/* Section spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>板块间距</Label>
          <span className="text-muted-foreground">
            {style.sectionSpacing.toFixed(1)} em
          </span>
        </div>
        <Slider
          min={0.3}
          max={2.0}
          step={0.1}
          value={style.sectionSpacing}
          onValueChange={(v) => setStyle({ sectionSpacing: v as number })}
        />
      </div>

      {/* Margin */}
      <div className="space-y-1.5">
        <Label>页面边距</Label>
        <div className="flex gap-2">
          {MARGINS.map((m) => (
            <button
              key={m.value}
              onClick={() =>
                setStyle({ margin: m.value as typeof style.margin })
              }
              className={`flex-1 py-1 rounded border text-xs transition-colors ${
                style.margin === m.value
                  ? "bg-blue-900 text-white border-blue-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show photo */}
      <div className="flex items-center gap-2">
        <Switch
          id="show-photo"
          checked={style.showPhoto}
          onCheckedChange={(v) => setStyle({ showPhoto: v })}
        />
        <Label htmlFor="show-photo">显示照片</Label>
      </div>

      {/* Section order */}
      <div className="space-y-1.5 border-t pt-4">
        <Label>板块顺序</Label>
        <p className="text-[11px] text-muted-foreground">
          拖动右侧手柄调整板块在简历中的排列顺序。
        </p>
        <ul className="space-y-1">
          {sectionOrder.map((key, i) => {
            const hidden = !style.sections[key];
            const isDragging = dragKey === key;
            const isOver = overKey === key && dragKey !== null && dragKey !== key;
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
                className={`flex items-center justify-between rounded border bg-gray-50 px-2 py-1.5 transition-all ${
                  isDragging ? "opacity-40" : ""
                } ${
                  isOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <span className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-muted-foreground">{i + 1}.</span>
                  <span className={hidden ? "text-muted-foreground" : ""}>
                    {OPTIONAL_SECTION_LABELS[key]}
                  </span>
                  {hidden && (
                    <span className="rounded bg-gray-200 px-1 text-[10px] text-gray-600">
                      已隐藏
                    </span>
                  )}
                </span>
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
                  className="inline-flex h-6 w-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-gray-200 hover:text-foreground active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
