"use client";

import { useStore } from "@/lib/store";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import { Field, FieldRow, TextInput } from "./shared/atoms";
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
      itemTitle={(it, i) => it.name || `项目 #${i + 1}`}
      itemMeta={(it) => it.period}
      renderItem={(item, i) => (
        <>
          <FieldRow>
            <Field label="时间段">
              <TextInput
                value={item.period}
                onChange={(e) => {
                  const next = [...data.projects];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2023.03 - 2023.06"
              />
            </Field>
            <span />
          </FieldRow>
          <Field label="项目名称">
            <TextInput
              value={item.name}
              onChange={(e) => {
                const next = [...data.projects];
                next[i] = { ...next[i], name: e.target.value };
                update(next);
              }}
              placeholder="【基于深度学习的口罩佩戴检测系统】"
            />
          </Field>
          <Field label="项目副标题" hint="可选">
            <TextInput
              value={item.subtitle ?? ""}
              onChange={(e) => {
                const next = [...data.projects];
                next[i] = { ...next[i], subtitle: e.target.value };
                update(next);
              }}
              placeholder="基于人工智能的面部识别系统"
            />
          </Field>
          <Field label="详情条目">
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.projects];
                next[i] = { ...next[i], bullets };
                update(next);
              }}
            />
          </Field>
        </>
      )}
    />
  );
}
