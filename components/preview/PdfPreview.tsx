"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { renderResume } from "@/lib/typst/render";

export function PdfPreview() {
  const { data, style, livePreview, pendingChange } = useStore();
  const [url, setUrl] = useState<string>();
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string>();
  const [compiling, setCompiling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>();
  const lastUrlRef = useRef<string | null>(null);

  const compile = async () => {
    setCompiling(true);
    setError(undefined);
    try {
      const { pdf, elapsedMs } = await renderResume(data, style);
      const blob = new Blob([pdf as unknown as ArrayBuffer], { type: "application/pdf" });
      const next = URL.createObjectURL(blob);
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = next;
      setUrl(next);
      setElapsed(elapsedMs);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "编译失败");
    } finally {
      setCompiling(false);
    }
  };

  // Live preview: triggers on data/style changes with debounce
  useEffect(() => {
    if (!livePreview) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!cancelled) await compile();
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, style, livePreview]);

  // Manual refresh: triggers only on pendingChange bump when live is off
  useEffect(() => {
    if (livePreview) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      if (!cancelled) await compile();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingChange]);

  // expose download fn via ref on window
  useEffect(() => {
    (window as Window & { __resumeDownload?: () => void }).__resumeDownload = () => {
      if (!lastUrlRef.current) return;
      const a = document.createElement("a");
      a.href = lastUrlRef.current;
      a.download = `${data.basic.name || "resume"}.pdf`;
      a.click();
    };
  }, [data.basic.name]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-gray-200 overflow-hidden">
        {url ? (
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="简历预览"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
            {compiling ? (
              <>
                <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">首次编译中，请稍候…</span>
                <span className="text-xs text-gray-400">（首次加载需下载 WASM 和字体，约需 10-30 秒）</span>
              </>
            ) : (
              <span className="text-sm">等待编译</span>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-3 py-1.5 text-xs text-gray-600 border-t bg-white flex items-center gap-4 flex-shrink-0">
        {compiling && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            编译中…
          </span>
        )}
        {!compiling && url && (
          <span>编译耗时：{elapsed.toFixed(0)} ms</span>
        )}
        {!compiling && lastUpdated && (
          <span>最后更新：{lastUpdated}</span>
        )}
        {error && (
          <details className="text-red-600 flex-1 min-w-0">
            <summary className="cursor-pointer hover:opacity-80">编译错误（点击查看详情）</summary>
            <pre className="mt-1 text-xs whitespace-pre-wrap break-all bg-red-50 p-2 rounded max-h-32 overflow-auto">
              {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
