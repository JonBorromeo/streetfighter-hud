# streetfighter-hud

A Street Fighter style HUD above the Claude Code prompt, in the spirit of minecraft-hud.

_Last updated: 2026-10-10_

| Reading | HUD |
|---|---|
| Model | Your fighter (RYU = Opus, KEN = Sonnet, CHUN-LI = Haiku) |
| Usage (5h / 7d, whichever is more used) | Health bar, KO at 0, reset countdown |
| Context window | SUPER (context) meter |
| Effort | POWER stars |
| Extra per-model limits, when reported | Small readouts |

Terminal: block-character bars. Desktop / VS Code: pixel-art SVG. All art is original; no Capcom assets.

## Usage

1. Clone this repo, e.g. to `~/streetfighter-hud`.
2. Start Claude Code with the plugin loaded:

   ```sh
   claude --plugin-dir ~/streetfighter-hud
   ```

3. The HUD appears above the prompt. It refreshes when a session starts and at the start and end of each turn, so it stays current as you work.

### Reading the HUD

- **Fighter name**: the model you're running. Switch models with `/model` and the fighter changes.
  - `RYU (Opus)`: white, with a red Y
  - `KEN (Sonnet)`: red
  - `CHUN-LI (Haiku)`: blue
  - `ROOKIE`: any other model
- **Health bar**: how much of your usage limit is left, using whichever window (5h, 7d, spend limit) is most used. It turns red under 25% and shows `KO!` at 0, along with the window name and a reset countdown (e.g. `5H 2h10m`). Shows `HEALTH n/a` if no usage data is available.
- **SUPER (context)**: how full the context window is. It turns red at 90% or more.
- **POWER**: the current effort level, as five stars (low, medium, high, xhigh, max), or `n/a` if none is set.
- **Small readouts**: per-model limits (e.g. a weekly Opus limit) show their remaining percentage, when your account reports them.

The HUD is hidden while a survey is shown.
