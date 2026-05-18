"use client";

import { useStore } from "@/lib/store";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { BulletList } from "./shared/BulletList";
import { Field, FieldRow, TextInput } from "./shared/atoms";
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
      itemTitle={(it, i) =>
        it.org && it.role
          ? `${it.org} · ${it.role}`
          : it.org || it.role || `实习 #${i + 1}`
      }
      itemMeta={(it) => it.period}
      renderItem={(item, i) => (
        <>
          <FieldRow>
            <Field label="时间段">
              <TextInput
                value={item.period}
                onChange={(e) => {
                  const next = [...data.experience];
                  next[i] = { ...next[i], period: e.target.value };
                  update(next);
                }}
                placeholder="2023.07 - 2023.09"
              />
            </Field>
            <Field label="职位">
              <TextInput
                value={item.role}
                onChange={(e) => {
                  const next = [...data.experience];
                  next[i] = { ...next[i], role: e.target.value };
                  update(next);
                }}
                placeholder="软件研发实习生"
              />
            </Field>
          </FieldRow>
          <Field label="公司 / 机构">
            <TextInput
              value={item.org}
              onChange={(e) => {
                const next = [...data.experience];
                next[i] = { ...next[i], org: e.target.value };
                update(next);
              }}
              placeholder="字节跳动科技有限公司"
            />
          </Field>
          <Field label="详情条目">
            <BulletList
              bullets={item.bullets}
              onChange={(bullets) => {
                const next = [...data.experience];
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
