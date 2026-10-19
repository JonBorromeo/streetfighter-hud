import type { Limit } from '../types'

export type Segment = { text: string; color: string; hex: string }
export type Fighter = { name: string; label: string; color: string; hex: string; segments: Segment[] }

const KNOWN_KINDS = ['five_hour', 'seven_day', 'spend_limit']
const HEALTH_KINDS = ['five_hour', 'spend_limit']

const WHITE = { color: 'white', hex: '#ffffff' }
const RED = { color: 'red', hex: '#d02a2a' }
const BLUE = { color: 'blue', hex: '#2a62d0' }
const GRAY = { color: 'white', hex: '#bbbbbb' }

function fighter(name: string, label: string, base: { color: string; hex: string }, segments?: Segment[]): Fighter {
  return { name, label, ...base, segments: segments ?? [{ text: label, ...base }] }
}

export function fighterFor(model: string): Fighter {
  const m = model.toLowerCase()
  if (m.includes('opus')) {
    return fighter('RYU', 'RYU (Opus)', WHITE, [
      { text: 'R', ...WHITE },
      { text: 'Y', ...RED },
      { text: 'U (Opus)', ...WHITE },
    ])
  }
  if (m.includes('sonnet')) return fighter('KEN', 'KEN (Sonnet)', RED)
  if (m.includes('haiku')) return fighter('CHUN-LI', 'CHUN-LI (Haiku)', BLUE)
  return fighter('ROOKIE', 'ROOKIE', GRAY)
}

/** The short-window limit the person has used most of, like minecraft-hud's hearts. */
export function healthLimit(limits: Limit[]): Limit | null {
  const main = limits.filter(l => HEALTH_KINDS.includes(l.kind))
  return main.reduce<Limit | null>(
    (worst, l) => (worst === null || l.percentUsed > worst.percentUsed ? l : worst),
    null,
  )
}

/** The weekly window, shown as its own bar. */
export function staminaLimit(limits: Limit[]): Limit | null {
  return limits.find(l => l.kind === 'seven_day') ?? null
}

/** Windows beyond the account-wide ones, e.g. a per-model weekly limit. */
export function modelLimits(limits: Limit[]): Limit[] {
  return limits.filter(l => !KNOWN_KINDS.includes(l.kind))
}

export function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

export function fillCells(percent: number, width: number): number {
  return Math.round((clamp(percent) / 100) * width)
}

export function bar(percent: number, width: number): string {
  const full = fillCells(percent, width)
  return '█'.repeat(full) + '░'.repeat(width - full)
}

const LEVELS = ['low', 'medium', 'high', 'xhigh', 'max']

export function effortLevel(effort: string | null): number {
  return effort === null ? 0 : LEVELS.indexOf(effort) + 1
}

export function stars(effort: string | null): string {
  const n = effortLevel(effort)
  return '★'.repeat(n) + '☆'.repeat(LEVELS.length - n)
}

export function resetIn(resetsAt: string | undefined, now: number): string {
  if (resetsAt === undefined) return ''
  const minutes = Math.max(0, Math.round((Date.parse(resetsAt) - now) / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  if (days > 0) return `${days}d${hours}h`
  return hours > 0 ? `${hours}h${minutes % 60}m` : `${minutes}m`
}

export function kindLabel(kind: string): string {
  return kind === 'five_hour' ? '5H' : kind === 'seven_day' ? '7D' : kind.replace(/^seven_day_?/, '7D ').toUpperCase()
}

/** Health left: usage is how much is gone. */
export function healthLeft(limit: Limit | null): number | null {
  return limit === null ? null : clamp(100 - limit.percentUsed)
}

/** Running out of either window ends the fight. */
export function isKo(health: number | null, stamina: number | null): boolean {
  return health === 0 || stamina === 0
}
