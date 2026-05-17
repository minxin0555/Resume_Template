"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import type { ContactItem, ContactRow } from "@/lib/schema";
import { CONTACT_ROW_COUNT } from "@/lib/schema";

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

  const updateRow = (rowIdx: number, next: ContactRow) => {
    const rows = basic.contactRows.map((r, i) => (i === rowIdx ? next : r));
    updateRows(rows);
  };

  const addItem = (rowIdx: number) => {
    updateRow(rowIdx, [
      ...basic.contactRows[rowIdx],
      { label: "", value: "" },
    ]);
  };

  const removeItem = (rowIdx: number, itemIdx: number) => {
    updateRow(
      rowIdx,
      basic.contactRows[rowIdx].filter((_, i) => i !== itemIdx),
    );
  };

  const patchItem = (
    rowIdx: number,
    itemIdx: number,
    patch: Partial<ContactItem>,
  ) => {
    updateRow(
      rowIdx,
      basic.contactRows[rowIdx].map((item, i) =>
        i === itemIdx ? { ...item, ...patch } : item,
      ),
    );
  };

  return (
    <div className="space-y-3 p-1">
      <div className="space-y-1">
        <Label className="text-xs">姓名 *</Label>
        <Input
          value={basic.name}
          onChange={(e) => patchBasic({ name: e.target.value })}
          className="h-8 text-sm"
          placeholder="王语涵"
        />
      </div>

      <div className="space-y-3 pt-1">
        {Array.from({ length: CONTACT_ROW_COUNT }).map((_, rowIdx) => {
          const row = basic.contactRows[rowIdx] ?? [];
          return (
            <div
              key={rowIdx}
              className="rounded-md border bg-gray-50 p-2 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">
                  {ROW_LABELS[rowIdx] ?? `第${rowIdx + 1}行`}
                </Label>
                <span className="text-[10px] text-gray-500">
                  同行多个属性以 ｜ 分隔
                </span>
              </div>
              {row.length === 0 && (
                <p className="text-[11px] text-gray-400">
                  暂无属性，可点击下方按钮添加；该行为空时不会出现在简历上
                </p>
              )}
              <div className="space-y-1.5">
                {row.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex gap-1.5 items-center">
                    <Input
                      placeholder="属性"
                      value={item.label}
                      onChange={(e) =>
                        patchItem(rowIdx, itemIdx, { label: e.target.value })
                      }
                      className="h-7 text-xs w-24 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-400">：</span>
                    <Input
                      placeholder="值"
                      value={item.value}
                      onChange={(e) =>
                        patchItem(rowIdx, itemIdx, { value: e.target.value })
                      }
                      className="h-7 text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700 flex-shrink-0"
                      onClick={() => removeItem(rowIdx, itemIdx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-xs h-7"
                onClick={() => addItem(rowIdx)}
              >
                <Plus className="h-3 w-3" />
                添加属性
              </Button>
            </div>
          );
        })}
      </div>

      {/* Photo */}
      <div className="flex items-center gap-3 pt-1">
        <div className="space-y-1 flex-1">
          <Label className="text-xs">证件照</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1 text-xs border rounded hover:bg-gray-50 transition-colors"
            >
              {basic.photoDataUrl ? "更换照片" : "上传照片"}
            </button>
            {basic.photoDataUrl && (
              <button
                type="button"
                className="text-xs text-red-500 hover:text-red-700"
                onClick={() => patchBasic({ photoDataUrl: undefined })}
              >
                删除
              </button>
            )}
          </div>
        </div>
        {basic.photoDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={basic.photoDataUrl}
            alt="证件照"
            className="w-14 h-18 object-cover rounded border"
            style={{ height: "5rem" }}
          />
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Switch
          id="show-photo-basic"
          checked={style.showPhoto}
          onCheckedChange={(v) => setStyle({ showPhoto: v })}
        />
        <Label htmlFor="show-photo-basic" className="text-xs cursor-pointer">
          在简历中显示照片
        </Label>
      </div>
    </div>
  );
}
