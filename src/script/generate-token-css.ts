// scripts/generate-token-css.ts
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { tokens } from '@/styles/tokens'

const out = resolve(process.cwd(), 'src/styles/tokens.css')
mkdirSync(dirname(out), { recursive: true })

const css = `:root{
  --color-primary:${tokens.colors.primary};
  --color-secondary:${tokens.colors.secondary};
  --color-background:${tokens.colors.background};
  --color-surface:${tokens.colors.surface};
  --color-foreground:${tokens.colors.foreground};
  --radius-lg:${tokens.radius.lg}px;
}
`

writeFileSync(out, css)
console.log(`✔ Wrote ${out}`)
