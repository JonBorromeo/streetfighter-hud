import { test, expect } from 'claude-code/testing'
import { bar, fighterFor, healthLeft, resetIn, stars, worstLimit } from './model'

test('picks the most used window and flips it to health', () => {
  const w = worstLimit([
    { kind: 'five_hour', percentUsed: 23 },
    { kind: 'seven_day', percentUsed: 60 },
    { kind: 'seven_day_opus', percentUsed: 99 },
  ])
  expect(w?.kind).toBe('seven_day')
  expect(healthLeft(w)).toBe(40)
})

test('no limits means no health', () => {
  expect(healthLeft(worstLimit([]))).toBeNull()
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
