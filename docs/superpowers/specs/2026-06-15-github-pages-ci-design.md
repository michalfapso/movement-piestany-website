# GitHub Pages CI/CD — Design Spec

**Date:** 2026-06-15
**Repo:** michalfapso/movement-piestany-website
**Target URL:** https://michalfapso.github.io/movement-piestany-website/

## Overview

Add a GitHub Actions workflow that builds the Astro static site and deploys it to GitHub Pages automatically on every push to `main`, and also on manual trigger via the GitHub Actions UI.

## Changes

### 1. `astro.config.mjs`

Add `site` and `base` so Astro generates correct absolute asset paths for the subdirectory deployment:

```js
site: 'https://michalfapso.github.io',
base: '/movement-piestany-website',
```

### 2. `.github/workflows/deploy.yml`

New workflow file. Triggers:
- `push` to `main` — automatic deployment on every merge
- `workflow_dispatch` — manual trigger from the GitHub Actions UI

Uses `withastro/action@v3` (Astro's official action) with Node 20. Requires three GitHub Pages permissions: `pages: write`, `id-token: write`, `contents: read`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        id: deployment
        with:
          node-version: 20
```

### 3. GitHub Pages settings (manual, one-time)

In the repo → **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. This must be set before the first deployment will succeed.

## Out of Scope

- Custom domain configuration
- Preview deployments for PRs
- Caching of `node_modules` (handled internally by `withastro/action`)
