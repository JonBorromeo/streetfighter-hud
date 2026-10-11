# streetfighter-hud

A Street Fighter style HUD above the Claude Code prompt.
## RYU as Opus
<img width="1405" height="210" alt="image" src="https://github.com/user-attachments/assets/b996baa6-7293-4f95-9cfb-2dfa78f3d3f0" />


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

### Install

In the Claude Code CLI, run:

```
/plugin marketplace add JonBorromeo/streetfighter-hud
/plugin install streetfighter-hud@streetfighter-hud
```

The HUD loads the next time the session starts. On Windows Desktop, see the section below.

### Try it from a local clone (development)

1. Clone this repo, e.g. to `~/streetfighter-hud`.
2. Start the CLI with the plugin loaded:

   ```sh
   claude --plugin-dir ~/streetfighter-hud
   ```

### Using it

The HUD appears above the prompt. It refreshes when a session starts and at the start and end of each turn, so it stays current as you work.

### Windows Desktop

The Claude Code Desktop app has no `--plugin-dir` flag, and plugins don't load in WSL sessions. Install it through a local marketplace on the Windows drive instead.

Requires Claude Code v2.1.286 or later in Desktop (check with `/status`). Use the **Code** tab, not a WSL session.

1. Clone the repo on Windows, not from a `\\wsl$` path:

   ```
   git clone <repo-url> C:\Users\<you>\plugins\streetfighter-marketplace\streetfighter-hud
   ```

2. Create `C:\Users\<you>\plugins\streetfighter-marketplace\.claude-plugin\marketplace.json`:

   ```json
   {
     "name": "local-mods",
     "owner": { "name": "<your name>" },
     "plugins": [
       { "name": "streetfighter-hud", "source": "./streetfighter-hud" }
     ]
   }
   ```

3. From a Windows terminal, validate and install:

   ```
   claude plugin validate C:\Users\<you>\plugins\streetfighter-marketplace\streetfighter-hud
   claude plugin marketplace add C:\Users\<you>\plugins\streetfighter-marketplace --scope user
   claude plugin install streetfighter-hud@local-mods --scope user
   ```

4. In Desktop, open **+ > Plugins > Manage plugins** and confirm the plugin is enabled, or run `/reload-plugins`. The HUD appears above the prompt.

If the plugin doesn't show up in Desktop, add this to `%USERPROFILE%\.claude\settings.json` instead of relying on the marketplace (escape backslashes in JSON):

```json
{
  "extraKnownMarketplaces": {
    "local-mods": {
      "source": { "source": "directory", "path": "C:\\Users\\<you>\\plugins\\streetfighter-marketplace" }
    }
  },
  "enabledPlugins": {
    "streetfighter-hud@local-mods": true
  }
}
```

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
