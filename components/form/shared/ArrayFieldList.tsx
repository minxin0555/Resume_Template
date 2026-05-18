"use client";

import { Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { IconBtn, AddRow } from "./atoms";

interface ArrayFieldListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  createEmpty: () => T;
  label: string;
  /** 用于 item-head 右侧元信息（可选） */
  itemTitle?: (item: T, index: number) => React.ReactNode;
  itemMeta?: (item: T, index: number) => React.ReactNode;
}

export function ArrayFieldList<T>({
  items,
  onChange,
  renderItem,
  createEmpty,
  label,
  itemTitle,
  itemMeta,
}: ArrayFieldListProps<T>) {
  const add = () => onChange([...items, createEmpty()]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-paper-border rounded-lg bg-paper-surface overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2.5 bg-paper-surface-2 border-b border-paper-border">
            <span className="text-paper-muted-2">
              <GripVertical className="size-4" />
            </span>
            <span className="flex-1 text-[12.5px] font-medium text-ink truncate">
              {itemTitle ? itemTitle(item, i) : `${label} #${i + 1}`}
            </span>
            {itemMeta && (
              <span className="font-mono text-[11px] text-paper-muted truncate">
                {itemMeta(item, i)}
              </span>
            )}
            <div className="flex items-center gap-0.5 ml-1">
              <IconBtn
                onClick={() => moveUp(i)}
                disabled={i === 0}
                aria-label="上移"
                className="disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-paper-muted"
              >
                <ChevronUp className="size-3.5" />
              </IconBtn>
              <IconBtn
                onClick={() => moveDown(i)}
                disabled={i === items.length - 1}
                aria-label="下移"
                className="disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-paper-muted"
              >
                <ChevronDown className="size-3.5" />
              </IconBtn>
              <IconBtn
                danger
                onClick={() => remove(i)}
                aria-label="删除"
              >
                <Trash2 className="size-3.5" />
              </IconBtn>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-2.5">{renderItem(item, i)}</div>
        </div>
      ))}
      <AddRow onClick={add}>添加{label}</AddRow>
    </div>
  );
}
