"use client";

import { useStore } from "@/lib/store";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import { Field, FieldRow, TextInput } from "./shared/atoms";
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
      itemTitle={(it, i) => it.school || `教育 #${i + 1}`}
      itemMeta={(it) => it.period}
      renderItem={(item, i) => (
        <>
          <FieldRow>
            <Field label="时间段">
              <TextInput
                value={item.period}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2021.09 - 2025.06"
              />
            </Field>
            <Field label="学位">
              <TextInput
                value={item.degree}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], degree: e.target.value };
                  update(next);
                }}
                placeholder="本科"
              />
            </Field>
          </FieldRow>
          <FieldRow>
            <Field label="学校">
              <TextInput
                value={item.school}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], school: e.target.value };
                  update(next);
                }}
                placeholder="西安电子科技大学"
              />
            </Field>
            <Field label="专业">
              <TextInput
                value={item.major}
                onChange={(e) => {
                  const next = [...data.education];
                  next[i] = { ...next[i], major: e.target.value };
                  update(next);
                }}
                placeholder="计算机科学与技术"
              />
            </Field>
          </FieldRow>
          <Field label="详情条目">
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.education];
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
