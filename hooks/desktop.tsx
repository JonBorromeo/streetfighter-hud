import type { Reading } from '../types'
import { clamp, effortLevel, fighterFor, healthLeft, healthLimit, kindLabel, modelLimits, resetIn, staminaLimit } from './model'

const W = 384 // wide enough for "STAMINA (weekly) 100% 6d23h" at wider monospace fonts
const H = 96
const PX = 4
const PLATE_W = 112 // fits "CHUN-LI (Haiku)" with slack for wider monospace fonts
const HEALTH_X = PX + PLATE_W + PX

function rect(x: number, y: number, w: number, h: number, fill: string): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`
}

/** A chunky pixel bar: dark frame, segmented fill. */
function pixelBar(x: number, y: number, w: number, h: number, percent: number, fill: string, back: string): string {
  const inner = w - 2 * PX
  const filled = Math.round((clamp(percent) / 100) * inner / PX) * PX
  return (
    rect(x, y, w, h, '#000') +
    rect(x + PX, y + PX, inner, h - 2 * PX, back) +
    rect(x + PX, y + PX, filled, h - 2 * PX, fill) +
    rect(x + PX, y + PX, filled, PX, '#fff6') // highlight row, SF2 style
  )
}

export function svgSource(reading: Reading, now: number): string {
  const fighter = fighterFor(reading.model)
  const worst = healthLimit(reading.limits)
  const left = healthLeft(worst)
  const week = staminaLimit(reading.limits)
  const weekLeft = healthLeft(week)
  const parts: string[] = [rect(0, 0, W, H, '#10102a')]
  // name plate: colored border around a dark inner plate, so each segment's own color reads on black
  parts.push(rect(PX, PX, PLATE_W, 16, fighter.hex), rect(PX + 2, PX + 2, PLATE_W - 4, 12, '#000'), rect(PX, PX, PLATE_W, PX, '#fff4'))
  const tspans = fighter.segments.map(s => `<tspan fill="${s.hex}">${s.text}</tspan>`).join('')
  parts.push(`<text x="${2 * PX}" y="${3 * PX + 6}" font-family="monospace" font-size="11" font-weight="bold" fill="#fff">${tspans}</text>`)
  // health
  if (left === null) {
    parts.push(`<text x="${HEALTH_X}" y="16" font-family="monospace" font-size="11" fill="#889">HEALTH n/a</text>`)
  } else {
    parts.push(pixelBar(HEALTH_X, PX, W - HEALTH_X - PX, 16, left, left < 25 ? '#e03030' : '#f6d020', '#c03030'))
    parts.push(`<text x="${HEALTH_X + PX}" y="38" font-family="monospace" font-size="10" fill="#fff">${left === 0 ? 'K.O.!' : Math.round(left) + '%'} ${kindLabel(worst!.kind)} ${resetIn(worst!.resetsAt, now)}</text>`)
  }
  // stamina (weekly)
  if (weekLeft === null) {
    parts.push(`<text x="${HEALTH_X}" y="50" font-family="monospace" font-size="10" fill="#889">STAMINA n/a</text>`)
  } else {
    parts.push(pixelBar(HEALTH_X, 40, 64, 12, weekLeft, weekLeft < 25 ? '#e03030' : '#40d060', '#103020'))
    parts.push(`<text x="${HEALTH_X + 68}" y="50" font-family="monospace" font-size="10" fill="#fff">STAMINA (weekly) ${Math.round(weekLeft)}% ${resetIn(week!.resetsAt, now)}</text>`)
  }
  // super meter
  if (reading.ctxPercent !== null) {
    parts.push(pixelBar(HEALTH_X, 58, 64, 12, reading.ctxPercent, reading.ctxPercent >= 90 ? '#ff5050' : '#30c0ff', '#102040'))
    parts.push(`<text x="${HEALTH_X + 68}" y="68" font-family="monospace" font-size="10" fill="#fff">SUPER (context) ${Math.round(reading.ctxPercent)}%</text>`)
  }
  // power stars
  const lvl = effortLevel(reading.effort)
  for (let i = 0; i < 5; i++) {
    parts.push(rect(PX + i * 14, 28 + 0, 10, 10, i < lvl ? '#f0f' : '#402040'))
  }
  parts.push(`<text x="${PX}" y="56" font-family="monospace" font-size="10" fill="#e8c">POWER ${reading.effort ?? 'n/a'}</text>`)
  // per-model limits as round pips
  const extra = modelLimits(reading.limits)
  extra.forEach((l, i) => {
    parts.push(`<text x="${PX + i * 90}" y="88" font-family="monospace" font-size="10" fill="#9ab">${kindLabel(l.kind)} ${Math.round(100 - l.percentUsed)}%</text>`)
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${parts.join('')}</svg>`
}

export function Desktop({ ui, reading, now }: { ui: any; reading: Reading; now: number }) {
  const { Svg } = ui
  const left = healthLeft(healthLimit(reading.limits))
  const weekLeft = healthLeft(staminaLimit(reading.limits))
  const alt = `${fighterFor(reading.model).label}: ${left === null ? 'usage n/a' : Math.round(left) + '% health'}, ${weekLeft === null ? 'weekly n/a' : Math.round(weekLeft) + '% stamina'}, effort ${reading.effort ?? 'n/a'}`
  return <Svg source={svgSource(reading, now)} alt={alt} />
}
