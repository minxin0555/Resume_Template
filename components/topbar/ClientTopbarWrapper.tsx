"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Topbar } from "./Topbar";

export function ClientTopbarWrapper() {
  const { bumpManual } = useStore();

  useEffect(() => {
    const handler = () => bumpManual();
    window.addEventListener("resume:refresh", handler);
    return () => window.removeEventListener("resume:refresh", handler);
  }, [bumpManual]);

  const handleDownload = () => {
    (window as Window & { __resumeDownload?: () => void }).__resumeDownload?.();
  };

  const handleRefresh = () => {
    window.dispatchEvent(new CustomEvent("resume:refresh"));
  };

  return <Topbar onDownload={handleDownload} onRefresh={handleRefresh} />;
}
