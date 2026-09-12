# Fivefold on GitHub

- Play: **https://nr-sbe.github.io/eq/**
- Repository: **https://github.com/nr-sbe/eq**
- Build and deployment history: **https://github.com/nr-sbe/eq/actions**

The complete game is on the repository's `main` branch. GitHub Pages uses the included **Test and publish Fivefold** Actions workflow. A push to `main` runs the tests, creates `dist/`, and deploys the site when checks pass.

## Update the game

Use the existing local checkout, or clone the repository with GitHub Desktop or:

```sh
git clone https://github.com/nr-sbe/eq.git
cd eq
```

After editing, run `npm test` and `npm run build` with Node.js 20 or later. Preview locally with `python serve.py`. Review and commit your changes, then push `main`. Check Actions until the deployment succeeds before sharing a new version. No force push is needed.

The supplied `.gitignore` excludes generated builds, local saves, logs and environment files. Keep `.github/workflows/pages.yml`, `assets/`, the referenced game scripts and all license/credit files. The MIT license for original code does not relicense the recordings or character model.

Progress lives in each browser for its site address. Export a local save before switching from localhost or the phone's LAN address to GitHub Pages, then import it using Pause & Settings on the published game.

## Deployment settings

Under **Settings → Pages → Build and deployment**, the source is **GitHub Actions**. The deployment workflow uploads only the generated game assets. Server source, tests and development scripts are not included in the playable site.

[GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
