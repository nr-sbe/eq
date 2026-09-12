# Approved-plan implementation audit

The shared campaign upgrades and separate playable prototype are both included. World seven also incorporates the later NYC / Art Deco request. Human acceptance limits are in `VALIDATION.md`.

| Plan item | Included implementation |
|---|---|
| Branding and compatibility | Tempest Walker: Storm of Ruins title/tab/menus/docs/credits/package; existing repository, URL, legacy entry aliases and browser-save keys retained. |
| Short campaign and complete progression | Seven compact worlds, all five discoveries, seven tiers and 30 specialization ranks obtainable before the finale. |
| Remove dodge | No touch button, Shift action, dash state, animation or dodge invulnerability. Movement remains 13 units/second during attacks; ordinary damage recovery and checkpoint healing remain. |
| Forgiving offense | Two ordinary windups maximum, one during guardian major attacks; minimum 0.9/1.2-second warnings and committed aim. |
| Sword | Three active-window swept strikes, one hit per target, captured element/tier/specification, held combos, interruption/recovery, torso motion, contact effects/audio, local animation holds and simultaneous offhand casting. |
| Air | Random criticals plus one nonstacking, three-second guaranteed critical cast after a confirmed sword finisher. |
| Fire | Burns, defeat chains, directional eruptions, smoldering/embers and temporary scorch marks. |
| Lightning | Hand/sky effects, thunder, paralysis poses/arcs, wet chains and guardian stagger. |
| Water | Curling waves, whitewater, undertow and wet marks; marked defeats heal 10 with any finishing element, once per enemy. |
| Earth | Interrupts, broken defenses, temporary 40% protection and projectile/beam cover without sealing walking routes. |
| Reactions | Available from discovery, strengthened by tiers; one-second ordinary control recovery; guardians build stagger. |
| Character and scenery presentation | Licensed rig, darker materials, role equipment and animations, recoils/deaths, weakness colors/symbols, cloth, debris, surface marks, lighting and bounded effects; existing 1.8× power-size ceiling retained. |
| Camera and warning mix | Automatic target/pylon framing, manual-input yield, collision, guardian spacing, occluding-enemy fade, offscreen arrows, warning tones and music ducking. |
| Music throughout | Fourteen recordings form seven exploration/combat pairs; showcase shares Ashen City's pair. Five new licensed battle recordings and full credits included. |
| Music transitions | Shared resumable equal-power fades, clear delay, reversal, readiness/failure handling, pause/mute/volume, stale-callback guards and bounded audible tracks. |
| Ashen City interaction | Flooded courtyard marks foes wet for gathering, conduction and fire chains. |
| Old West interaction | Air-cleared railway ambush, moving freight cover and explosive barrels, without damaging train collisions. |
| Cyberpunk interaction | Lightning restores district power and exposes local shield units. |
| Egyptian interaction | Warned sun beam and designated earth-raised shield, with safe flanks. |
| Frozen interaction | Fire removes the shelter seal and suppresses blizzard exposure; warned guardian fractures. |
| Gothic interaction | Air vents pressure, then Water suppresses furnace eruptions. |
| Finale interaction | Safe rotating water, beam and temporary-cover states plus combined guardian attack patterns. |
| NYC-inspired Art Deco finale | The Shattered Metropolis replaces floating ruins: stepped towers, gilded entrances, sunbursts, elevated rail and Meridian Tower. Seven-world count preserved. |
| Grid Executor pylons | Forward arc (-7,-18), (0,-12), (7,-18), clear exclusion area, walk-surface grounding, generous cores, unified 32-unit range, pylon priority/retargeting, connections and count. |
| Separate Ashen City showcase | Main-menu entry, lazy-loaded bespoke rain garden/courtyard, Tier 1→4→7 by objectives, maximum ranks, two-phase Warden, explicit finishing input, restored dawn vista, replay/menu ending and transformation retries. |
| Saves and modes | Explicit campaign/replay/demo/showcase modes, version-two migration with original key, export/import, and isolated demo/showcase progression. |
| Static sharing | Existing GitHub Pages workflow, restricted phone server and complete renamed downloadable folder with source, credits and tests. |

The art and environmental interactions are original procedural implementations within the existing Three.js pipeline. The prototype is accessible separately from the main menu and never overwrites campaign progress.
