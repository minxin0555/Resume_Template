"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import type { ResumeData } from "@/lib/schema";

type Project = ResumeData["projects"][number];

const empty = (): Project => ({
  period: "",
  name: "",
  subtitle: "",
  bullets: [],
});

export function ProjectForm() {
  const { data, setData } = useStore();

  const update = (projects: Project[]) => setData({ ...data, projects });

  return (
    <ArrayFieldList
      items={data.projects}
      onChange={update}
      createEmpty={empty}
      label="项目"
      renderItem={(item, i) => (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">时间段</Label>
              <Input
                value={item.period}
                onChange={(e) => {
                  const next = [...data.projects];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2023.03 - 2023.06"
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">项目名称</Label>
            <Input
              value={item.name}
              onChange={(e) => {
                const next = [...data.projects];
                next[i] = { ...next[i], name: e.target.value };
                update(next);
              }}
              placeholder="【基于深度学习的口罩佩戴检测系统】"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">项目副标题（可选）</Label>
            <Input
              value={item.subtitle ?? ""}
              onChange={(e) => {
                const next = [...data.projects];
                next[i] = { ...next[i], subtitle: e.target.value };
                update(next);
              }}
              placeholder="基于人工智能的面部识别系统"
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">详情条目</Label>
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.projects];
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
