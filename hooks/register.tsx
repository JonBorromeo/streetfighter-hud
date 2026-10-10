import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Reading } from '../types'
import { Desktop } from './desktop'
import { Terminal } from './terminal'

const hud = atom({ plugin: 'streetfighter-hud', key: 'reading' } as const, null)

let effort: string | null = null

async function refresh($: any) {
  const usage = await $.session.usage()
  const reading: Reading = {
    model: await $.session.model(),
    effort,
    ctxPercent: usage.context.percent ?? null,
    limits: usage.rateLimits,
  }
  await update($, hud, () => reading)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  // The step carries the model and effort the request is really sent with.
  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) {
      effort = typeof e.effort === 'number' ? String(e.effort) : (e.effort ?? null)
    }
    return yield* next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await refresh($)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const reading = await read($, hud)
    if (e.props.hasSurvey || reading === null) return next(e)

    const ui = $.ui.resolve(e)
    const now = await $.clock.now()
    return e.surface === 'terminal'
      ? Terminal({ ui, reading, now })
      : 'Svg' in ui
        ? Desktop({ ui, reading, now })
        : next(e)
  })
}
