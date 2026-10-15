# Ampoteket PCB milling

**Turn KiCad board exports into milling files for the Roland SRM-20.**

[Open the application](https://damlien.github.io/PCB-milling-test/) · [Documentation](docs/README.md) · [Taking over the website](docs/HANDOVER.md)

Ampoteket PCB milling brings Gerber2PNG conversion and Mods toolpath calculation into one guided browser interface. It helps students prepare a single-sided PCB without moving files between separate websites or navigating the Mods node workspace.

## From board design to machine files

1. **Board files:** add the copper Gerber, matching Edge.Cuts Gerber and any Excellon drill files from KiCad, individually or as a ZIP.
2. **Plan the cuts:** choose board stock and cutters, then review or adjust the depth, cutting speed, repeated passes and travel height. Illustrated explanations help connect the settings to the cuts they produce.
3. **Review & mill:** calculate the cutter paths, inspect the previews and download the machine files together with their settings record. The run sheet explains file order and tool changes.

## What it produces

The downloaded ZIP contains the selected operations:

| File | Purpose |
| --- | --- |
| `01-copper.rml` | Separate copper tracks and pads. |
| `02-holes.rml` | Mill component and connection holes, when selected. |
| `03-outline.rml` | Cut the board free, when selected. |
| `job-settings.json` | Record the source-file hashes, settings and engine versions used. |

RML files are sent to the machine using Roland VPanel. The application prepares files; it does not connect to or control the mill. Two battery–resistor–LED example boards are included for trying the workflow.

## Processing and current scope

Board files are processed locally in the browser, without uploading them to a processing server.

The current build supports one outer copper layer, F.Cu or B.Cu, a matching board boundary and round Excellon holes. Routed slots and inner copper layers are rejected. Hole preparation uses contour milling rather than a dedicated plunge-drilling process.

Lab stock and cutter choices are provided, with editable example cutting values. These values have not yet been established as physically tested lab profiles.

## Built on existing tools

The application retains the original **[Gerber2PNG](https://github.com/fablabkerala/gerber2png)** conversion functions and **[Mods](https://gitlab.fabcloud.org/pub/project/mods)** calculation modules. The surrounding interface handles settings, previews and downloads. Fixed versions, attribution and dependency notices are recorded in [THIRD_PARTY.md](THIRD_PARTY.md).

For maintaining the site, start with [Taking over the website](docs/HANDOVER.md). See [Documentation](docs/README.md) for the available documentation and guide status.
