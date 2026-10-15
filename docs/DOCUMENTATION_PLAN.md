# Documentation and guide plan

**Status: proposal grounded in the current application and existing guide sources, 15 October 2026.** The project README and first website handover guide are available. Updated milling guides, a guide page, PDFs and a QR card have not yet been published.

## What the documentation must make possible

A student should be able to manufacture a PCB using the guide, look up an unfamiliar setting without losing their place, and find help when the result differs from the example. A future student looking after the website should be able to find its files, make a modest change, publish it and recover from a mistake without needing the original author or conversation.

Write for those tasks. Descriptions of how the project evolved, personal troubleshooting history and lists of software-engineering practices do not belong in the operating instructions.

## The smallest useful document set

| Item | Reader and purpose | Home and format |
| --- | --- | --- |
| Project README | Someone discovering the repository: what the tool does, inputs, outputs and scope | Repository root; short Markdown overview |
| Website handover | Next student: access, common changes, publication, checks and recovery | `docs/HANDOVER.md` on GitHub |
| Main milling guide | Person going from a completed KiCad board to a finished bare PCB | Proposed `guide/` section of the website, with a printable PDF |
| Backup workflow | Person using Gerber2PNG and Mods separately | A clearly separate part of the guide section, with its own PDF |
| Machine quick reference | Person standing at the SRM-20 with prepared files | A short printed sheet, downloadable from the guide section, with the guide URL and QR code |

One GitHub repository should hold the current documentation sources, editable illustrations and generated PDFs alongside the application. The website presents the operating guide; GitHub presents the maintenance guide. A separate wiki, document account, documentation framework or content-management server is unnecessary for this project.

An archive can retain superseded PDFs, clearly labelled with their dates and replacement. Old PDFs should not appear as competing current instructions in the main download area. The archive is a record, not the backup workflow: the backup guide itself must be brought up to date.

## What a future student is likely to need

| Task | What documentation can provide now | Small improvement that would help later |
| --- | --- | --- |
| Use the mill | A sequential guide with illustrations and expected results | A persistent **Guide** link in the app, opening without clearing the current job |
| Correct an explanation or link | An exact file location and a short edit/publish/undo recipe | Keep help text easy to find; avoid unnecessary copies of the same text |
| Replace stock or add a cutter | Explain dimensions, affected settings and where the values currently live | Put routine lab stock/cutter data in one readable configuration file, with units and source notes |
| Change a cutting default after testing | Explain the difference between an example and a measured profile | Keep each tested profile with material, tool model, settings, date and observed result |
| Recover after an edit | A known working revision and restoration instructions | A downloadable known working release and a way to preview before publishing |
| Repair a deeper bug | A short map of the processing route and reproducible test case | Preserve the full build inputs and a repeatable restore procedure |

These improvements should be introduced only where they remove repeated work. Moving lab data into a configuration file would preserve the same calculations. It does not require students to maintain a new calculation engine. AI assistance can help with a specific edit or fault, but the handover must remain usable without access to an earlier chat or an AI subscription.

## Main guide: one route from KiCad to finished PCB

Begin with the completed layout open in KiCad. Explain each program when it first becomes relevant. Keep circuit design to the manufacturing requirements: one copper side, board edge, connected tracks and openings compatible with the chosen process.

1. **Export the board.** Show the actual KiCad export dialogs, the copper/Edge.Cuts/Excellon selections, shared origin and unmirrored exports. End with a picture of the expected file set.
2. **Add files to the Ampoteket app.** Show ZIP and individual-file import, copper side, dimensions and the imported preview. Explain how to recognise the intended orientation from an asymmetric feature.
3. **Plan the cuts.** Identify the physical lab stock and full cutter model numbers. Explain shallow copper isolation versus through-cuts, depth per pass, cutting speed and travel height with small diagrams. Show the saved values and how to adjust them; distinguish editable example defaults from measured lab profiles.
4. **Calculate and inspect.** Walk through the actual three-step interface, previews and ZIP contents. Show one clear example of copper, hole and outside paths, and what to do when a hole has no path. Explain that preview colours are overlays, not part of downloaded PNGs.
5. **Set up the SRM-20.** Use photos of the actual backing, stock mounting, collet/tool installation and VPanel controls. Explain X/Y placement, copper-surface Z zero, clearance and spindle RPM where they are used. The guide teaches the operations directly; it does not delegate the explanation to an assumed supervisor.
6. **Run the files in order.** Copper first, holes when selected, outline last. Show what stays unchanged during a tool change and why Z must be set again. Use the job's run sheet rather than expecting every job to use the same cutter sequence.
7. **Finish and check the PCB.** Remove the board, clean and inspect it, then check continuity and isolation before fitting components or applying power. Define the expected finished bare-board result.

Troubleshooting should sit beside the relevant step where possible: what you see, likely cause, next action. Put the longer reference tables at the end. Do not make every step an extra confirmation gate.

## Backup guide: a genuinely usable alternative

Keep KiCad export and machine setup consistent with the main guide. Replace only the app-specific middle section with **Gerber2PNG → PNGs → Mods → RML**. Readers should not need to switch back and forth between two documents to finish a board; each PDF should be usable on its own. Reuse the same authored machine instructions when generating them.

The backup section needs screenshots of the exact original tools, the correct file-output SRM-20 program, a map of the few modules the user changes, image polarity, DPI, side/orientation, cutter geometry, offsets, feeds, total depth and depth per pass. Explain preset order and the difference between saving a Mods program and downloading RML.

**Do not promise identical files just because the calculations come from the same projects.** The Ampoteket app can add a common blank border for cutter clearance; the external Gerber2PNG page's normal border may be insufficient for the purple 2 mm outline cutter. The backup procedure must demonstrate a complete path and preserve identical alignment for all images. Any padding method must be written out and illustrated, with dimensions and origin implications. Confirm the selected Mods output module as well as the visible program name before claiming equivalence.

The backup should also distinguish an unavailable Ampoteket host from having no internet: two external websites are not an offline fallback. Keep a downloadable runnable copy of the app as a separate hosting fallback, with its local-start instructions.

## Existing guides: what can be reused and what needs correction

The audit below uses the existing Markdown and PDF-generation sources. Layout must be checked when producing the replacement PDFs.

| Existing material | Useful material | Required treatment |
| --- | --- | --- |
| `Ampoteket_PCB_Milling_Guide.pdf` | Process explanations, KiCad exports, machine setup structure and illustrated depth concepts | Rework its software route for the app. It includes a 0.4 mm flat isolation example, 0.8 mm through-cut tool, 1.60 mm stock plus 0.05 mm allowance and an approximately 7000 RPM suggestion. These are not the current lab profile. It also demonstrates slots, which the app rejects. |
| `Ampoteket_KiCad_to_Roland_Software_Quick_Guide.pdf` | Concise original-tool export/PNG/Mods walkthrough | Candidate source for the revised backup guide. Update cutters, stock/depth explanation, process scope and image-margin handling. It is not a machine setup guide on its own. |
| Older `Ampoteket_KiCad_to_SRM20_Beginners_Manual.pdf` and `KiCad_to_Roland_SRM20_PCB_Guide.pdf` | Historical reference; assess individual diagrams before reuse | Keep out of current instructions. The beginner-manual source contains supervisor assumptions and a holes-image inversion convention that differs from the current converter's Generate All output. Do not carry those directions into the new guide. |

The new guides must reconcile these facts with the actual application:

- Lab stock is single-sided FR2 with 35 µm copper. The saved **1.64 mm** total thickness is a recorded sheet measurement, not a package-wide thickness guarantee.
- The red **VHF RS-ISO-090-3-30** uses nominal 0.05 mm tip and 90° included angle in the model. Its shank diameter is not its shallow cutting width.
- The purple **VHF LK-SV-0200-3-090-38** has a 2 mm cutting diameter. A hole contour needs a smaller cutter than the intended hole; the two bundled boards have different hole sizes.
- The red cutter remains available for holes with a taper warning. The guide must describe that option accurately without implying that full-depth geometry has been physically validated or substituting flat-drill instructions.
- Current example values are 0.05 mm copper depth at 2 mm/s; 1.65 mm total through-depth, 0.25 mm per pass and 0.5 mm/s; 5 mm travel height; four copper-clearing passes at 50% spacing. The 1.65 mm example is **0.01 mm beyond 1.64 mm stock**, not a universal thickness-plus-0.05 rule. Values can be edited independently.
- Spindle RPM is set in VPanel; the application does not currently supply a tested RPM profile. Do not promote an older guide's RPM suggestion into a tested lab setting.
- The app requires Edge.Cuts for shared alignment even if the outside cut is omitted. Slots are currently unsupported. Generated RML uses the image-canvas corner for X/Y zero and the copper surface for Z zero.

Technical sources should sit with the relevant reference facts, not interrupt each beginner instruction. Manufacturer tool specifications, stock measurements, example software values and observed milling results are different kinds of evidence; a single “recommended settings” table must not blur them.

## Website, PDF and machine sheet

Use a small static guide section with short chapters, a visible route through the process, readable text, annotated screenshots and diagrams. Essential actions stay visible; optional explanation can expand in the screen version. The printable version must include the necessary explanation without relying on closed panels, hover text or video.

Maintain one editable content source for shared sections and generate the screen/print versions from it. Start with ordinary HTML and print styling rather than a new documentation platform. Produce the PDF from a fixed revision, check every rendered page, and retain the editable diagrams. Avoid separately rewriting the same instructions in a PDF editor.

Give each guide a revision/date and the application revision it describes. Put the same reference on the PDF and download link. When a tool, default, label or workflow changes, check the affected guide section as part of that change.

The proposed stable QR destination is the site's **`guide/`** page, not a dated PDF or a personal file-sharing URL. It would offer **Start the guide**, **Open the milling app**, **Download PDF**, **Backup workflow** and **Machine quick reference**. This route does not exist yet. Settle long-term hosting before printing a permanent card; if the site moves, retain the old address or provide a redirect where possible.

The machine sheet should contain the actions useful at the mill: secure stock, correct cutter and collet, X/Y placement, copper-surface Z zero, spindle setting, file order, Z after tool changes, and final inspection. Exact button procedures belong in the illustrated guide. Avoid printing a generic list of numerical cutting values that may not match the downloaded job. Show a readable URL as well as the QR code, and test the printed QR on a phone at its intended size.

## Practical order of work

1. **Project description and navigation:** replace the setup-oriented README and create one documentation entry point. Available now.
2. **Durable website handover:** the first task-based handover is available. Close the build-source gap, preserve a working release and establish continuing repository access. Replace chat-dependent/local-only knowledge with short current instructions.
3. **Guide content and figures:** use existing research and the current app to draft the full route and identify the exact screenshots needed. Reuse usable photos; replace mismatched screens and values. Do the research and reconciliation during authoring, rather than making the reader gather information before they have a guide.
4. **Main website guide and PDF:** build and inspect both from the same revision. Check the steps against the actual app and equipment references. Record which numerical profiles have physical evidence; label untested values plainly without replacing the teaching with repeated warnings.
5. **Backup guide:** exercise the original-tool route, including the larger-cutter margin issue, then publish it as a current alternative.
6. **Machine sheet and QR:** create these after the guide address and contents are stable, then add a persistent guide link to the application.

## A simple handover check

A student unfamiliar with the project should be able to find the live tool, use the bundled example, locate the right document, correct a harmless sentence in a separate working copy and explain how to undo that edit using the handover alone. The operating guide should let a reader follow the full software workflow and identify the required machine actions without asking the original author what a sentence means.

Use failures in that walkthrough to fix the document or interface. A long document, a large test count or an AI handoff prompt is not a substitute for those practical outcomes.
