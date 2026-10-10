import type { Reading } from '../types'
import { bar, fighterFor, healthLeft, kindLabel, modelLimits, resetIn, stars, worstLimit } from './model'

export function Terminal({ ui, reading, now }: { ui: any; reading: Reading; now: number }) {
  const { Box, Text } = ui
  const fighter = fighterFor(reading.model)
  const worst = worstLimit(reading.limits)
  const left = healthLeft(worst)
  const isKo = left === 0
  const extra = modelLimits(reading.limits)

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" paddingX={1}>
      <Box>
        {fighter.segments.map((seg, i) => (
          <Text key={i} bold color={seg.color}>{seg.text}</Text>
        ))}
        <Text> </Text>
        {left === null ? (
          <Text dimColor>HEALTH n/a </Text>
        ) : (
          <Text>
            <Text color={isKo ? 'red' : left < 25 ? 'red' : 'yellow'}>[{bar(left, 20)}]</Text>
            <Text bold> {isKo ? 'KO!' : `${Math.round(left)}%`}</Text>
            <Text dimColor> {kindLabel(worst!.kind)} {resetIn(worst!.resetsAt, now)}</Text>
          </Text>
        )}
      </Box>
      <Box>
        {reading.ctxPercent !== null && (
          <Text color={reading.ctxPercent >= 90 ? 'red' : 'cyan'}>
            SUPER (context) [{bar(reading.ctxPercent, 10)}] {Math.round(reading.ctxPercent)}%{'  '}
          </Text>
        )}
        <Text color="magenta">POWER {stars(reading.effort)} {reading.effort ?? 'n/a'}</Text>
        {extra.map(l => (
          <Text key={l.kind} dimColor>  {kindLabel(l.kind)} {Math.round(100 - l.percentUsed)}%</Text>
        ))}
      </Box>
    </Box>
  )
}
