"use client";

import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
    <div className="space-y-2">
      {data.awards.map((a, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Textarea
            value={a}
            onChange={(e) => change(i, e.target.value)}
            placeholder="2023 年，在 [XX 大赛] 中获得 [X等奖]"
            className="flex-1 text-xs min-h-[50px] resize-y"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-700 mt-0.5 flex-shrink-0"
            onClick={() => remove(i)}
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
        onClick={add}
      >
        <Plus className="h-3.5 w-3.5" />
        添加获奖记录
      </Button>
    </div>
  );
}
