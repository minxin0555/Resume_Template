"use client";

import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

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
    <div className="space-y-4">
      <div className="space-y-1">
        <Label className="text-xs">综合成绩</Label>
        <Textarea
          value={courses.overall}
          onChange={(e) => setOverall(e.target.value)}
          placeholder="例如：GPA 3.8 / 4.0，专业排名前 15%。"
          className="text-xs min-h-[55px] resize-y"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">课程成绩</Label>
        {courses.items.map((c, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Textarea
              value={c}
              onChange={(e) => changeItem(i, e.target.value)}
              placeholder="例如：数据结构 95，操作系统 92。"
              className="flex-1 text-xs min-h-[45px] resize-y"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-700 mt-0.5 flex-shrink-0"
              onClick={() => removeItem(i)}
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
          onClick={addItem}
        >
          <Plus className="h-3.5 w-3.5" />
          添加课程成绩条目
        </Button>
      </div>
    </div>
  );
}
