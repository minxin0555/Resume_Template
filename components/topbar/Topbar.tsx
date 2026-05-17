"use client";

import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, RotateCcw } from "lucide-react";

interface TopbarProps {
  onDownload: () => void;
  onRefresh: () => void;
}

export function Topbar({ onDownload, onRefresh }: TopbarProps) {
  const { livePreview, toggleLive, loadDemo, resetStyle } = useStore();

  return (
    <header className="flex items-center gap-3 px-4 py-2 border-b bg-white shadow-sm z-10 flex-shrink-0">
      <span className="font-bold text-blue-900 mr-2 text-lg">简历生成器</span>

      <div className="flex items-center gap-2 ml-2">
        <Switch
          id="live-toggle"
          checked={livePreview}
          onCheckedChange={toggleLive}
        />
        <Label htmlFor="live-toggle" className="text-sm cursor-pointer">
          实时预览
        </Label>
      </div>

      {!livePreview && (
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1">
          <RefreshCw className="w-3.5 h-3.5" />
          刷新预览
        </Button>
      )}

      <div className="ml-auto flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={loadDemo}
          className="text-xs"
        >
          加载示例
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetStyle}
          className="text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          重置样式
        </Button>
        <Button size="sm" onClick={onDownload} className="gap-1 bg-blue-900 hover:bg-blue-800">
          <Download className="w-3.5 h-3.5" />
          下载 PDF
        </Button>
      </div>
    </header>
  );
}
