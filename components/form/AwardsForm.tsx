"use client";

import { useStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { TextArea, IconBtn, AddRow } from "./shared/atoms";

export function AwardsForm() {
  const { data, setData } = useStore();

  const update = (awards: string[]) => setData({ ...data, awards });
  const add = () => update([...data.awards, ""]);
  const remove = (i: number) => update(data.awards.filter((_, idx) => idx !== i));
  const change = (i: number, v: string) => {
    const next = [...data.awards];
    next[i] = v;
    update(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {data.awards.length === 0 && (
        <p className="text-[11px] text-paper-muted text-center py-2">
          暂无获奖记录，点击下方按钮添加
        </p>
      )}
      {data.awards.map((a, i) => (
        <div key={i} className="flex gap-1.5 items-start">
          <TextArea
            value={a}
            onChange={(e) => change(i, e.target.value)}
            placeholder="2023 年，在 [XX 大赛] 中获得 [X 等奖]"
            className="flex-1 min-h-[50px] text-[12.5px]"
          />
          <IconBtn
            danger
            onClick={() => remove(i)}
            aria-label="删除获奖记录"
            className="mt-0.5"
          >
            <Trash2 className="size-3.5" />
          </IconBtn>
        </div>
      ))}
      <AddRow onClick={add}>添加获奖记录</AddRow>
    </div>
  );
}
