"use client";

import { useStore } from "@/lib/store";
import { ArrayFieldList } from "./shared/ArrayFieldList";
import { Field, TextInput, TextArea } from "./shared/atoms";

export function SkillsForm() {
  const { data, setData } = useStore();
  const update = (skills: typeof data.skills) => setData({ ...data, skills });

  return (
    <ArrayFieldList
      items={data.skills}
      onChange={update}
      createEmpty={() => ({ category: "", detail: "" })}
      label="技能分类"
      itemTitle={(it, i) => it.category || `分类 #${i + 1}`}
      renderItem={(item, i) => (
        <>
          <Field label="类别">
            <TextInput
              value={item.category}
              onChange={(e) => {
                const next = [...data.skills];
                next[i] = { ...next[i], category: e.target.value };
                update(next);
              }}
              placeholder="编程语言"
            />
          </Field>
          <Field label="详情">
            <TextArea
              value={item.detail}
              onChange={(e) => {
                const next = [...data.skills];
                next[i] = { ...next[i], detail: e.target.value };
                update(next);
              }}
              placeholder="精通 Java、Python…"
              className="min-h-[60px] text-[12.5px]"
            />
          </Field>
        </>
      )}
    />
  );
}
