"use client";

import { useStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { Field, TextArea, IconBtn, AddRow } from "./shared/atoms";

export function CoursesForm() {
  const { data, setData } = useStore();
  const courses = data.courses;

  const setOverall = (overall: string) =>
    setData({ ...data, courses: { ...courses, overall } });

  const setItems = (items: string[]) =>
    setData({ ...data, courses: { ...courses, items } });

  const addItem = () => setItems([...courses.items, ""]);
  const removeItem = (i: number) =>
    setItems(courses.items.filter((_, idx) => idx !== i));
  const changeItem = (i: number, v: string) => {
    const next = [...courses.items];
    next[i] = v;
    setItems(next);
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="综合成绩">
        <TextArea
          value={courses.overall}
          onChange={(e) => setOverall(e.target.value)}
          placeholder="例如：GPA 3.8 / 4.0，专业排名前 15%。"
          className="min-h-[55px] text-[12.5px]"
        />
      </Field>
      <Field label="课程成绩">
        <div className="flex flex-col gap-2">
          {courses.items.length === 0 && (
            <p className="text-[11px] text-paper-muted text-center py-1">
              暂无课程，点击下方按钮添加
            </p>
          )}
          {courses.items.map((c, i) => (
            <div key={i} className="flex gap-1.5 items-start">
              <TextArea
                value={c}
                onChange={(e) => changeItem(i, e.target.value)}
                placeholder="例如：数据结构 95，操作系统 92。"
                className="flex-1 min-h-[45px] text-[12.5px]"
              />
              <IconBtn
                danger
                onClick={() => removeItem(i)}
                aria-label="删除课程"
                className="mt-0.5"
              >
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          ))}
          <AddRow onClick={addItem}>添加课程成绩条目</AddRow>
        </div>
      </Field>
    </div>
  );
}
