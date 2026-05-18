"use client";

import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Download, RotateCcw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onDownload: () => void;
  onRefresh: () => void;
}

export function Topbar({ onDownload, onRefresh }: TopbarProps) {
  const { livePreview, toggleLive, loadDemo, resetStyle, compile } = useStore();

  return (
    <header className="flex items-center gap-3.5 h-[52px] px-[18px] bg-paper-surface border-b border-paper-border z-10 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 font-medium tracking-tight">
        <span
          className="grid place-items-center size-6 rounded-md bg-ink text-paper-surface font-serif font-bold text-[13px] leading-none"
          aria-hidden
        >
          简
        </span>
        <span className="text-[13.5px] text-ink">简历生成器</span>
      </div>

      <span className="w-px h-[22px] bg-paper-border mx-0.5" />

      {/* Live preview toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="live-toggle"
          checked={livePreview}
          onCheckedChange={toggleLive}
        />
        <Label
          htmlFor="live-toggle"
          className="text-[12.5px] cursor-pointer text-ink"
        >
          实时预览
        </Label>
      </div>

      {!livePreview && (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 h-[30px] px-3 border border-paper-border bg-paper-surface text-ink rounded-md text-[12.5px] hover:bg-paper-surface-2 hover:border-paper-border-strong transition-colors"
        >
          <RefreshCw className="size-3.5" />
          刷新预览
        </button>
      )}

      <span className="w-px h-[22px] bg-paper-border mx-0.5" />

      {/* Status */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-paper-muted">
        <span
          className={cn(
            "status-dot",
            compile.error
              ? ""
              : compile.compiling
                ? "compiling"
                : "live",
          )}
          style={
            compile.error
              ? { background: "var(--paper-danger)" }
              : undefined
          }
        />
        {compile.error
          ? "编译失败"
          : compile.compiling
            ? "编译中…"
            : "已就绪"}
        {!compile.compiling && !compile.error && compile.elapsedMs > 0 && (
          <span>· {Math.round(compile.elapsedMs)} ms</span>
        )}
      </div>

      <span className="flex-1" />

      <button
        type="button"
        onClick={loadDemo}
        className="inline-flex items-center gap-1.5 h-[30px] px-3 border border-transparent text-ink rounded-md text-[12.5px] hover:bg-paper-surface-2 hover:border-paper-border transition-colors"
      >
        <Zap className="size-3.5" />
        加载示例
      </button>

      <button
        type="button"
        onClick={resetStyle}
        className="inline-flex items-center gap-1.5 h-[30px] px-3 border border-transparent text-ink rounded-md text-[12.5px] hover:bg-paper-surface-2 hover:border-paper-border transition-colors"
      >
        <RotateCcw className="size-3.5" />
        重置样式
      </button>

      <button
        type="button"
        onClick={onDownload}
        className="inline-flex items-center gap-1.5 h-[30px] px-3 bg-ink text-paper-surface border border-ink rounded-md text-[12.5px] hover:bg-[oklch(0.28_0.012_60)] hover:border-[oklch(0.28_0.012_60)] transition-colors"
      >
        <Download className="size-3.5" />
        下载 PDF
        <span
          className="ml-1 font-mono text-[10px] px-[5px] py-px rounded border border-white/15 border-b-2 bg-white/10 text-white/70"
        >
          ⌘S
        </span>
      </button>
    </header>
  );
}
