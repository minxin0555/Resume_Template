"use client";

import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const MODES = [
  { value: "bullets", label: "分点写" },
  { value: "paragraph", label: "段落写" },
] as const;

export function StrengthsForm() {
  const { data, setData } = useStore();
  const strengths = data.strengths;

  const setMode = (mode: "bullets" | "paragraph") =>
    setData({ ...data, strengths: { ...strengths, mode } });

  const setBullets = (bullets: string[]) =>
    setData({ ...data, strengths: { ...strengths, bullets } });

  const setParagraph = (paragraph: string) =>
    setData({ ...data, strengths: { ...strengths, paragraph } });

  const addBullet = () => setBullets([...strengths.bullets, ""]);
  const removeBullet = (i: number) =>
    setBullets(strengths.bullets.filter((_, idx) => idx !== i));
  const changeBullet = (i: number, v: string) => {
    const next = [...strengths.bullets];
    next[i] = v;
    setBullets(next);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">书写方式</Label>
        <div className="flex gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`flex-1 py-1 rounded border text-xs transition-colors ${
                strengths.mode === m.value
                  ? "bg-blue-900 text-white border-blue-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {strengths.mode === "bullets" ? (
        <div className="space-y-2">
          {strengths.bullets.map((b, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Textarea
                value={b}
                onChange={(e) => changeBullet(i, e.target.value)}
                placeholder="例如：扎实的算法功底，ACM 校赛二等奖，LeetCode 600+。"
                className="flex-1 text-xs min-h-[50px] resize-y"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-700 mt-0.5 flex-shrink-0"
                onClick={() => removeBullet(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1 text-xs"
            onClick={addBullet}
          >
            <Plus className="h-3.5 w-3.5" />
            添加优势条目
          </Button>
        </div>
      ) : (
        <Textarea
          value={strengths.paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          placeholder="用一两段话概括你的核心优势、性格特质和综合能力…"
          className="text-xs min-h-[110px] resize-y"
        />
      )}
    </div>
  );
}
