import { test, expect } from 'claude-code/testing'
import { bar, fighterFor, healthLeft, healthLimit, isKo, resetIn, staminaLimit, stars } from './model'

const limits = [
  { kind: 'five_hour', percentUsed: 23 },
  { kind: 'seven_day', percentUsed: 60 },
  { kind: 'seven_day_opus', percentUsed: 99 },
]

test('health comes from the 5h window and stamina from the weekly one', () => {
  const h = healthLimit(limits)
  expect(h?.kind).toBe('five_hour')
  expect(healthLeft(h)).toBe(77)
  const s = staminaLimit(limits)
  expect(s?.kind).toBe('seven_day')
  expect(healthLeft(s)).toBe(40)
})

test('no limits means no health or stamina', () => {
  expect(healthLeft(healthLimit([]))).toBeNull()
  expect(staminaLimit([{ kind: 'five_hour', percentUsed: 10 }])).toBeNull()
})

test('KO when either window is empty', () => {
  expect(isKo(50, 0)).toBe(true)
  expect(isKo(0, 50)).toBe(true)
  expect(isKo(50, null)).toBe(false)
})

test('bars, stars, fighters and countdowns', () => {
  expect(bar(50, 10)).toBe('█████░░░░░')
  expect(stars('high')).toBe('★★★☆☆')
  expect(stars(null)).toBe('☆☆☆☆☆')
  expect(fighterFor('claude-opus-5-5').label).toBe('RYU (Opus)')
  expect(fighterFor('claude-opus-5-5').segments[1]).toMatchObject({ text: 'Y', color: 'red' })
  expect(fighterFor('claude-sonnet-5-5')).toMatchObject({ label: 'KEN (Sonnet)', color: 'red' })
  expect(fighterFor('claude-haiku-5-5')).toMatchObject({ label: 'CHUN-LI (Haiku)', color: 'blue' })
  expect(fighterFor('mystery').name).toBe('ROOKIE')
  expect(resetIn('2026-01-01T02:10:00Z', Date.parse('2026-01-01T00:00:00Z'))).toBe('2h10m')
})
