# Tempest Walker: Storm of Ruins — 0.11.2 validation

Tested September 12, 2026. The approximately 15-minute campaign and two-minute showcase are human first-play targets, not measured human completion times.

## Automated checks

- `node --test tests/*.test.cjs`: **91 passing tests**, covering fixed simulation at 30/60/120 FPS, seven-tier damage/effects, all 30 specialization ranks, saves and migration, death, keyboard focus/taps, independent touch pointers, sword contact timing and captured element/tier, air critical consumption, wet-defeat healing, control recovery, attack budgets, cover, pylon targeting, showcase retries/ending/isolation, music transitions, asset hashes and bounded effect pools.
- `python -m unittest discover -s tests -p '*test.py'`: **2 passing server tests**. Restricted asset serving and legacy entry aliases remain; traversal and development paths are rejected.
- Static deployment build succeeds with relative asset URLs.

A normal-health driver completed all seven worlds with automatic targeting, ordinary movement and casting, without debug invulnerability or injected manual targets. Times: approximately **82, 71, 63, 65, 62, 59, 59 seconds** (about **7:41**). This omits menus, reading, exploration and human response time. The older invulnerable driver remains a separate regression fixture.

The showcase driver completed both transformations, both guardian phases, release-and-press finishing input and ending in approximately **57 simulated seconds**, preserving campaign state. Transformation retries retain the earned showcase tier.

## Browser and graphics

Inspected the preserved entry, menu, keyboard element switching, showcase, Art Deco finale, settings, and a **390 × 844** embedded phone viewport. No application errors appeared in these checks. Touch layout was inspected; simultaneous movement/cast/sword/tempest/look ownership passes the input tests.

The development browser reports **ANGLE / Intel Iris Xe / Direct3D11**. Observed snapshots were approximately **60 FPS** at 1280 × 720 in reduced and high showcase graphics, and at 761 × 791 in the high finale. A representative high showcase snapshot used about 399 draw calls / 203k triangles. These are desktop observations, not a sustained benchmark or physical-phone result.

A WebGL fixture built, rendered and disposed all seven worlds and the showcase three times: **24 transitions**. Geometry and texture counts stabilized across cycles, with departed roots removed. The fixture also renders the restored showcase sky. Pools bound elemental jobs, status accents, debris, scorch marks and temporary cover.

## Audio

All **14 full recordings decoded**. First-minute RMS measurements informed per-track trims in `assets/audio/sources.json`, alongside cue starts, sources, hashes and loop-edit records. Recordings remain uncut. Some decoded source peaks exceed 1.0; playback trims and the master compressor preserve output headroom.

Music-controller tests cover 2.5-second entry, six-second clear hold, four-second return, reversal, remembered positions, pause, missing destinations, retries, stale callbacks, repeated world changes and same-world reload. No more than two tracks are audible.

OfflineAudioContext rendered ten cases at 44.1 kHz: five powers, mute, awakening, repeated thunder, mixed powers, and mixed powers with two music cues at a crossfade midpoint. **Zero clipped samples, finite output, retired effect voices, and silent mute.** Representative peaks: fire 0.7232; thunder 0.5554; mixed powers 0.7008; mixed powers plus music 0.7037. Procedural noise causes small measurement variation.

## Remaining human acceptance

- Timed first-play campaign/showcase runs, optional content and retries.
- Subjective soundtrack pairing, loop boundaries and mix audition on speakers/headphones.
- Physical-phone multitouch, audio activation, thermal behavior and sustained 30 FPS.
- Sustained desktop frame-time profiling in the busiest scenes; actual PC-to-phone save transfer through file pickers.
- Player feedback on animation, art and balance. This is a browser action prototype/showcase, not a claim of commercial AAA production quality.

See `PLAN-CHECKLIST.md` for the implementation audit.

## Guardian terrain correction — 0.11.1

Reproduced transformed background-cliff bounds intersecting the western guardian and dune bounds intersecting the tomb guardian. The long terrain shapes now stay aligned with the road and their full transformed bounds remain outside the curved playable corridor and optional shrine court. Boss spawning, approach/retreat and charge landings use three-unit body clearance around obstacles. The player retains the original movement clearance.

Three new regression tests build the real western, cyberpunk and tomb geometry and verify clear guardian starts; test cliffs/dunes along the road and shrine; and test boss spawn and charge landings beside cover. All 83 tests pass, including the complete normal-health campaign and showcase.

## Mobile fullscreen and elemental sword — 0.11.2

Fullscreen controls are available on the home screen, HUD, and pause menu. Standard and prefixed APIs request the complete document, keeping touch controls visible. State synchronizes after browser exits; denied/unsupported requests recover and offer Home Screen guidance. The relative manifest, original icon, and Apple web-app metadata support Home Screen launches without changing save identifiers. No service worker or offline claim is added.

The sword carries the selected elemental tint even while idle, with distinct wind rings, fire tongues/embers, branching purple arcs, curling water/foam, and stone fragments. Contact bursts use confirmed hits; sword status and reaction behavior stays simulation-owned. Each swing and its fading trail retain the captured element. Enchantment pools cap at 192 instances per form and 20 contact jobs, and reset with levels/deaths.

The weapon is now parented to a palm socket on the animated right hand, with wrist alignment, curled fingers, grip-center offset, and import-scale compensation. Close-up inspection of the actual rig during idle, running, all three cuts and simultaneous offhand casting reported 0.00000000 units of grip/socket separation. Browser console checks showed no application errors.

91 Node tests and two Python server tests pass. Added tests cover native/prefixed fullscreen, external exits, rejection, repeated taps, Home Screen guidance, five distinct sword forms, bounded effects, retained trail colors, and sword-applied statuses. Desktop fullscreen entry/exit and a 390×844 embedded phone layout were checked. Physical Android/iPhone fullscreen, Home Screen installation and sustained performance remain unverified.

Fullscreen implementation references: [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API), [WebKit Home Screen web apps](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).

With several WebGL preview tabs open concurrently, a Tier 7 sword rehearsal snapshot measured 45 FPS on Intel Iris Xe at 761×791/high. This is not a single-tab sustained performance measurement; the previous 60 FPS snapshots should not be interpreted as a guarantee for the updated busiest scenes.
