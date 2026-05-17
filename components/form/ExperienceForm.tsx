"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import type { ResumeData } from "@/lib/schema";

type Exp = ResumeData["experience"][number];

const empty = (): Exp => ({
  period: "",
  org: "",
  role: "",
  bullets: [],
});

export function ExperienceForm() {
  const { data, setData } = useStore();

  const update = (experience: Exp[]) => setData({ ...data, experience });

  return (
    <ArrayFieldList
      items={data.experience}
      onChange={update}
      createEmpty={empty}
      label="实习经历"
      renderItem={(item, i) => (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">时间段</Label>
              <Input
                value={item.period}
                onChange={(e) => {
                  const next = [...data.experience];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2023.07 - 2023.09"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">职位</Label>
              <Input
                value={item.role}
                onChange={(e) => {
                  const next = [...data.experience];
                  next[i] = { ...next[i], role: e.target.value };
                  update(next);
                }}
                placeholder="软件研发实习生"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">公司/机构</Label>
            <Input
              value={item.org}
              onChange={(e) => {
                const next = [...data.experience];
                next[i] = { ...next[i], org: e.target.value };
                update(next);
              }}
              placeholder="字节跳动科技有限公司"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">详情条目</Label>
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.experience];
                next[i] = { ...next[i], bullets };
                update(next);
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
