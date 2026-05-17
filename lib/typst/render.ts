import { getCompiler } from "./compiler";
import { template } from "./template";
import type { ResumeData, StyleConfig } from "../schema";

function escape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function toTypst(v: unknown): string {
  if (v === null || v === undefined) return "none";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return `"${escape(v)}"`;
  if (Array.isArray(v)) {
    const items = v.map(toTypst).join(", ");
    return `(${items}${v.length === 1 ? "," : ""})`;
  }
  if (typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>);
    if (entries.length === 0) return "(:)";
    return (
      "(" +
      entries.map(([k, val]) => `${k}: ${toTypst(val)}`).join(", ") +
      ")"
    );
  }
  return "none";
}

function decodeDataUrl(url: string): { ext: string; bytes: Uint8Array } | null {
  const m = /^data:image\/([a-zA-Z+]+);base64,(.+)$/.exec(url);
  if (!m) return null;
  const raw = m[1].toLowerCase();
  const ext = raw === "jpeg" ? "jpg" : raw;
  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { ext, bytes };
}

export async function renderResume(
  data: ResumeData,
  style: StyleConfig
): Promise<{ pdf: Uint8Array; elapsedMs: number }> {
  const t0 = performance.now();
  const compiler = await getCompiler();

  // Force the only fonts we actually load. Persisted store values from
  // previous schema versions (e.g. "Noto Sans SC") would otherwise leak in
  // and render as tofu.
  const safeStyle: StyleConfig = {
    ...style,
    fontCJK: "Noto Serif SC",
    fontLatin: "Libertinus Serif",
  };

  // Photo: decode the base64 data URL into bytes and expose it as a
  // virtual file. Typst can read images via path (`image("/photo.png")`)
  // but not from raw data URLs.
  let photoPath: string | undefined;
  const photoUrl = data.basic.photoDataUrl;
  if (photoUrl) {
    const decoded = decodeDataUrl(photoUrl);
    if (decoded) {
      photoPath = `/photo.${decoded.ext}`;
      compiler.mapShadow(photoPath, decoded.bytes);
    }
  }
  const safeData: ResumeData = {
    ...data,
    basic: { ...data.basic, photoDataUrl: photoPath },
  };

  const mainSrc = `
#import "/template.typ": resume
#resume(
  data: ${toTypst(safeData)},
  style: ${toTypst(safeStyle)},
)
`;

  compiler.addSource("/template.typ", template);
  compiler.addSource("/main.typ", mainSrc);

  const result = await compiler.compile({
    mainFilePath: "/main.typ",
    format: 1, // CompileFormatEnum.pdf
    diagnostics: "unix",
  });

  if (!result.result) {
    const diag = result.diagnostics;
    const msg = Array.isArray(diag) ? diag.join("\n") : "编译失败";
    throw new Error(msg || "编译失败（无诊断信息）");
  }

  return { pdf: result.result as Uint8Array, elapsedMs: performance.now() - t0 };
}
