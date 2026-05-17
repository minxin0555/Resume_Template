"use client";

import dynamic from "next/dynamic";
import { FormAccordion } from "@/components/form/FormAccordion";
import { ClientTopbarWrapper } from "@/components/topbar/ClientTopbarWrapper";

const PdfPreview = dynamic(
  () => import("@/components/preview/PdfPreview").then((m) => m.PdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
        正在加载预览引擎…
      </div>
    ),
  }
);

export function EditorLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <ClientTopbarWrapper />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[440px] flex-shrink-0 border-r bg-white overflow-y-auto">
          <FormAccordion />
        </aside>
        <main className="flex-1 overflow-hidden">
          <PdfPreview />
        </main>
      </div>
    </div>
  );
}
