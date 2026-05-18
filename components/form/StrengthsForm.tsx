"use client";

import { useStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import {
  Field,
  TextArea,
  IconBtn,
  AddRow,
  Segmented,
} from "./shared/atoms";

const MODES = [
  { value: "bullets" as const, label: "分点写" },
  { value: "paragraph" as const, label: "段落写" },
];

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
    <div className="flex flex-col gap-4">
      <Field label="书写方式">
        <Segmented value={strengths.mode} onChange={setMode} options={MODES} fill />
      </Field>

      {strengths.mode === "bullets" ? (
        <div className="flex flex-col gap-2">
          {strengths.bullets.length === 0 && (
            <p className="text-[11px] text-paper-muted text-center py-1">
              暂无优势条目，点击下方按钮添加
            </p>
          )}
          {strengths.bullets.map((b, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <TextArea
                value={b}
                onChange={(e) => changeBullet(i, e.target.value)}
                placeholder="例如：扎实的算法功底，ACM 校赛二等奖，LeetCode 600+。"
                className="flex-1 min-h-[50px] text-[12.5px]"
              />
              <IconBtn
                danger
                onClick={() => removeBullet(i)}
                aria-label="删除优势条目"
                className="mt-0.5"
              >
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          ))}
          <AddRow onClick={addBullet}>添加优势条目</AddRow>
        </div>
      ) : (
        <TextArea
          value={strengths.paragraph}
          onChange={(e) => setParagraph(e.target.value)}
          placeholder="用一两段话概括你的核心优势、性格特质和综合能力…"
          className="min-h-[110px] text-[12.5px]"
        />
      )}
    </div>
  );
}
