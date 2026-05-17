"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import type { ResumeData } from "@/lib/schema";

type Edu = ResumeData["education"][number];

const empty = (): Edu => ({
  period: "",
  school: "",
  major: "",
  degree: "本科",
  bullets: [],
});

export function EducationForm() {
  const { data, setData } = useStore();

  const update = (education: Edu[]) => setData({ ...data, education });

  return (
    <ArrayFieldList
      items={data.education}
      onChange={update}
      createEmpty={empty}
      label="教育经历"
      renderItem={(item, i) => (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">时间段</Label>
              <Input
                value={item.period}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2021.09 - 2025.06"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">学位</Label>
              <Input
                value={item.degree}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], degree: e.target.value };
                  update(next);
                }}
                placeholder="本科"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">学校</Label>
              <Input
                value={item.school}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], school: e.target.value };
                  update(next);
                }}
                placeholder="西安电子科技大学"
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">专业</Label>
              <Input
                value={item.major}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], major: e.target.value };
                  update(next);
                }}
                placeholder="计算机科学与技术"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">详情条目</Label>
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.education];
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
