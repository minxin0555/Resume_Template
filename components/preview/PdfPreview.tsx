"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { renderResume } from "@/lib/typst/render";
import { ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 1.8;
const ZOOM_STEP = 0.1;

export function PdfPreview() {
  const { data, style, livePreview, pendingChange, setCompile, compile } =
    useStore();
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [zoom, setZoom] = useState(1);
  const lastUrlRef = useRef<string | null>(null);

  const compileNow = async () => {
    setCompile({ compiling: true, error: undefined });
    setError(undefined);
    try {
      const { pdf, elapsedMs } = await renderResume(data, style);
      const blob = new Blob([pdf as unknown as ArrayBuffer], {
        type: "application/pdf",
      });
      const next = URL.createObjectURL(blob);
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = next;
      setUrl(next);
      setCompile({
        compiling: false,
        elapsedMs,
        lastUpdated: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        error: undefined,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "编译失败";
      setError(msg);
      setCompile({ compiling: false, error: msg });
    }
  };

  useEffect(() => {
    if (!livePreview) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!cancelled) await compileNow();
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, style, livePreview]);

  useEffect(() => {
    if (livePreview) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!cancelled) await compileNow();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingChange]);

  useEffect(() => {
    (window as Window & { __resumeDownload?: () => void }).__resumeDownload =
      () => {
        if (!lastUrlRef.current) return;
        const a = document.createElement("a");
        a.href = lastUrlRef.current;
        a.download = `${data.basic.name || "resume"}.pdf`;
        a.click();
      };
  }, [data.basic.name]);

  const adjustZoom = (delta: number) =>
    setZoom((z) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 100) / 100)),
    );

  return (
    <div className="flex flex-col h-full bg-paper-surface-3 min-w-0 min-h-0">
      {/* Preview toolbar */}
      <div className="h-10 flex items-center gap-2.5 px-3.5 bg-paper-surface border-b border-paper-border flex-shrink-0">
        <div className="flex items-center gap-1 font-mono text-[11px] text-paper-muted">
          <span>预览</span>
          <ChevronRight className="size-3" />
          <b className="text-ink-soft font-medium">
            {data.basic.name || "resume"}.pdf
          </b>
        </div>
        <span className="flex-1" />
        <div className="flex items-center gap-1 text-paper-muted">
          <button
            type="button"
            onClick={() => adjustZoom(-ZOOM_STEP)}
            className="inline-grid place-items-center size-[26px] rounded-[5px] hover:bg-paper-surface-2 hover:text-ink transition-colors"
            title="缩小"
            disabled={zoom <= ZOOM_MIN + 0.001}
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="font-mono text-[11px] tabular-nums w-12 text-center text-ink-soft">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => adjustZoom(ZOOM_STEP)}
            className="inline-grid place-items-center size-[26px] rounded-[5px] hover:bg-paper-surface-2 hover:text-ink transition-colors"
            title="放大"
            disabled={zoom >= ZOOM_MAX - 0.001}
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Display area —— iframe 铺满整个预览区，两组缩放按钮都通过 #zoom= 控制 PDF 内容 */}
      <div className="flex-1 min-h-0 bg-paper-surface-3">
        {url ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&zoom=${Math.round(zoom * 100)}`}
            className="w-full h-full border-0 block bg-paper-surface"
            title="简历预览"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-paper-muted">
            {compile.compiling ? (
              <>
                <Loader2 className="size-7 animate-spin text-paper-accent" />
                <span className="text-[13px] text-ink-soft">
                  首次编译中，请稍候…
                </span>
                <span className="text-[11px] text-paper-muted font-mono">
                  （首次加载需下载 WASM 和字体，约需 10-30 秒）
                </span>
              </>
            ) : (
              <span className="text-[13px]">等待编译</span>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="h-[30px] flex items-center gap-3.5 px-3.5 bg-paper-surface border-t border-paper-border font-mono text-[11px] text-paper-muted flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span
            className={`status-dot ${
              error ? "" : compile.compiling ? "compiling" : "live"
            }`}
            style={error ? { background: "var(--paper-danger)" } : undefined}
          />
          {error
            ? "编译失败"
            : compile.compiling
              ? "编译中…"
              : "实时预览已就绪"}
        </span>
        {!compile.compiling && !error && url && (
          <span>耗时 {Math.round(compile.elapsedMs)} ms</span>
        )}
        {!compile.compiling && !error && compile.lastUpdated && (
          <span>更新于 {compile.lastUpdated}</span>
        )}
        {error && (
          <details className="text-paper-danger flex-1 min-w-0">
            <summary className="cursor-pointer hover:opacity-80">
              查看详情
            </summary>
            <pre className="mt-1 text-[11px] whitespace-pre-wrap break-all bg-paper-accent-soft p-2 rounded max-h-32 overflow-auto text-paper-danger">
              {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
