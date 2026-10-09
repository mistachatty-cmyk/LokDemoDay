# LOK Demo Day

The playable Demo Day site for [Survivor 616](https://github.com/mistachatty-cmyk/Loksurvivor) and [Kinetic Souls](https://github.com/mistachatty-cmyk/Kinetic-Souls). Both games stay in their own repositories. This repository pins specific commits of each as Git submodules and deploys the combined site to Vercel.

## Layout

- `site/` — Demo Day landing page and in-page game switcher.
- `games/survivor-616/` — pinned Survivor 616 source (submodule).
- `games/kinetic-souls/` — pinned Kinetic Souls source (submodule).
- `scripts/build.mjs` — builds each game in its own pnpm workspace, then assembles `dist/`.

Survivor 616 is available at `/games/survivor-616/`, Kinetic Souls at `/games/kinetic-souls/`, and Survivor's page takeover bundle at `/demoday.js`. The landing page loads each game inside its own frame so switching games stops the previous game's loop and sound.

## Local build

Use Node.js 22 or newer and clone with the submodules:

```sh
git clone --recurse-submodules https://github.com/mistachatty-cmyk/LokDemoDay.git
cd LokDemoDay
npm ci
npm run build
```

For an existing clone, run `git submodule update --init --recursive` before building. The build writes the deployable site to `dist/`. Serve `dist/` with a static web server; opening the HTML file directly will not resolve game URLs.
The build also checks that both game entry points and their referenced static assets exist under the deploy paths.

The full build currently runs on Linux, including GitHub Actions and Vercel. Kinetic Souls' upstream workspace uses a shell preinstall step and excludes the Windows native Rollup package, so a native Windows build needs those upstream settings adjusted first.

## Updating the games

Keep gameplay changes in the game repositories. Dependabot checks the submodules weekly and opens a PR when their `main` branches advance. The PR runs the full build and gets a Vercel preview. Test both games and the page takeover in that preview, then merge to update production.

To update a game immediately:

```sh
git submodule update --remote --depth 1 games/survivor-616
git submodule update --remote --depth 1 games/kinetic-souls
git add games
git commit -m "Update Demo Day game versions"
```

Open a PR with that commit so the build and preview can be checked before merging. The exact game commits deployed are recorded in `/build.json`.

## Vercel

Import **this repository** as one Vercel project, keep Root Directory at `/`, and use `main` as the production branch. `vercel.json` supplies the install command, build command, and `dist` output directory. Vercel can fetch these public HTTPS submodules. Connect a production domain only after the preview build and the three play paths work.

If reusing an existing Vercel project, change its connected Git repository to `mistachatty-cmyk/LokDemoDay` in Project Settings → Git after verifying the preview.

## Integration notes

- Kinetic Souls requires `PORT` and `BASE_PATH` even during a production Vite build. The build script supplies those variables.
- Survivor 616 uses some root-relative public media URLs. The build script mirrors its public media and Demo Day bundle at the site root for compatibility.
- Survivor's page takeover currently sends completed runs to `https://gsix.online/games/demoday/report`. Update that URL in the Survivor repo if the report page moves to this site.
