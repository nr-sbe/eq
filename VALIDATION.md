# Fivefold: Seven Worlds — build 0.9 validation

Tested locally on September 12, 2026. This is a playable campaign prototype, not a claim of finished commercial AAA production quality.

## Automated checks

`node --test tests/*.test.cjs` passes all **47 reported tests**, including an effects suite with 12 internal checks and a touch suite with 7 internal checks. `python -m unittest discover -s tests -p '*test.py'` passes both server checks. The equivalent Node command is available as `npm test` on a standard Node installation.

- Campaign: five discoveries, all seven missions, all encounters and route gates, guardian phase changes, Grid Executor relays, mission transitions and the final ending.
- Progress: save serialization/reload, invalid import rejection, checkpoint death recovery, retained discoveries, 30 specialization points, rank limits, refunds and Demo isolation.
- Combat: identical sustained damage, sword combo and movement at simulated 30/60/120 FPS; seven damage multipliers; all four Tier 5 reactions; boss stagger; water kill healing and earth's 40% protection.
- Keyboard: screen-relative WASD/arrows at four camera orientations; independent held movement/attacks; one action per dodge/target/switch press; numeric keypad; native menu controls; Escape from settings fields; focus-loss cleanup; no stuck inputs after pause; brief taps retained across 120 FPS simulation boundaries. Browser shortcuts and editable fields do not cast.
- Touch: simultaneous movement/cast/tempest/sword, independent look pointer, cancellation/lost capture, target/dodge and reset behavior.
- Rendering: finite vertices across all seven tiers, bounded lightning buffer, correct hand origins, wave/earth resource reuse, reset cleanup, 180 simulated seconds of sustained Tier 7 combat with bounded fields and warnings.
- Distribution: all nine full soundtrack files and twelve PBR maps match source SHA-256 manifests; entry scripts resolve locally.

The automated campaign driver is invulnerable, chooses suitable powers and targets, uses Upgrade All after each guardian, and omits optional shrines, reading and exploration. Its times are:

| Mission | Simulated traversal |
|---|---:|
| The Ashen City | 1:47 |
| Dust and Iron | 1:28 |
| Neon Underworld | 1:22 |
| Tomb of the Sun | 1:20 |
| The Frostbound Citadel | 1:18 |
| Cathedral of Cinders | 1:12 |
| The Shattered Heavens | 1:13 |
| Total | 9:40 |

Build 0.9 retains the target of **about 15 minutes for all seven missions combined**. Routes are approximately half their previous length, each encounter has one wave, and enemy, gate and guardian health is reduced. All five discoveries, three encounters per world, two-phase guardians, progression and optional shrines remain. Group attacks and upgraded specializations bring the automated main route to 9:40; reading, upgrades, exploration and retries add time. This establishes mechanical reachability, not a measured human playthrough. A regression check caps the automated main route at 14 minutes and each mission at three minutes. Existing version-one saves were tested at all 42 world/checkpoint combinations, preserving unlocks, completed encounters, upgrades and historical time while mapping to the new checkpoint positions.

Additional progression/sword checks cover all 35 element/tier damage combinations, specialization multipliers, retained tiers after guardian completion and death, unique sword trajectories, combo reset, and 6,000 trail updates with bounded geometry. The effects test checks increasing rendered flame/gust counts and water/earth geometry scale. An isolated in-memory save fixture also exercised the real Continue-to-next-world UI: all five elements changed from Tier 1 / 100% to Tier 2 / 120%, with the new-power screen visible. This fixture did not modify the player's campaign save.

The new sword animation was inspected in the live Demo rehearsal, including its selected-element trail. The move-name labels were subsequently removed at the player's request. Floating damage numbers were added and inspected in combat. Four additional checks cover shield-adjusted health loss, killing-blow clamping, immune guardians, relay/periodic damage, short-window aggregation, pause/expiry and the 48-label pool.

The performance observations below predate the compact 0.8 layouts and final sword and damage-number polish; the trail adds one pooled mesh of at most 138 triangles and the numbers use up to 48 reused DOM labels. Their lifecycles are tested, but no new controlled performance benchmark is claimed.

Build 0.9 adds eight checks covering full mastery in one run, retroactive points on older saves, street-wide sequential crystal discovery, all 35 element/tier combinations hitting groups, free aim and tempest coverage, no duplicate direct/chain damage, elemental weaknesses on spells and sword attacks, retained shield/relay protection, and group combat at 30/60/120 FPS. A further effect check confirms visible lightning branches terminate at affected enemy positions while staying within the existing 620-segment buffer. Weakness and group attacks shorten combat; the approximately 15-minute human target is not a measured human result.

## Browser and keyboard checks

Build 0.9 browser checks showed simultaneous damage numbers on multiple enemies, visible target weakness labels, and branching lightning without console errors. An isolated in-memory save at the final world exposed all 30 points; one Upgrade All click set Impact and Control to 3/3 for all five elements and changed the displayed base-plus-specialization power from 300% to 435%. The fixture did not modify the player's saved campaign.

Loaded the preserved `Fivefold-3D.html` entry and all seven worlds in the local Chromium-based in-app browser. Inspected startup, menus, elemental art, enemies, guardian arenas and level transitions. The final city and western PBR scenes showed no console errors. Continue resumed the saved first checkpoint after reload.

Exercised physical browser key events for movement, 3/4 element selection, Space, E, C, Tab, Shift+D and Escape. Confirmed selected-element UI changes and gameplay effects, and that Escape returns from a focused graphics selector to the game. The automated input-to-simulation checks provide the longer hold/release and frame-rate comparisons.

Corrections made during verification: reversed lateral movement, lost one-frame dash/target inputs at high refresh rates, short attack taps, Escape repeat toggling, Escape blocked by settings fields, and stale pointer/key holds after focus loss. Completion panels now remain available instead of Escape dismissing a finished mission into inactive gameplay.

Phone menu layouts were inspected at 390×844 portrait and 844×390 landscape using a browser-sized preview. Landscape menus scroll when needed. These are layout checks, not physical touchscreen or device-performance measurements. Multitouch ownership is covered separately by the automated tests.

## Performance observations

Hardware: Windows laptop, **Intel Core i7-13700H**. Both an NVIDIA RTX 4070 Laptop GPU and Intel Iris Xe are installed; the tested browser actually used **ANGLE / Intel Iris Xe / Direct3D 11**. Do not attribute these measurements to the RTX 4070.

Earlier long-route material build, 761×791 browser viewport, in-game one-second counters after loading:

| Scene | Quality | Observed FPS | Draw calls | Triangles | GPU geometries / textures |
|---|---|---:|---:|---:|---:|
| Ashen City opening | High | 60 | 107 | 59k | 80 / 15 |
| Celestial encounter, clustered enemies | High | about 44–47 | 1,084 | 421k | 548 / 29 |
| Celestial encounter, no active player effect | Reduced | 60 | 471 | 203k | 548 / 26 |
| Tier 7 water, continuous casting | Reduced | 60 | 407 | 971k | 392 / 19 |
| Tier 7 water, continuous casting | High | 56 | 645 | 1,076k | 363 / 21 |
| Western guardian arena after leaving water scene | High | 60 | 110 | 77k | 123 / 20 |

Enemy counts change during combat, so these are live observations, not controlled GPU benchmarks or percentile frame-time measurements. Initial shader/asset compilation can dip below steady-state rates. Earlier 1280×720 opening checks reached 60 FPS before the final photographed material pass; that earlier result is not a final-build 1280×720 benchmark.

Resource counts decreased after departing a busy world. Tier 7 water used five pooled visual jobs, approximately six accents, 10–11 audio voices and one music stream in the observed scene. Transitions briefly use two music streams for crossfading. The visual/combat tests separately stress queue limits and reset behavior. An hours-long heap profile has not been performed.

**The 60 FPS high-quality target is not met in every tested scene on Iris Xe.** Reduced quality reached 60 FPS in the sampled combat scenes. **30 FPS on a representative physical phone remains unverified.**

## Audio checks

The browser audio harness rendered seven seconds of repeated effects into stereo OfflineAudioContext at 44.1 kHz. Default effects gains were used; all samples were finite, no samples clipped, mute was silent, and scheduled voices retired. Representative randomized synthesis results:

| Sound | Peak amplitude | RMS | Clipped samples |
|---|---:|---:|---:|
| Air | 0.4983 | 0.0566 | 0 |
| Fire | 0.6860 | 0.0832 | 0 |
| Lightning | 0.6281 | 0.1034 | 0 |
| Water | 0.6986 | 0.0931 | 0 |
| Earth | 0.7219 | 0.0865 | 0 |
| Orb awakening | 0.0983 | 0.0087 | 0 |
| Repeated thunder | 0.6194 | 0.1051 | 0 |
| Muted | 0 | 0 | 0 |

All nine recordings decoded successfully as stereo: Asian Drums 138.55 s, Western 172.39 s, Machina 290.90 s, AI Fight 268.01 s, Scarab 327.24 s, The Long Dark 439.79 s, Legionnaire 184.00 s, The Old Ones 302.07 s and Ascension 371.25 s. Runtime stream counts were checked through world transitions.

The offline peak test covers effects separately from music. Full music-plus-effects loudness, perceptual soundtrack fit, every loop seam and phone-speaker listening still require auditioning. Selection and attribution records are in `ASSET-CREDITS.md`.

To rerun the optional browser audio harness, run `python -m http.server 8770 --bind 127.0.0.1` in this project and open `http://127.0.0.1:8770/tests/audio-check.html`. This development server is separate from the restricted phone server, which intentionally blocks test files.

## Serving and GitHub

The restricted phone server returned 200 for the entry, campaign script and music, 206 with correct Content-Range for an audio byte request, and 404 for traversal attempts, dotfiles and server source. It serves the game folder only.

`node scripts/build.cjs` produces a static `dist/` with relative assets, suitable for a GitHub Pages project path. The release includes a Pages workflow, original-code license, third-party credits and asset manifests. The supplied repository `https://github.com/nr-sbe/eq` was reachable and had no refs when inspected. No GitHub push or public Pages deployment was performed during this build.

The built `dist/index.html` was also loaded under a nested local URL; Demo Lab, keyboard element switching, casting and Escape worked with no browser console errors. This checks project-relative asset loading but is not a live GitHub Actions deployment test.

## Remaining acceptance work

Publication follow-up: the game has now been pushed to [nr-sbe/eq](https://github.com/nr-sbe/eq), and [GitHub Actions run 34673896279](https://github.com/nr-sbe/eq/actions/runs/34673896279) passed tests, build and deployment. The playable site is **https://nr-sbe.github.io/eq/**. Public checks returned HTTP 200 for the entry page, campaign/damage scripts, character asset, a photographed texture and the first mission's recording. The published game also loaded in the browser and its Demo controls were exercised without console errors. The earlier statements about local-only validation describe the pre-publication build phase.

- A full human campaign playthrough, including optional shrines and cinematic-action difficulty tuning.
- Human timing and iteration toward approximately 15 minutes for the entire seven-world campaign.
- Real PC-to-phone save-file transfer through browser file pickers; serialization/import validation itself passes tests.
- Physical phone multitouch, thermal/sustained FPS and browser audio behavior.
- Longer camera/targeting edge-case and memory profiling runs.
- Listening to soundtrack balance, loop seams and the combined effects mix in every setting.
- Further art, environment variety and animation polish toward the requested modern action-game presentation.
