export type Limit = { kind: string; percentUsed: number; resetsAt?: string }
export type Reading = {
  model: string
  effort: string | null
  ctxPercent: number | null
  limits: Limit[]
}

declare module 'claude-code' {
  interface PluginState {
    'streetfighter-hud': { reading: Reading | null }
  }
}
