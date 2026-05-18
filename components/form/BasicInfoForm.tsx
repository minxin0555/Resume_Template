"use client";

import { useStore } from "@/lib/store";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";
import type { ContactItem, ContactRow } from "@/lib/schema";
import { CONTACT_ROW_COUNT } from "@/lib/schema";
import {
  Field,
  TextInput,
  IconBtn,
  AddRow,
  ToggleSwitch,
} from "./shared/atoms";

const ROW_LABELS = ["第一行", "第二行", "第三行"];

export function BasicInfoForm() {
  const { data, patchBasic, style, setStyle } = useStore();
  const { basic } = data;
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      patchBasic({ photoDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const updateRows = (rows: ContactRow[]) => patchBasic({ contactRows: rows });
  const updateRow = (rowIdx: number, next: ContactRow) =>
    updateRows(basic.contactRows.map((r, i) => (i === rowIdx ? next : r)));

  const addItem = (rowIdx: number) =>
    updateRow(rowIdx, [
      ...basic.contactRows[rowIdx],
      { label: "", value: "" },
    ]);
  const removeItem = (rowIdx: number, itemIdx: number) =>
    updateRow(
      rowIdx,
      basic.contactRows[rowIdx].filter((_, i) => i !== itemIdx),
    );
  const patchItem = (
    rowIdx: number,
    itemIdx: number,
    patch: Partial<ContactItem>,
  ) =>
    updateRow(
      rowIdx,
      basic.contactRows[rowIdx].map((item, i) =>
        i === itemIdx ? { ...item, ...patch } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-5">
      <Field label="姓名 *">
        <TextInput
          value={basic.name}
          onChange={(e) => patchBasic({ name: e.target.value })}
          placeholder="王语涵"
        />
      </Field>

      {/* 联系方式 —— 三行 card */}
      {Array.from({ length: CONTACT_ROW_COUNT }).map((_, rowIdx) => {
        const row = basic.contactRows[rowIdx] ?? [];
        return (
          <div
            key={rowIdx}
            className="border border-paper-border rounded-lg bg-paper-surface overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-paper-surface-2 border-b border-paper-border text-[12px] font-medium text-ink-soft">
              <span>{ROW_LABELS[rowIdx] ?? `第${rowIdx + 1}行`}</span>
              <span className="font-mono text-[10.5px] text-paper-muted font-normal">
                同行属性以 ｜ 分隔
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {row.length === 0 && (
                <p className="text-[11px] text-paper-muted">
                  暂无属性，可点击下方按钮添加；该行为空时不会出现在简历上
                </p>
              )}
              {row.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="grid items-center gap-1.5"
                  style={{ gridTemplateColumns: "96px 1fr 26px" }}
                >
                  <TextInput
                    placeholder="属性"
                    value={item.label}
                    onChange={(e) =>
                      patchItem(rowIdx, itemIdx, { label: e.target.value })
                    }
                    className="h-[30px] text-[12.5px]"
                  />
                  <TextInput
                    placeholder="值"
                    value={item.value}
                    onChange={(e) =>
                      patchItem(rowIdx, itemIdx, { value: e.target.value })
                    }
                    className="h-[30px] text-[12.5px]"
                  />
                  <IconBtn
                    danger
                    onClick={() => removeItem(rowIdx, itemIdx)}
                    aria-label="删除属性"
                  >
                    <Trash2 className="size-3.5" />
                  </IconBtn>
                </div>
              ))}
              <AddRow onClick={() => addItem(rowIdx)}>添加属性</AddRow>
            </div>
          </div>
        );
      })}

      {/* 证件照 */}
      <Field label="证件照" hint="JPG / PNG · 建议 88×110">
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
          {basic.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={basic.photoDataUrl}
              alt="证件照"
              onClick={() => fileRef.current?.click()}
              className="w-[88px] h-[110px] object-cover rounded-md border border-paper-border-strong cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-[88px] h-[110px] rounded-md border border-dashed border-paper-border-strong flex flex-col items-center justify-center gap-1 text-paper-muted font-mono text-[10px] cursor-pointer hover:border-paper-accent hover:text-paper-accent-ink transition-colors"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--paper-surface-2) 0 6px, var(--paper-surface) 6px 12px)",
              }}
            >
              <ImageIcon className="size-4" />
              <span>点击上传</span>
            </button>
          )}
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex items-center gap-2">
              <ToggleSwitch
                checked={style.showPhoto}
                onChange={(v) => setStyle({ showPhoto: v })}
                ariaLabel="在简历中显示照片"
              />
              <span className="text-ink">在简历中显示</span>
            </div>
            {basic.photoDataUrl && (
              <button
                type="button"
                onClick={() => patchBasic({ photoDataUrl: undefined })}
                className="text-paper-danger text-[11.5px] text-left hover:underline"
              >
                删除照片
              </button>
            )}
          </div>
        </div>
      </Field>
    </div>
  );
}
