# Taking over the website

This is the starting point for the next person looking after Ampoteket PCB milling. Everyday use of the application requires no programming. This document covers access, small updates, checking changes and restoring the site. More involved calculation changes have a separate boundary explained below.

Last checked: **15 October 2026**. Application reference: commit `fa044505e9a435f6b38856b7c404bd2bf106d058`.

## 1. Find the site and its files

| Item | Current location |
| --- | --- |
| Working website | [Open PCB milling](https://damlien.github.io/PCB-milling-test/) |
| Repository — the website files and their saved history | [Damlien/PCB-milling-test](https://github.com/Damlien/PCB-milling-test) |
| Published branch | `main` |
| Publishing folder | Repository root, shown as `/(root)` in Pages settings |
| Publication status | [Actions](https://github.com/Damlien/PCB-milling-test/actions) — look for **pages build and deployment** |
| Application checks | [Run application tests](https://damlien.github.io/PCB-milling-test/verification/full-suite.html) |
| Engine comparison checks | [Run engine checks](https://damlien.github.io/PCB-milling-test/verification/) |

The current site uses GitHub Pages. It serves the files in this repository. There is no separate application server, database or paid application service to maintain. The app's converter and calculation files are bundled with the site; visitors do not need the original Gerber2PNG or Mods website open.

**Taking over access:** confirm that your own GitHub account can edit the repository. The repository owner manages that access. An account with repository administration access is needed to change Pages settings or manage access. Record the current lab contact and who can grant access in the lab's normal handover records. Before the current owner leaves, make sure access does not depend on one departing student's account. An Ampoteket-owned GitHub organisation is a possible future home; no transfer is required to use the current site.

## 2. Check that the current copy works

This is a software check; it does not run the machine.

1. Open the website in a fresh tab. Open **Plan the cuts** and **Review & mill** without importing anything. Both should open; calculation should be unavailable without board files.
2. Return to **Board files** and select **Load lab cutter example**. This is a small battery–resistor–LED board with six 3 mm holes.
3. Open **Plan the cuts**. The lab stock should show 1.64 mm total thickness. The red isolation tool and purple 2 mm cutter should be named by their full model numbers.
4. Open **Review & mill** and calculate. Inspect the copper, hole and outline previews. Download the RML ZIP. With all three operations selected, it should contain the three RML files and `job-settings.json` described in the [overview](../README.md).
5. Change a cutting setting. The previous machine-file download must become unavailable until calculation is repeated.

To check more cases, open **Run application tests** above and press its run button. The navigation revision passed **43 tests**. Read any failed case before changing code: the failure may describe an unsupported input rather than a broken host. The engine comparison is useful after changes to conversion, settings mapping or engine files. Neither test page establishes that a physical PCB will mill correctly.

## 3. Make a small documentation change

For example, correct a sentence in this handover guide. A **commit** is a saved change in the repository's history.

1. Open the relevant `.md` file in the GitHub repository. Markdown is plain text with headings, lists and links.
2. Select the pencil icon to edit. Change the sentence and use **Preview** to check it.
3. Select **Commit changes** and write a useful message, such as “Clarify the example-board check”. A direct commit to `main` republishes this site. For a change you want to review first, choose a new branch instead; that is a separate working copy and does not replace the live site until merged into `main`.
4. Open **Actions** and wait for the matching Pages deployment to finish successfully. Refresh the changed page and follow any links you edited.

For a documentation-only change, checking the rendered document and its links is sufficient. The milling tests do not need to be repeated for a spelling correction.

Official references: [editing files](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files), [publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 4. Find the right place for other changes

| Change wanted | Files involved | Check afterwards |
| --- | --- | --- |
| README or handover wording | `README.md`, `docs/` | Read the rendered document and follow its links. |
| Colour, spacing or font size | `styles.css` | Inspect the affected page at desktop and narrow widths. |
| Application explanations and labels | `screens.js`, `integration.js`; some labels are in `app.js` | Read the changed screen and click its controls. These files contain JavaScript and HTML strings, so preserve their quotes and brackets. |
| Saved stock, cutter options or example cutting values | `app.js`, `screens.js`; tool-to-calculation mapping is in `cam.js` | Check every affected operation and run the application suite. Update the guide/reference values at the same time. |
| A new sample board | `samples/`; each sample has `files.json`, listing its input filenames | Import the actual exports, inspect orientation and calculate all intended operations. |
| Gerber/drill rejection or file identification | `import-validation.js`, `integration.js` | Run application tests and add a case for the input being changed. |
| Machine-file output or calculation behaviour | `cam.js`, `engines/mods-host.js` and bundled engines | Follow the engine boundary below; output comparisons are required. |

The current lab values are spread across several code files. There is not yet one simple “lab settings” file. Do not assume that changing a displayed tool name also changes the dimensions used for calculation. Moving routine lab data into one readable file is a proposed improvement in the [documentation plan](DOCUMENTATION_PLAN.md), not a feature that already exists.

For application changes, keep the change small and preview it before publishing. A downloaded copy can be served locally: choose **Code → Download ZIP**, extract it, open a terminal in the extracted folder containing `index.html`, and, on a Windows PC with Python 3 installed, run:

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

Keep that terminal open and visit `http://127.0.0.1:4173/`. Use another port, such as `4174`, in both places if that port is already occupied. Stop the server with Ctrl+C. Opening `index.html` by double-clicking it does not provide the web-server environment the app needs. The hosted application does not require Python.

[GitHub's ZIP-download instructions](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives).

## 5. If something stops working

| Symptom | First action |
| --- | --- |
| A saved edit is missing from the live site | Check the corresponding Pages run in Actions. After it succeeds, refresh the page. Check that the edit was saved to `main`, not an unmerged branch. |
| Site is missing or returns 404 | Check whether Pages is still publishing `main` and `/(root)` and whether the latest deployment succeeded. `index.html` must remain at the root. |
| Blank application or controls do nothing after an edit | Try a fresh tab. If the previous version worked and the new one does not, restore the last change using section 6. A broken quote in a JavaScript content string can stop the application. |
| One board fails to import | Read the displayed message. Try the bundled lab example. The app needs one outer copper Gerber and matching Edge.Cuts, even when the outline cut is not wanted. Slots and inner layers are not supported. |
| A cutter is rejected for holes | Compare its diameter with the actual hole sizes. A contour-milling cutter must be smaller than the hole. The red pointed cutter remains selectable with a taper warning; it is not treated as a flat drill. |
| Calculation gives no paths or a boundary error | Keep the error text and check the cutter, selected operations and preview. Try the lab example to distinguish an input-specific issue from a general failure. |
| Download is missing after an edit | Recalculate. Changing settings or board files invalidates earlier output. |
| Downloaded PNG has no coloured paths | Expected: PNG downloads contain the machining image. Coloured paths are a separate on-screen overlay. |
| Refresh lost a job | Expected: jobs are held in browser memory. Re-import the board exports. Saved settings JSON cannot currently be reopened by the application. |

For an unresolved problem, record the site address, what was clicked, the exact error, whether the bundled example works, and the affected repository commit. Include the input files and settings when they can be shared. This gives a future student or optional AI helper a reproducible problem without needing the original conversation.

## 6. Undo a published change

For a bad single-file edit, open that file's **History** on GitHub, view the previous working revision and copy its contents. Return to the current file, edit it, restore those contents and commit the restoration. Wait for Pages to finish and check the site again.

For a change covering several files, GitHub Desktop can restore the complete change together: select the repository and branch, open **History**, right-click the bad commit and choose **Revert Changes in Commit**, then push the new reversal commit. Reverting that commit reverses its changes; it does not restore an arbitrary older snapshot or undo every later commit. If the change conflicts with later work, inspect that conflict before proceeding. See [GitHub's revert guide](https://docs.github.com/en/desktop/managing-commits/reverting-a-commit-in-github-desktop).

Known application reference: `fa044505e9a435f6b38856b7c404bd2bf106d058` passed the 43-case suite and the published navigation check on 15 October 2026. This is a software reference, not a physically validated milling profile.

## 7. Preserve the engine boundary

The processing route is:

**KiCad exports → Gerber2PNG functions → aligned PNGs → Mods modules → RML and settings ZIP.**

`integration.js` reads the files; `cam.js` maps settings and collects results. `conversion.bundle.js` contains the prebuilt converter. `engines/program.json` contains the selected original Mods module definitions; `engines/mods-host.js` drives those modules. `engines/provenance.json` and `dependencies.lock.json` record versions and checksums. Keep their notices and the files listed in [THIRD_PARTY.md](../THIRD_PARTY.md).

Changing wording or appearance does not require rebuilding these engines. Replacing engine files with the newest versions is a separate change and can alter output; retain fixed versions until replacements have been compared and checked.

**Handover gap still to close:** this repository contains a runnable website, but not the full source/build workspace for regenerating the converter bundle and Mods graph. The development workspace currently retains `conversion-entry.js`, build/packaging scripts, dependency packages and original upstream snapshots outside this repository. A fresh download can run and be edited, but does not yet reproduce the engines from source. The next handover stage must preserve the required build inputs and a tested restore procedure on GitHub or in a linked project release; a path on one student's PC is not a durable handover.

## 8. End-of-term handover

Leave the next student with working repository access, this document, a known working application revision, the updated operating guides and the build-source gap resolved. Record the machine PC's VPanel/driver setup and any measured milling profiles in the relevant machine guide or lab records. Keep observed cutting results distinct from software example defaults. The [documentation plan](DOCUMENTATION_PLAN.md) lists the remaining work and how to keep it small.
