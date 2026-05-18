"use client";

import { Trash2 } from "lucide-react";
import type { Bullet } from "@/lib/schema";
import { TextInput, TextArea, IconBtn, AddRow } from "./atoms";

interface BulletListProps {
  bullets: Bullet[];
  onChange: (bullets: Bullet[]) => void;
}

export function BulletList({ bullets, onChange }: BulletListProps) {
  const update = (i: number, patch: Partial<Bullet>) => {
    const next = bullets.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    onChange(next);
  };
  const add = () => onChange([...bullets, { label: "", content: "" }]);
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2 p-2.5 bg-paper-surface-2 rounded-md border border-dashed border-paper-border">
      {bullets.length === 0 && (
        <p className="text-[11px] text-paper-muted text-center py-1">
          暂无条目，可点击下方按钮添加
        </p>
      )}
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-1.5 items-start">
          <TextInput
            placeholder="标签"
            value={b.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="w-24 h-[30px] flex-shrink-0 text-[12px]"
          />
          <TextArea
            placeholder="内容"
            value={b.content}
            onChange={(e) => update(i, { content: e.target.value })}
            className="flex-1 min-h-[52px] text-[12.5px]"
          />
          <IconBtn
            danger
            onClick={() => remove(i)}
            aria-label="删除条目"
            className="mt-0.5"
          >
            <Trash2 className="size-3.5" />
          </IconBtn>
        </div>
      ))}
      <AddRow onClick={add}>添加条目</AddRow>
    </div>
  );
}
