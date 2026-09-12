# Share Fivefold through nr-sbe/eq

Repository: https://github.com/nr-sbe/eq

The repository was reachable and empty when checked during this build. The supplied folder contains everything needed for a static game, including its hidden `.github` workflow folder. Nothing has been pushed or published automatically.

## Upload with GitHub Desktop

1. Extract `Fivefold-Seven-Worlds.zip`.
2. In GitHub Desktop, choose **File → Clone repository → URL**, enter `https://github.com/nr-sbe/eq`, and clone it to a folder of your choice.
3. Copy the **contents** of the extracted `fivefold-seven-worlds` folder into the cloned `eq` folder. `index.html`, `package.json`, `assets` and `.github` must be directly inside `eq`, not inside a second nested game folder. Preserve the clone's `.git` folder.
4. Review the changed files, commit as **Add Fivefold Seven Worlds campaign**, and push the `main` branch to GitHub.
5. In the repository's **Settings → Pages → Build and deployment**, choose **GitHub Actions**. The supplied workflow runs tests, creates `dist/` and deploys it. If the first run preceded this setting, rerun **Test and publish Fivefold** under Actions.
6. Open the Pages URL shown by GitHub. With the current owner and repository name, the expected address is **https://nr-sbe.github.io/eq/** after a successful deployment.

This last step makes the game available at the Pages address. Repository and account Pages availability depend on your GitHub settings. No custom domain or paid game service is required by this project.

## If you prefer Git in a terminal

Clone first, then copy the extracted contents as above:

```sh
git clone https://github.com/nr-sbe/eq.git
cd eq
```

After reviewing the files:

```sh
git switch -c main
git add .
git commit -m "Add Fivefold Seven Worlds campaign"
git push -u origin main
```

If the clone already has a `main` branch, use `git switch main` instead. If you added other repository content since this package was prepared, review and preserve it before copying files. No force push is needed.

## Keep these files

- `.github/workflows/pages.yml`: test/build/deploy workflow.
- `assets/`, `hero-asset.js`, local Three.js and all referenced game scripts.
- `ASSET-CREDITS.md`, `THREE-LICENSE.txt` and `LICENSE`: retain third-party attribution. The original-code MIT license does not relicense the recordings or character model.

The supplied `.gitignore` excludes local saves, logs, environment files and generated build output. Audio is streamed from this repository by mission; no external media host or API key is required at runtime. Browser progress is device/site-specific, so export a save before moving from localhost or a phone LAN address to GitHub Pages.

Workflow setup reference: [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
