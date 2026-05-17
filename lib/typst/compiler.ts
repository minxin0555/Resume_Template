import {
  createTypstCompiler,
  loadFonts,
  type TypstCompiler,
} from "@myriaddreamin/typst.ts";

let compilerPromise: Promise<TypstCompiler> | null = null;

// Built-in typst font assets shipped by @myriaddreamin/typst.ts (OTF/TTF).
// `text` provides Libertinus Serif (Times-like) + DejaVu Sans Mono + New CM,
// including a Semibold face used for soft-bold CJK emphasis.
// The bundled `cjk` asset only ships Noto Serif CJK SC Regular, so we fetch
// the SubsetOTF "Noto Serif SC" family (Regular + SemiBold) from jsdelivr
// instead. This is a different family name from the bundled one, so we drop
// the bundled cjk asset and select "Noto Serif SC" in render.ts.
// Browsers cannot decode woff2 directly into typst's font registry — we must
// load real OTF/TTF binaries.
const cjkFontUrls = [
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf",
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Serif/SubsetOTF/SC/NotoSerifSC-SemiBold.otf",
];

export function getCompiler(): Promise<TypstCompiler> {
  if (!compilerPromise) {
    compilerPromise = (async () => {
      const compiler = createTypstCompiler();
      await compiler.init({
        beforeBuild: [loadFonts(cjkFontUrls, { assets: ["text"] })],
        getModule: () => "/typst_ts_web_compiler_bg.wasm",
      });
      return compiler;
    })();
  }
  return compilerPromise;
}
