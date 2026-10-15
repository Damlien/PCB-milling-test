# Ampoteket PCB milling — personal GitHub Pages trial

Browser-based preparation of Roland SRM-20 RML files from single-sided KiCad exports. The app uses the original Gerber2PNG conversion functions and original Mods calculation modules behind a simpler interface.

## Publish on your personal GitHub

1. Create a **public** repository, for example `pcb-milling-test`. Initialise it with a README so the `main` branch exists.
2. Extract the GitHub Pages ZIP. In the repository select **Add file → Upload files**. Upload the **contents** of the extracted folder, keeping its subfolders. `index.html` must be at the repository root. Commit the files to `main`.
3. Open **Settings → Pages**. Under Source choose **Deploy from a branch**, then **main** and **/(root)**. Save.
4. Wait for the Pages deployment to finish. The Pages settings display the live URL. It normally looks like `https://YOUR-USERNAME.github.io/pcb-milling-test/`.

Upload the extracted files, rather than the ZIP itself. No Python, build command, API key or server configuration is needed on GitHub. This folder contains only website files, example boards, licences and browser tests. The original local project and older prototypes remain separate.

GitHub instructions: [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [uploading files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## Check the live trial

Load the lab example, calculate its paths and download its RML ZIP. Check each preview. Then open `verification/` below the website's address and run the engine comparison. Open `verification/full-suite.html` to run the application regression suite. These tests do not connect to a milling machine. The hosted site needs to be tested after publishing; local test results alone do not establish hosted behaviour.

The application processes imported board files in browser memory. It has no upload endpoint or user-file storage. The hosting provider serves the application and may keep ordinary website access logs. Refreshing the app clears the current job.

## Change the trial

| Change | File |
| --- | --- |
| Appearance | styles.css |
| Screen content | screens.js and integration.js |
| Defaults and cutter choices | app.js and screens.js |
| Input validation and hole summaries | import-validation.js |
| File import and preview | integration.js |
| Calculation orchestration and ZIP output | cam.js |
| Original Mods control adapter | engines/mods-host.js |

Saving changes to `main` republishes the site. The conversion bundle and engine graph are prebuilt. Rebuilding those from source uses the complete development workspace, retained separately, and its `working/scripts/build.py`. This deployment folder is a ready-to-run trial, not a complete engine build environment. Preserve THIRD_PARTY.md and the licence files.

## Scope

This is an early working build for one outer copper layer, a matching outline and round Excellon holes. Slots and inner layers are rejected. Example cutting values have not been physically validated on the lab equipment. The red isolation bit remains selectable for holes with a taper warning. Software comparisons do not establish physical milling accuracy or electrical isolation of every board.
