"use client";

import dynamic from "next/dynamic";
import { NavRail } from "@/components/navrail/NavRail";
import { EditorColumn } from "@/components/navrail/EditorColumn";
import { ClientTopbarWrapper } from "@/components/topbar/ClientTopbarWrapper";

const PdfPreview = dynamic(
  () => import("@/components/preview/PdfPreview").then((m) => m.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-paper-surface-3 text-paper-muted text-sm">
        正在加载预览引擎…
      </div>
    ),
  },
);

export function EditorLayout() {
  return (
    <div className="grid grid-rows-[52px_1fr] h-screen bg-paper-bg overflow-hidden">
      <ClientTopbarWrapper />
      <div className="grid grid-cols-[64px_420px_1fr] min-h-0">
        <NavRail />
        <EditorColumn />
        <main className="overflow-hidden min-w-0">
          <PdfPreview />
        </main>
      </div>
    </div>
  );
}
