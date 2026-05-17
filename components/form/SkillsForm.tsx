"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export function SkillsForm() {
  const { data, setData } = useStore();

  const update = (skills: typeof data.skills) => setData({ ...data, skills });
  const add = () => update([...data.skills, { category: "", detail: "" }]);
  const remove = (i: number) =>
    update(data.skills.filter((_, idx) => idx !== i));
  const change = (
    i: number,
    patch: Partial<(typeof data.skills)[number]>
  ) => {
    const next = [...data.skills];
    next[i] = { ...next[i], ...patch };
    update(next);
  };

  return (
    <div className="space-y-2">
      {data.skills.map((s, i) => (
        <div key={i} className="border rounded-md p-3 space-y-2 bg-gray-50">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-700"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">类别</Label>
            <Input
              value={s.category}
              onChange={(e) => change(i, { category: e.target.value })}
              placeholder="编程语言"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">详情</Label>
            <Textarea
              value={s.detail}
              onChange={(e) => change(i, { detail: e.target.value })}
              placeholder="精通 Java、Python…"
              className="text-xs min-h-[60px] resize-y"
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1 text-xs"
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5" />
        添加技能分类
      </Button>
    </div>
  );
}
