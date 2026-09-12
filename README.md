# Fivefold: Seven Worlds

**[Play in your browser](https://nr-sbe.github.io/eq/)** · [Source repository](https://github.com/nr-sbe/eq)

A playable Three.js elemental action campaign for PC and touch browsers. Seven connected missions follow a modern swordsman through a fractured world, with unlimited casting, automatic targeting, sword combat and a consistent ink-and-storm visual style.

## Play locally

Install Python 3, open a terminal in this folder, and run:

```sh
python serve.py
```

Open **http://127.0.0.1:8768/**. Keep the terminal running. The complete folder is required; music and scripts are loaded locally as needed. Opening `index.html` directly with `file://` is not supported reliably by browser audio security rules.

For a phone on the same Wi-Fi:

```sh
python serve.py --host 0.0.0.0
```

The terminal prints your computer's LAN address. Open that address on the phone. The server serves only game assets, blocks traversal and directory listing, and supports audio range requests. Stop it with Ctrl+C. Internet hosting is optional.

## GitHub and sharing

The project is hosted in **[nr-sbe/eq](https://github.com/nr-sbe/eq)**. Share the playable address **https://nr-sbe.github.io/eq/** with PC or phone players.

The `main` branch contains the complete game source. Each push runs the tests and static build, then the included GitHub Actions workflow deploys `dist/` to GitHub Pages. Watch deployment results under the repository's **Actions** tab. Relative URLs support the `/eq/` project path. See `GITHUB.md` for updating the repository.

Retain `ASSET-CREDITS.md` and in-game credits. Recordings and the character have separate licenses from the original game code. The game has no backend, API key or third-party runtime service. Each asset is below GitHub's individual-file limit; the full download is around 100 MB, and music streams by mission.

## Controls

| Action | PC | Touch |
|---|---|---|
| Move | WASD or arrow keys | Left joystick |
| Cast selected element | Hold Space | Hold CAST |
| Area tempest | Hold E | Hold TEMPEST |
| Three-hit infused sword combo | Hold or tap C | SWORD |
| Dodge | Shift | DODGE |
| Select element | 1–5 | Element buttons |
| Cycle visible target | Tab | TARGET |
| Orbit camera | Right-drag or Q/F | Drag the world |
| Zoom / reset camera | Wheel / R | — |
| Pause | Escape | PAUSE / SETTINGS |
| Mute | M or SOUND ON | Sound settings |

Movement, camera drag and attacks own separate touch pointers, so casting does not interrupt movement. Jumping is absent. Casting has no charge, resource cost or cooldown meter; a fixed 60 Hz simulation applies sustained attacks at a consistent rate.

## Campaign

| World | Guardian | Traversal / encounter identity |
|---|---|---|
| The Ashen City | Bell Warden | Five elemental discoveries; timber streets, canals and castle roofs; polearm guardian and summoned guards |
| Dust and Iron | Iron Marshal | Dust clearance, rail-yard barricades, explosive barrels, cover and aimed volleys |
| Neon Underworld | Grid Executor | Power and coolant conduits, flying drones, shielded core and three destructible relays |
| Tomb of the Sun | Sun Colossus | Buried gates, water channels, monumental courts and sweeping beams |
| The Frostbound Citadel | Rime Jarl | Ice seals, sheltered routes, blizzards and armored charges |
| Cathedral of Cinders | Bell Engine | Poisoned foundry vents, burning routes, machinery and shockwaves |
| The Shattered Heavens | Rift Sovereign | Restored causeways, celestial conduits and combined guardian attacks |

Every mission has three multi-wave encounters, one optional mastery shrine, checkpoints and a two-phase guardian. The first mission has five discovery sequences; later missions have two elemental route challenges. Roads bend through bounded districts, with obstacle cover, side shrine routes, ramps and walkable bridges.

The first mission unlocks Fire, Air, Lightning, Water and Earth at Tier 1. Entering the next campaign world displays a level-up screen for all five elements. The HUD shows the selected power form and its actual damage multiplier, including Impact specialization. All five advance on entering each subsequent mission, reaching Tier 7. Damage multipliers are **1 / 1.2 / 1.45 / 1.75 / 2.1 / 2.5 / 3**. Successive tiers add secondary strikes, fields, control, reactions, repeated impacts and mastery forms; main effect dimensions are capped at 1.8× baseline.

Guardians in the first six worlds each award one specialization point. **Impact** adds 15% damage per rank; **Control** adds 15% area and status duration per rank. Each branch caps at three ranks. Refund and redistribute at a checkpoint outside combat or after a guardian victory.

Tier 5 introduces Conduct (water/lightning), Wildfire (burning/air), Steam (fire/water) and Molten (earth/fire). Guardians build stagger instead of being repeatedly disabled. Water heals 10 health only on a water-attributed defeat. Earth tempests give 40% damage reduction, not invulnerability.

The pacing target is 15–20 minutes per mission. The automated invulnerable traversal takes approximately 8–16 minutes per world and omits exploration, dodging, death and reading. Human first-play timing and full physical-phone performance remain unverified; see `VALIDATION.md` for measured results and limits.

The sword combo uses three authored strikes: **Crosscut → Rising Cut → Sunder**. Upper-body twists and arm poses follow the blade, with an elemental motion trail, a heavier overhead finisher and distinct swing accents. Hold C / SWORD to repeat the combo; release to recover.

Enemy health loss produces floating, element-colored damage numbers. Rapid hits on the same enemy are grouped over 0.18 seconds to reduce clutter. Values reflect health actually lost after defenses, rounded to whole numbers (minimum 1). Sword move names are not shown during combat.

## Progress, replay and demo

**New Game** starts a fresh campaign; a second click confirms replacing an existing save. **Continue** resumes the latest checkpoint. Progress saves on checkpoints, element discoveries, specializations and mission completion. Death restores the checkpoint and keeps earned progression.

**Mission Select** replays unlocked worlds without overwriting the main campaign checkpoint. **Demo Lab** independently exposes every world, tiers 1–7, encounter/boss starts, practice protection, continuous casting and sword rehearsal. The tier selector deliberately overrides normal campaign progression in Demo. Demo play never awards campaign progress.

**Export Save / Import Save** transfers a versioned JSON save between PC and phone. Saves live in the browser for that exact site address; localhost, a LAN address and GitHub Pages have different storage. Export before changing address, clearing browser data or moving to another device. Imports validate version, progress and point allocation before replacing anything.

## Settings and performance

Separate music/effects sliders, full mute, reduced flashes, touch toggle, graphics selection and a live performance display are in Pause & Settings. Automatic quality can reduce resolution, shadows and post-processing when sustained frame rate drops. Geometry is batched by material, distant districts are hidden, departed environments and enemy rigs are disposed, visual jobs are pooled, and audio is limited to two music streams and 180 effect voices.

## Development

See `GITHUB.md` for steps tailored to your repository.

Node.js 20+ runs the tests and static build; there are no npm dependencies to install.

```sh
npm test
npm run build
```

- `campaign.js`: level definitions, versioned state, deterministic combat and progression.
- `world.js`: per-mission architecture, routes, environment resources and camera collision.
- `game.js`: menus, input, saves, presentation and event dispatch.
- `character.js`: skinned character, enemy equipment, drones and animation.
- `sword-motion.js`: three-strike choreography and the bounded blade trail.
- `damage-numbers.js`: pooled health-loss feedback above enemies.
- `keyboard.js` / `touch.js`: input ownership and camera-relative movement.
- `effects.js` / `mastery-fx.js`: bounded elemental presentation.
- `audio.js`: procedural effects, ambience, streamed recordings and crossfades.
- `assets/audio/`: licensed recordings and a source/hash manifest.
- `tests/`: campaign, combat, resource lifecycle and touch regression checks.

The existing Three.js r160 pipeline is vendored locally. The game makes no runtime network requests to third-party services. The deployment build excludes development scripts and test files.
