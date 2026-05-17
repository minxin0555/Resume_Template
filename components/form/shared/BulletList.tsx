"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Bullet } from "@/lib/schema";

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
    <div className="space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Input
            placeholder="标签"
            value={b.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="w-28 flex-shrink-0 h-8 text-xs"
          />
          <Textarea
            placeholder="内容"
            value={b.content}
            onChange={(e) => update(i, { content: e.target.value })}
            className="flex-1 text-xs min-h-[60px] resize-y"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 text-red-500 hover:text-red-700 mt-0.5"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1 text-xs h-7"
        onClick={add}
      >
        <Plus className="h-3 w-3" />
        添加条目
      </Button>
    </div>
  );
}
