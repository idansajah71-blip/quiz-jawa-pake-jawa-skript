import { translate } from "../src/jawascript/translator.js"
import type { Plugin, ViteDevServer } from "vite"

const jawaFile = (id: string) => id.split("?")[0].endsWith(".jawa")

export function jawaPlugin(): Plugin {
  return {
    name: "vite-plugin-jawa",
    enforce: "pre",
    transform(code, id) {
      if (!jawaFile(id)) return null
      let js: string
      try {
        js = translate(code)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        throw new Error(
          `[jawa] Gagal mentranspile ${id}\n${msg}`,
        )
      }
      return { code: js, map: null }
    },
    handleHotUpdate(ctx: {
      file: string
      server: ViteDevServer
      modules: unknown[]
    }) {
      if (!jawaFile(ctx.file)) return
      const mods = ctx.server.moduleGraph.getModulesByFile(ctx.file)
      return mods ? Array.from(mods) : undefined
    },
  }
}