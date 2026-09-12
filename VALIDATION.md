# Tempest Walker: Storm of Ruins — 0.11.0 validation

Tested September 12, 2026. The approximately 15-minute campaign and two-minute showcase are human first-play targets, not measured human completion times.

## Automated checks

- `node --test tests/*.test.cjs`: **80 passing tests**, covering fixed simulation at 30/60/120 FPS, seven-tier damage/effects, all 30 specialization ranks, saves and migration, death, keyboard focus/taps, independent touch pointers, sword contact timing and captured element/tier, air critical consumption, wet-defeat healing, control recovery, attack budgets, cover, pylon targeting, showcase retries/ending/isolation, music transitions, asset hashes and bounded effect pools.
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
