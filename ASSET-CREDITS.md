# Asset credits and modification record

Keep these credits with every public copy of Fivefold and in the playable game's Settings & Credits panel. No composer or asset author endorses the game.

## Music recordings

| Local file | Recording / author | Source and license |
|---|---|---|
| asian-drums.mp3 | **Asian Drums** — Kevin MacLeod (incompetech.com) | [Original](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100396), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| western.mp3 | **Spaghetti Western Theme (Orchestral)** — Markus Lindner (linxiaoma) | [Original](https://opengameart.org/content/spaghetti-western-theme-orchestral), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| machina.mp3 | **Machina** — Scott Buckley, www.scottbuckley.com.au | [Original](https://www.scottbuckley.com.au/library/machina/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); downloaded from the [Wikimedia mirror](https://commons.wikimedia.org/wiki/File:Scott_Buckley_-_Machina.oga) |
| ai-fight.ogg | **AI Fight** — Alexander Ehlers | [Cyberpunk Pack](https://opengameart.org/content/t-t-free-cyberpunk-pack-2), [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| scarab.mp3 | **Curse of the Scarab** — Kevin MacLeod (incompetech.com) | [Original](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1600014), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| long-dark.mp3 | **The Long Dark** — Scott Buckley, www.scottbuckley.com.au | [Original](https://www.scottbuckley.com.au/library/the-long-dark/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); Royalty Free Music by [free-stock-music.com](https://www.free-stock-music.com/scott-buckley-the-long-dark.html) |
| legionnaire.mp3 | **Legionnaire (Original)** — Scott Buckley, www.scottbuckley.com.au | [Original](https://www.scottbuckley.com.au/library/legionnaire/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); [Wikimedia mirror](https://commons.wikimedia.org/wiki/File:Scott_Buckley_-_Legionnaire_(ORIGINAL_VERSION).oga) |
| old-ones.ogg | **The Old Ones** — Scott Buckley, www.scottbuckley.com.au | [Original](https://www.scottbuckley.com.au/library/the-old-ones/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); [Wikimedia mirror](https://commons.wikimedia.org/wiki/File:Scott_Buckley_-_The_Old_Ones.oga) |
| ascension.mp3 | **Ascension** — Scott Buckley, [soundcloud.com/scottbuckley](https://soundcloud.com/scottbuckley) | [Original](https://www.scottbuckley.com.au/library/ascension/); downloaded from [free-stock-music.com](https://www.free-stock-music.com/scott-buckley-ascension.html), where this recording is offered under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Royalty Free Music by free-stock-music.com. The composer's current library also offers the composition under CC BY 4.0. |

Modification record: musical content is uncut. Whole recordings loop in the media player. Runtime gain changes and approximately 2.4-second crossfades mix tracks between worlds and exploration/combat. There are no destructive loop edits. Wikimedia's supplied MP3 transcodes are used for Machina and Legionnaire; the original Ogg container of The Old Ones is renamed `.ogg` for serving. Source locations, byte lengths and SHA-256 hashes are in `assets/audio/sources.json`.

Scott Buckley's requested attribution format is: “'[Track Title]' by Scott Buckley — released under CC BY 4.0. www.scottbuckley.com.au”. For Legionnaire, use “Legionnaire (Original)”. If recording or streaming gameplay, include the applicable music credits in the video description as well.

## Character and animations

**Vanguard**, Adobe Mixamo character with authored idle/run/walk animations, distributed in the official Three.js Soldier.glb example.

- [Source](https://github.com/mrdoob/three.js/blob/r160/examples/models/gltf/Soldier.glb)
- [Mixamo usage information](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)
- Embedded as part of a playable game, not offered as a standalone character asset pack. Character materials, scale, casting and sword poses, helmets, armor and equipment are modified. Original model rights remain separate from the Three.js software license and the game's code license. Do not relicense the model or redistribute it as a standalone model product.

## Software

Three.js r160, GLTFLoader and BufferGeometryUtils: copyright 2010–2023 Three.js authors, MIT. See `THREE-LICENSE.txt`. Loader packaging was adapted for local script loading.

## Original game content

Fivefold's gameplay, UI, story, authored environment builders and procedural textures, sword/warden/drone equipment geometry, elemental effects and procedural sound effects are created by this project. Pop-culture references informed art direction only. No film soundtrack, film character, Final Fantasy model or Star Wars recording is included.


## Photographed environment materials (CC0)

1K JPEG color, OpenGL normal and roughness maps downloaded from Poly Haven:

- [Cobblestone Floor 001](https://polyhaven.com/a/cobblestone_floor_001) — Rob Tuytel.
- [Weathered Planks](https://polyhaven.com/a/weathered_planks) — Dario Barresi (processing), Dimitrios Savva (photography).
- [Brown Mud](https://polyhaven.com/a/brown_mud) — Rob Tuytel.
- [Aerial Sand](https://polyhaven.com/a/aerial_sand) — Rob Tuytel.

All four materials are [CC0](https://creativecommons.org/publicdomain/zero/1.0/). Maps are unedited; the game changes tint, tiling, normal strength and lighting. Source URLs and hashes are in `assets/textures/sources.json`. Only the current world's required materials load.
