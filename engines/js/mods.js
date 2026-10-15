//
// mods.js
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by: Francisco Sanchez at The Beach Lab 2023
//            : xytaz                          Mar-2020
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// closure
//
(function() {
    //
    // Initial CSS
    //
    const style = document.createElement('style');
    style.textContent = `
    /* 
    * mods css stylesheet 
    * created by Francisco Sanchez Arroyo February 2020
    */
    :root {
        --mods-bg: rgb(255, 255, 255);
        --mods-text: black;
        --mods-link: black;
        --mods-canvas: rgb(255, 255, 255);
        --mods-divint: rgb(240, 240, 240);
        --mods-grid-dot: rgba(0, 0, 0, 0.20);
        --mods-prompt: #333;
    }
    [data-theme="dark"] {
        --mods-bg: rgb(51, 51, 51);
        --mods-text: white;
        --mods-link: white;
        --mods-canvas: rgb(40, 40, 40);
        --mods-divint: rgb(180, 180, 180);
        --mods-grid-dot: rgba(255, 255, 255, 0.20);
        --mods-prompt: #ccc;
    }
    body {
        overflow: hidden;
        font-family: monospace;
        touch-action: none;
        background-color: var(--mods-bg);
    }
    textarea, input, select {
        font-family: inherit;
    }
    hr {
        height: 2px;
        color: #ddd;
        background-color:#ddd;
        border-width:0;
    }
    button {
        font-family : inherit;
        font-size: 1em;
        padding: 5px 5px !important;
        cursor: pointer;
        text-align: center;
        color: #fff;
        background-color: #b3b3b3;
        border: none;
        border-radius: 4px;
        box-shadow: 0 4px #999;
        margin-bottom: 8px !important;
    }
    button:hover {
        background-color: #7d7d7d;
        box-shadow: 0 4px #666;
    }
    button:active {
        background-color: #7d7d7d;
        box-shadow: 0 4px #666;
        transform: translateY(3px);
    }
    button:disabled {
        background-color: #ccc;
        box-shadow: 0 4px #bbb;
        cursor: not-allowed;
    }
    [data-theme="dark"] button:not(.mods-sidebar-close):not(.mods-topbar-btn) {
        background-color: #555;
        box-shadow: 0 4px #333;
    }
    [data-theme="dark"] button:not(.mods-sidebar-close):not(.mods-topbar-btn):hover {
        background-color: #444;
        box-shadow: 0 4px #222;
    }
    [data-theme="dark"] button:not(.mods-sidebar-close):not(.mods-topbar-btn):active {
        background-color: #444;
        box-shadow: 0 4px #222;
        transform: translateY(3px);
    }
    input {
        font-family : inherit;
        font-size: 1em;
        border: 1px solid #bbb;
        padding: 1px;
        margin: 1px;
    }
    input[type=text]:focus {
        outline: none;
        border: 1px solid red;
    }
    input[type=radio] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;	
    }
    input[type=radio] {
        margin: 5px;
        outline: none;
        position: relative;
        top: 9px;
        left: 3px;
        height: 15px;
        width: 15px;
        background-color: #bbb;
        border: 0px;
        border-radius: 50%;
    }
    input[type=radio]:checked {
        background-color: #88cc00;
    }
    [data-theme="dark"] input[type=radio] {
        background-color: #777;
    }
    [data-theme="dark"] input[type=radio]:checked {
        background-color: #55aa00;
    }
    .mods-status-lcd {
        display: block;
        width: 0;
        min-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        font-family: monospace;
        font-size: 1em;
        background: #eee;
        border: 1px solid #bbb;
        padding: 1px;
        margin: 1px;
    }
    .mods-field-row {
        display: flex;
        align-items: center;
        margin: 2px 0;
    }
    .mods-field-row input[type=text] {
        flex: 1;
        min-width: 0;
    }
    .mods-field-label {
        display: inline-block;
        width: 65px;
        text-align: right;
        flex-shrink: 0;
    }
    .mods-field-row input[type=radio] {
        margin: 0 1px 0 4px;
        position: static;
        top: 0;
    }
    select {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        font-family: inherit;
        font-size: 1em;
        height: 20px;
        background-color: #fff;
        padding: 1px;
        padding-right: 1.1em;
        margin: 1px;
        margin-bottom: 5px;
        border: 1px solid #bbb;
        box-shadow: none;
        /* SVG background image downward-pointing arrow */
        background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
        background-size: .6em auto, 100%;
        background-position: right 0.3em top 50%, 0 0;
        background-repeat: no-repeat;
    }
    select:hover {
        border: 1px solid red;
    }
    select:focus {
        outline: none;
    }
    select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }
    /* 
    //  on-off
    */
    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }
    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .2s;
    }
    input:checked + .slider {
        background-color: #88cc00;
    }
    input:focus + .slider {
        box-shadow: 0 0 1px #88cc00;
    }
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
    /* ===== Top Bar ===== */
    .mods-topbar {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        z-index: 9000;
        font-family: monospace;
        font-size: 14px;
        box-sizing: border-box;
        gap: 4px;
        user-select: none;
        padding-top: env(safe-area-inset-top, 0px);
    }
    [data-theme="dark"] .mods-topbar {
        background: #555;
        color: #fff;
    }
    .mods-topbar {
        background: #ddd;
        color: #222;
    }
    .mods-topbar button.mods-topbar-btn,
    .mods-topbar a.mods-topbar-btn,
    .mods-topbar a.mods-topbar-btn:link,
    .mods-topbar a.mods-topbar-btn:visited,
    .mods-topbar a.mods-topbar-btn:hover,
    .mods-topbar a.mods-topbar-btn:active {
        all: unset;
        color: inherit !important;
        text-decoration: none !important;
        font-family: monospace;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
        padding: 8px 10px !important;
        min-width: 44px;
        min-height: 44px;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        box-sizing: border-box;
        flex-shrink: 0;
        margin: 0 !important;
    }
    [data-theme="dark"] .mods-topbar .mods-topbar-btn:hover {
        background: rgba(255,255,255,0.15);
    }
    [data-theme="dark"] .mods-topbar .mods-topbar-btn:active {
        background: rgba(255,255,255,0.25);
    }
    .mods-topbar .mods-topbar-btn:hover {
        background: rgba(0,0,0,0.1);
    }
    .mods-topbar .mods-topbar-btn:active {
        background: rgba(0,0,0,0.18);
    }
    .mods-topbar-btn:focus-visible {
        outline: 2px solid #45d4ff;
        outline-offset: -2px;
    }
    .mods-topbar-divider {
        width: 1px;
        height: 28px;
        flex-shrink: 0;
    }
    [data-theme="dark"] .mods-topbar .mods-topbar-divider {
        background: rgba(255,255,255,0.25);
    }
    .mods-topbar .mods-topbar-divider {
        background: rgba(0,0,0,0.2);
    }
    .mods-topbar {
        overflow: hidden;
    }
    .mods-topbar-prompt {
        position: fixed;
        bottom: 8px;
        left: 8px;
        z-index: 9000;
        font-family: monospace;
        font-size: 13px;
        pointer-events: none;
        opacity: 0.7;
        max-width: calc(100vw - 76px);
        word-wrap: break-word;
    }
    /* ===== Responsive Top Bar ===== */
    @media (max-width: 900px) {
        .mods-topbar-label-center {
            display: none !important;
        }
    }
    @media (max-width: 600px) {
        .mods-topbar-label-side {
            display: none !important;
        }
    }
    /* ===== Dev-only Buttons (hidden by default) ===== */
    .mods-topbar button.mods-topbar-btn.mods-dev-btn {
        display: none !important;
    }
    .mods-topbar button.mods-topbar-btn.mods-dev-btn.visible {
        display: inline-flex !important;
    }
    /* ===== Context Action Buttons (hidden by default) ===== */
    .mods-topbar button.mods-topbar-btn.mods-action-btn {
        display: none !important;
    }
    .mods-topbar button.mods-topbar-btn.mods-action-btn.visible {
        display: inline-flex !important;
    }
    .mods-topbar button.mods-topbar-btn.mods-action-btn.mods-danger {
        color: #e53e3e !important;
    }
    .mods-topbar button.mods-topbar-btn.mods-action-btn.mods-danger.visible {
        color: #e53e3e !important;
    }
    /* ===== Hardware Indicator ===== */
    .mods-topbar-indicator {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 6px;
        min-width: 44px;
        min-height: 44px;
        box-sizing: border-box;
        flex-shrink: 0;
        color: #e53e3e !important;
        cursor: pointer;
    }
    .mods-tooltip {
        display: none;
        position: fixed;
        padding: 8px 12px;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        white-space: nowrap;
        border-radius: 4px;
        z-index: 9999;
        max-width: calc(100vw - 16px);
        box-sizing: border-box;
    }
    @media (max-width: 600px) {
        .mods-tooltip {
            white-space: normal;
        }
    }
    .mods-tooltip.visible {
        display: block;
    }
    [data-theme="dark"] .mods-topbar .mods-tooltip {
        background: #1a1a1a;
        color: #f0f0f0;
    }
    .mods-topbar .mods-tooltip {
        background: #f5f5f5;
        color: #555;
    }
    /* ===== Module Info Tooltip ===== */
    .mods-info-tooltip {
        position: fixed;
        z-index: 9999;
        background: #222;
        color: #f0f0f0;
        font-family: monospace;
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 6px;
        max-width: 300px;
        white-space: normal;
        word-wrap: break-word;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        pointer-events: auto;
    }
    /* ===== Sidebars ===== */
    .mods-sidebar {
        position: fixed;
        top: 50px;
        bottom: 0;
        width: 280px;
        background: rgb(69, 212, 255);
        color: #000;
        z-index: 8500;
        overflow-y: auto;
        overflow-x: hidden;
        transition: transform 0.25s ease;
        font-family: monospace;
        font-size: 14px;
        box-sizing: border-box;
        padding: 10px;
        padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }
    .mods-sidebar a { color: #000; }
    .mods-sidebar-left {
        left: 0;
        transform: translateX(-100%);
        border-right: 2px solid rgba(0,0,0,0.1);
    }
    .mods-sidebar-left.open {
        transform: translateX(0);
    }
    .mods-sidebar-right {
        right: 0;
        transform: translateX(100%);
        border-left: 2px solid rgba(0,0,0,0.1);
    }
    .mods-sidebar-right.open {
        transform: translateX(0);
    }
    .mods-sidebar-heading {
        font-weight: bold;
        font-size: 16px;
        padding: 8px 4px 12px 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .mods-sidebar-close {
        background: none;
        border: none;
        font-size: 22px;
        cursor: pointer;
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: #000;
        padding: 0;
        box-shadow: none;
        margin: 0;
    }
    .mods-sidebar-close:hover {
        background: rgba(0,0,0,0.1);
        box-shadow: none;
    }
    .mods-sidebar-close:active {
        transform: none;
        box-shadow: none;
    }
    .mods-sidebar-close:focus-visible {
        outline: 2px solid #000;
        outline-offset: 2px;
    }
    .mods-sidebar-item {
        padding: 10px 8px;
        cursor: pointer;
        border-radius: 4px;
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-sizing: border-box;
    }
    .mods-sidebar-item:hover {
        background: rgba(255,255,255,0.35);
    }
    .mods-sidebar-item:active {
        background: rgba(255,255,255,0.5);
    }
    .mods-sidebar-item:focus-visible {
        outline: 2px solid #000;
        outline-offset: -2px;
    }
    .mods-sidebar-label {
        font-weight: bold;
        padding: 12px 8px 4px 4px;
    }
    .mods-sidebar hr {
        border: 0;
        height: 0;
        background: none;
        border-top: 1px solid rgba(0,0,0,0.15);
        margin: 4px 0;
    }
    .mods-sidebar-filter {
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        margin-bottom: 8px;
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        font-family: inherit;
        font-size: 14px;
        background: rgba(255,255,255,0.5);
        outline: none;
    }
    .mods-sidebar-filter:focus {
        border-color: #4a90d9;
    }
    .mods-sidebar-action {
        padding: 10px 8px;
        cursor: pointer;
        border-radius: 4px;
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-sizing: border-box;
        font-weight: bold;
        border-top: 1px solid rgba(0,0,0,0.15);
        margin-top: 4px;
    }
    .mods-sidebar-action:hover {
        background: rgba(255,255,255,0.35);
    }
    .mods-sidebar-action:active {
        background: rgba(255,255,255,0.5);
    }
    .mods-sidebar-action:focus-visible {
        outline: 2px solid #000;
        outline-offset: -2px;
    }
    /* ===== Scrim (backdrop) ===== */
    .mods-scrim {
        position: fixed;
        top: 50px; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.4);
        z-index: 8000;
        display: none;
    }
    .mods-scrim.visible {
        display: block;
    }
    /* ===== Responsive ===== */
    @media (min-width: 1024px) {
        .mods-sidebar.pinned {
            transform: translateX(0);
        }
        .mods-sidebar-left.pinned ~ .mods-scrim {
            display: none !important;
        }
        .mods-sidebar-right.pinned ~ .mods-scrim {
            display: none !important;
        }
    }
    @media (max-width: 1023px) {
        .mods-sidebar.pinned {
            transform: translateX(0);
        }
    }
    @media (max-width: 480px) {
        .mods-sidebar {
            width: 85vw;
        }
    }
    /* ===== Editor Dialog ===== */
    #mods-editor-dialog {
        position: fixed;
        background: #292A2B;
        color: #E6E6E6;
        font-family: monospace;
        border: 1px solid #bbb;
        padding: 0;
        overflow: hidden;
        z-index: 10000;
        margin: 0;
        /* override <dialog> defaults of fit-content */
        width: auto;
        height: auto;
        max-width: none;
        max-height: none;
        /* right half (landscape) */
        top: 50px;
        right: 0;
        bottom: 0;
        left: 50%;
        border-radius: 8px 0 0 0;
        box-shadow: -4px 0 20px rgba(0,0,0,0.4);
    }
    #mods-editor-dialog[open] {
        display: flex;
        flex-direction: column;
    }
    /* portrait / tall devices: bottom half */
    @media (max-aspect-ratio: 4/3) {
        #mods-editor-dialog {
            top: 50%;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 8px 8px 0 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
        }
    }
    #mods-editor-resize {
        position: absolute;
        z-index: 1;
        top: 0; bottom: 0; left: 0; width: 6px;
        cursor: col-resize;
        background: linear-gradient(to right, #555 0px, #555 1px, transparent 1px);
    }
    #mods-editor-resize:hover, #mods-editor-resize:active {
        background: linear-gradient(to right, #FF75B5 0px, #FF75B5 2px, transparent 2px);
    }
    @media (max-aspect-ratio: 4/3) {
        #mods-editor-resize {
            top: 0; bottom: auto; left: 0; right: 0;
            width: auto; height: 6px;
            cursor: row-resize;
            background: linear-gradient(to bottom, #555 0px, #555 1px, transparent 1px);
        }
        #mods-editor-resize:hover, #mods-editor-resize:active {
            background: linear-gradient(to bottom, #FF75B5 0px, #FF75B5 2px, transparent 2px);
        }
    }
    #mods-editor-dialog .cm-s-panda.CodeMirror { background: #292A2B; color: #E6E6E6; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-gutters { background: #292A2B; border-right: 1px solid #3a3b3c; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-linenumber { color: #464B5D; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-cursor { border-left: 2px solid #FF75B5; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-selected { background: #464B5D; }
    #mods-editor-dialog .cm-s-panda .cm-comment { color: #676B79; font-style: italic; }
    #mods-editor-dialog .cm-s-panda .cm-keyword { color: #FF75B5; }
    #mods-editor-dialog .cm-s-panda .cm-operator { color: #F3F3F3; }
    #mods-editor-dialog .cm-s-panda .cm-string { color: #19F9D8; }
    #mods-editor-dialog .cm-s-panda .cm-string-2 { color: #19F9D8; }
    #mods-editor-dialog .cm-s-panda .cm-number { color: #FFB86C; }
    #mods-editor-dialog .cm-s-panda .cm-atom { color: #FFB86C; }
    #mods-editor-dialog .cm-s-panda .cm-def { color: #6FC1FF; }
    #mods-editor-dialog .cm-s-panda .cm-variable { color: #E6E6E6; }
    #mods-editor-dialog .cm-s-panda .cm-variable-2 { color: #E6E6E6; }
    #mods-editor-dialog .cm-s-panda .cm-property { color: #E6E6E6; }
    #mods-editor-dialog .cm-s-panda .cm-tag { color: #FF75B5; }
    #mods-editor-dialog .cm-s-panda .cm-attribute { color: #FFB86C; }
    #mods-editor-dialog .cm-s-panda .cm-builtin { color: #6FC1FF; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-matchingbracket { color: #19F9D8 !important; font-weight: bold; }
    #mods-editor-dialog .cm-s-panda .CodeMirror-activeline-background { background: #333435; }
    /* editor toolbar: light mode (default) — scoped under #id for specificity */
    #mods-editor-dialog .mods-editor-toolbar {
        display: flex; align-items: center; gap: 3px; padding: 6px 8px;
        flex-shrink: 0; flex-wrap: wrap;
        background: rgb(215,215,215); border-bottom: 1px solid #bbb;
    }
    #mods-editor-dialog .mods-editor-toolbar button {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 5px 10px; background: rgb(245,245,245); border: 1px solid #ccc;
        color: #333; cursor: pointer; border-radius: 4px;
        font-size: 12px; font-family: monospace; white-space: nowrap;
    }
    #mods-editor-dialog .mods-editor-toolbar button:hover { background: #fff; }
    #mods-editor-dialog .mods-editor-toolbar button.mods-btn-primary {
        background: #FF75B5; color: #292A2B; font-weight: bold; border-color: #e0609a;
    }
    #mods-editor-dialog .mods-editor-toolbar button.mods-btn-primary:hover { background: #ff8ec4; }
    #mods-editor-dialog .mods-tb-sep {
        width: 1px; height: 20px; background: #bbb; margin: 0 4px; flex-shrink: 0;
    }
    /* editor toolbar: dark mode */
    [data-theme="dark"] #mods-editor-dialog .mods-editor-toolbar {
        background: #333435; border-bottom-color: #464B5D;
    }
    [data-theme="dark"] #mods-editor-dialog .mods-editor-toolbar button {
        color: #E6E6E6; background: none; border-color: transparent;
    }
    [data-theme="dark"] #mods-editor-dialog .mods-editor-toolbar button:hover { background: #464B5D; }
    [data-theme="dark"] #mods-editor-dialog .mods-editor-toolbar button.mods-btn-primary {
        background: #FF75B5; color: #292A2B; border-color: transparent;
    }
    [data-theme="dark"] #mods-editor-dialog .mods-editor-toolbar button.mods-btn-primary:hover { background: #ff8ec4; }
    [data-theme="dark"] #mods-editor-dialog .mods-tb-sep { background: #464B5D; }
    [data-theme="dark"] #mods-editor-dialog { border-color: #464B5D; }
    /* === Theme variable rules === */
    a { color: var(--mods-link); }
    #mods-grid-dot { fill: var(--mods-grid-dot); }
    #links g > path:first-child { stroke: var(--mods-bg); }
    [data-id][data-div-name-size] { background-color: var(--mods-divint) !important; }
    [data-id] canvas { background-color: var(--mods-canvas) !important; }
    .mods-topbar-prompt { color: var(--mods-prompt); }
    `;
    document.head.appendChild(style);    

    //
    // globals
    //
    var mods = {}
    mods.mod = {}
    mods.globals = {}
    mods.ui = {
        source: null,
        progname: '',
        progpath: '',
        border: 0,
        borderRadius: '0px',
        padding: 7,
        bezier: 100,
        canvas: 250,
        rows: 5,
        cols: 20,
        link_color: 'rgb(43, 202, 255)',
        link_highlight: 'rgb(255,0,0)',
        link_stroke_with: 5,
        selected_link: null,
        clipboard: [],
        header: 50,
        selected: {},
        mousedown: null,
        menu: null,
        top: null,
        left: null,
        xstart: null,
        ystart: null,
        xtrans: null,
        ytrans: null,
        maxzoom: 2.5, // sets how much you can zoom in
        minzoom: 0.3,  // sets how much you can zoom out
        leftSidebarOpen: false,
        rightSidebarOpen: false,
    }
    //
    // theme initialization (CSS custom properties handle colors,
    // localStorage persists user preference)
    //
    var savedTheme = localStorage.getItem('mods-theme')
    if (savedTheme) document.documentElement.dataset.theme = savedTheme

    ////////////////////
    // Lucide Icons   //
    ////////////////////
    var lucideIcons = {
        menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
        x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
        maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
        folderOpen: '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
        download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
        trash: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
        folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
        filePlus: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M9 15h6"/><path d="M12 18v-6"/>',
        blocks: '<path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"/><rect x="14" y="2" width="8" height="8" rx="1"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
        gitlab: '<path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"/>',
        unplug: '<path d="m19 5 3-3"/><path d="m2 22 3-3"/><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m12 6 6 6"/><path d="M17.7 3.7a2.4 2.4 0 0 1 3.4 0 2.4 2.4 0 0 1 0 3.4L18 10l-6-6Z"/>',
        copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
        clipboardPaste: '<path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z"/><path d="M20 9V5a2 2 0 0 0-2-2h-2"/><path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M12 17v-6"/><path d="m9 14 3 3 3-3"/>',
        refreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
        fileCode: '<path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/>',
        puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
        workflow: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
    }
    function lucide(name, size) {
        size = size || 18
        var svgNS = 'http://www.w3.org/2000/svg'
        var svg = document.createElementNS(svgNS, 'svg')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('width', size)
        svg.setAttribute('height', size)
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('stroke-width', '2')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')
        svg.style.verticalAlign = 'middle'
        svg.style.flexShrink = '0'
        svg.innerHTML = lucideIcons[name]
        return svg
    }


    //
    // Set initial transformation (deferred to after canvasWrapper is created)
    //


    //
    // LCD status helper — bounces text between edges when it overflows
    //
    mods.setStatus = function(el, text) {
        el.textContent = text
        if (el._scrollId) cancelAnimationFrame(el._scrollId)
        el.scrollLeft = 0
        var overflow = el.scrollWidth - el.clientWidth
        if (overflow <= 0) return
        var pos = 0
        var direction = 1
        var speed = 0.5
        function step() {
            pos += speed * direction
            if (pos >= overflow) { pos = overflow; direction = -1 }
            if (pos <= 0) { pos = 0; direction = 1 }
            el.scrollLeft = pos
            el._scrollId = requestAnimationFrame(step)
        }
        el._scrollId = requestAnimationFrame(step)
    }

    //
    // audio beep helper — shared AudioContext, callable from modules
    //
    var audioCtx = null
    mods.beep = function(duration, frequency, volume, type) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        var oscillator = audioCtx.createOscillator()
        var gainNode = audioCtx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        gainNode.gain.value = volume || 1
        oscillator.frequency.value = frequency || 440
        oscillator.type = type || 'sine'
        oscillator.start(audioCtx.currentTime)
        oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000))
    }

    ///////////////////////////////////////
    // Fixed Top Bar + Sidebars + Scrim //
    ///////////////////////////////////////
    //
    // Top Bar
    //
    var topbar = document.createElement('div')
    topbar.className = 'mods-topbar'
    topbar.setAttribute('role', 'banner')
    // -- Programs button (left sidebar toggle)
    var btnPrograms = document.createElement('button')
    btnPrograms.className = 'mods-topbar-btn'
    btnPrograms.setAttribute('aria-label', 'Open Programs')
    btnPrograms.setAttribute('aria-expanded', 'false')
    btnPrograms.setAttribute('aria-controls', 'mods-sidebar-left')
    btnPrograms.appendChild(lucide('menu', 16))
    var lblPrograms = document.createElement('span')
    lblPrograms.className = 'mods-topbar-label-side'
    lblPrograms.textContent = 'Programs'
    btnPrograms.appendChild(lblPrograms)
    btnPrograms.addEventListener('click', function() { toggleSidebar('left') })
    topbar.appendChild(btnPrograms)
    // -- Left divider
    var divL = document.createElement('div')
    divL.className = 'mods-topbar-divider'
    topbar.appendChild(divL)
    // -- Save button (hidden unless dev server detected)
    var btnSave = document.createElement('button')
    btnSave.className = 'mods-topbar-btn mods-dev-btn'
    btnSave.setAttribute('aria-label', 'Save program')
    btnSave.appendChild(lucide('save', 16))
    var lblSave = document.createElement('span')
    lblSave.className = 'mods-topbar-label-side'
    lblSave.textContent = 'Save'
    btnSave.appendChild(lblSave)
    btnSave.addEventListener('click', function() { save_in_place() })
    topbar.appendChild(btnSave)
    // probe for dev server (check body, not just status — production
    // servers with SPA fallback return 200 with HTML for unknown routes)
    fetch('/_dev').then(function(r) {
        return r.text()
    }).then(function(body) {
        if (body === 'OK') btnSave.classList.add('visible')
    }).catch(function() {})
    // -- Spacer (fills remaining space between left and right groups)
    var spacer = document.createElement('div')
    spacer.style.cssText = 'flex:1;min-width:0;'
    topbar.appendChild(spacer)
    // -- Prompt span (fixed bottom-left, outside topbar)
    var promptSpan = document.createElement('span')
    promptSpan.setAttribute('id', 'prompt')
    promptSpan.className = 'mods-topbar-prompt'
    var promptInner = document.createElement('span')
    promptSpan.appendChild(promptInner)
    document.body.appendChild(promptSpan)
    // -- Delete link button (hidden, shown when a link is selected)
    var btnDeleteLink = document.createElement('button')
    btnDeleteLink.className = 'mods-topbar-btn mods-action-btn mods-danger'
    btnDeleteLink.setAttribute('aria-label', 'Delete selected link')
    btnDeleteLink.appendChild(lucide('trash', 16))
    btnDeleteLink.addEventListener('click', function() {
        if (mods.ui.selected_link != null) {
            var link = mods.ui.selected_link
            delete_link(link)
            set_prompt('link deleted')
        }
    })
    topbar.appendChild(btnDeleteLink)
    // -- Module action buttons (hidden, shown when modules are selected)
    // Helper: handle both touchend (immediate on iOS) and click (desktop),
    // preventing duplicate fires from iOS synthesized click after touch.
    function addTapListener(el, fn) {
        var touched = false
        el.addEventListener('touchend', function(e) {
            e.preventDefault()
            touched = true
            fn()
        })
        el.addEventListener('click', function() {
            if (touched) { touched = false; return }
            fn()
        })
    }
    var btnCopyModules = document.createElement('button')
    btnCopyModules.className = 'mods-topbar-btn mods-action-btn'
    btnCopyModules.setAttribute('aria-label', 'Copy selected modules')
    btnCopyModules.appendChild(lucide('copy', 16))
    addTapListener(btnCopyModules, function() {
        mods.ui.clipboard = []
        mods.ui._pasteExpired = false
        for (var id in mods.ui.selected) {
            var container = document.getElementById(id)
            if (!container) continue
            mods.ui.clipboard.push({
                definition: update_module_definition(id),
                name: container.dataset.name,
                filename: container.dataset.filename,
                top: parseFloat(container.dataset.top),
                left: parseFloat(container.dataset.left)
            })
        }
        set_prompt(mods.ui.clipboard.length + ' module(s) copied')
    })
    topbar.appendChild(btnCopyModules)

    var btnPasteModules = document.createElement('button')
    btnPasteModules.className = 'mods-topbar-btn mods-action-btn'
    btnPasteModules.setAttribute('aria-label', 'Paste modules')
    btnPasteModules.appendChild(lucide('clipboardPaste', 16))
    addTapListener(btnPasteModules, function() {
        if (!mods.ui.clipboard || mods.ui.clipboard.length === 0) {
            set_prompt('nothing to paste')
            return
        }
        clearModuleSelection()
        var offset = 30
        for (var i = 0; i < mods.ui.clipboard.length; i++) {
            var item = mods.ui.clipboard[i]
            try {
                eval('var args = ' + item.definition)
            } catch (err) {
                console.log(err.message)
                continue
            }
            args.definition = item.definition
            args.id = String(Math.random())
            args.top = item.top + offset
            args.left = item.left + offset
            args.name = item.name
            args.filename = item.filename
            add_module(args)
            mods.ui.selected[args.id] = true
        }
        updateModuleOutlines()
        set_prompt(mods.ui.clipboard.length + ' module(s) pasted')
    })
    topbar.appendChild(btnPasteModules)

    var btnDeleteModules = document.createElement('button')
    btnDeleteModules.className = 'mods-topbar-btn mods-action-btn mods-danger'
    btnDeleteModules.setAttribute('aria-label', 'Delete selected modules')
    btnDeleteModules.appendChild(lucide('trash', 16))
    addTapListener(btnDeleteModules, function() {
        var count = 0
        for (var id in mods.ui.selected) {
            delete_module(id)
            count++
        }
        mods.ui.selected = {}
        set_prompt(count + ' module(s) deleted')
    })
    topbar.appendChild(btnDeleteModules)
    // -- Cancel link button (hidden, shown when in linking mode)
    var btnCancelLink = document.createElement('button')
    btnCancelLink.className = 'mods-topbar-btn mods-action-btn mods-danger'
    btnCancelLink.setAttribute('aria-label', 'Cancel link creation')
    btnCancelLink.appendChild(lucide('x', 16))
    var lblCancel = document.createElement('span')
    lblCancel.className = 'mods-topbar-label-center'
    lblCancel.textContent = 'Cancel'
    btnCancelLink.appendChild(lblCancel)
    btnCancelLink.addEventListener('click', function() {
        delete_temp_link()
        mods.ui.source = null
        set_prompt('add link canceled')
    })
    topbar.appendChild(btnCancelLink)
    // -- Dark/Light Mode button
    var btnDark = document.createElement('button')
    btnDark.className = 'mods-topbar-btn'
    btnDark.setAttribute('aria-label', 'Toggle dark mode')
    function updateDarkBtn() {
        btnDark.textContent = ''
        var lbl = document.createElement('span')
        lbl.className = 'mods-topbar-label-center'
        if (document.documentElement.dataset.theme === 'dark') {
            btnDark.appendChild(lucide('moon', 16))
            lbl.textContent = 'Dark'
        } else {
            btnDark.appendChild(lucide('sun', 16))
            lbl.textContent = 'Light'
        }
        btnDark.appendChild(lbl)
    }
    updateDarkBtn()
    btnDark.addEventListener('click', function() { toggle_dark_mode() })
    topbar.appendChild(btnDark)
    // -- Zoom to Fit button
    var btnFit = document.createElement('button')
    btnFit.className = 'mods-topbar-btn'
    btnFit.setAttribute('aria-label', 'Zoom to fit all modules')
    btnFit.appendChild(lucide('maximize', 16))
    var lblFit = document.createElement('span')
    lblFit.className = 'mods-topbar-label-center'
    lblFit.textContent = 'Fit'
    btnFit.appendChild(lblFit)
    btnFit.addEventListener('click', function() { zoom_extents() })
    topbar.appendChild(btnFit)
    // -- GitLab link button
    var btnGitlab = document.createElement('a')
    btnGitlab.className = 'mods-topbar-btn'
    btnGitlab.setAttribute('href', 'https://gitlab.fabcloud.org/pub/project/mods')
    btnGitlab.setAttribute('target', '_blank')
    btnGitlab.setAttribute('rel', 'noopener')
    btnGitlab.setAttribute('aria-label', 'View project on GitLab')
    btnGitlab.appendChild(lucide('gitlab', 16))
    var lblGitlab = document.createElement('span')
    lblGitlab.className = 'mods-topbar-label-center'
    lblGitlab.textContent = 'Gitlab'
    btnGitlab.appendChild(lblGitlab)
    topbar.appendChild(btnGitlab)
    // -- WebUSB/WebSerial availability indicator
    if (!('usb' in navigator) || !('serial' in navigator)) {
        var hwIndicator = document.createElement('span')
        hwIndicator.className = 'mods-topbar-indicator'
        hwIndicator.setAttribute('aria-label', 'WebUSB/WebSerial not available')
        hwIndicator.appendChild(lucide('unplug', 16))
        var hwTooltip = document.createElement('span')
        hwTooltip.className = 'mods-tooltip'
        hwTooltip.textContent = 'WebUSB/WebSerial unavailable — use Chrome on desktop to control machines'
        topbar.appendChild(hwTooltip)
        hwIndicator.addEventListener('click', function(e) {
            e.stopPropagation()
            var show = !hwTooltip.classList.contains('visible')
            if (show) {
                var r = hwIndicator.getBoundingClientRect()
                hwTooltip.style.top = r.bottom + 4 + 'px'
                hwTooltip.style.right = (window.innerWidth - r.right) + 'px'
            }
            hwTooltip.classList.toggle('visible')
        })
        document.addEventListener('click', function() {
            hwTooltip.classList.remove('visible')
        })
        topbar.appendChild(hwIndicator)
    }
    // -- Right divider
    var divR = document.createElement('div')
    divR.className = 'mods-topbar-divider'
    topbar.appendChild(divR)
    // -- Modules button (right sidebar toggle)
    var btnModules = document.createElement('button')
    btnModules.className = 'mods-topbar-btn'
    btnModules.setAttribute('aria-label', 'Open Modules')
    btnModules.setAttribute('aria-expanded', 'false')
    btnModules.setAttribute('aria-controls', 'mods-sidebar-right')
    var lblModules = document.createElement('span')
    lblModules.className = 'mods-topbar-label-side'
    lblModules.textContent = 'Modules'
    btnModules.appendChild(lblModules)
    btnModules.appendChild(lucide('menu', 16))
    btnModules.addEventListener('click', function() { toggleSidebar('right') })
    topbar.appendChild(btnModules)
    document.body.appendChild(topbar)
    // Hidden spans for logo/version (used by init code)
    var logoSpan = document.createElement('span')
    logoSpan.setAttribute('id', 'logo')
    logoSpan.style.display = 'none'
    document.body.appendChild(logoSpan)
    var verSpan = document.createElement('span')
    verSpan.setAttribute('id', 'version')
    verSpan.style.display = 'none'
    var verInner = document.createElement('span')
    verSpan.appendChild(verInner)
    document.body.appendChild(verSpan)
    //
    // Scrim (backdrop for sidebar dismissal)
    //
    var scrim = document.createElement('div')
    scrim.className = 'mods-scrim'
    scrim.setAttribute('id', 'mods-scrim')
    scrim.addEventListener('click', function() { closeSidebars() })
    document.body.appendChild(scrim)
    //
    // Left Sidebar (Programs)
    //
    var sidebarLeft = document.createElement('div')
    sidebarLeft.className = 'mods-sidebar mods-sidebar-left'
    sidebarLeft.setAttribute('id', 'mods-sidebar-left')
    sidebarLeft.setAttribute('role', 'dialog')
    sidebarLeft.setAttribute('aria-label', 'Programs')
    sidebarLeft.setAttribute('aria-hidden', 'true')
    // heading
    var slHead = document.createElement('div')
    slHead.className = 'mods-sidebar-heading'
    slHead.innerHTML = 'Programs'
    var slClose = document.createElement('button')
    slClose.className = 'mods-sidebar-close'
    slClose.setAttribute('aria-label', 'Close Programs sidebar')
    slClose.appendChild(lucide('x', 18))
    slClose.addEventListener('click', function() { closeSidebars() })
    slHead.appendChild(slClose)
    sidebarLeft.appendChild(slHead)
    // filter input (not needed in standalone exports)
    var slFilter = null
    if (!window.mods_standalone) {
    slFilter = document.createElement('input')
    slFilter.type = 'text'
    slFilter.className = 'mods-sidebar-filter'
    slFilter.placeholder = 'Filter programs...'
    slFilter.addEventListener('input', function() {
        filterSidebar(slContent, slFilter.value)
    })
    sidebarLeft.appendChild(slFilter)
    }
    // content container (populated on open)
    var slContent = document.createElement('div')
    slContent.setAttribute('id', 'mods-sidebar-left-content')
    sidebarLeft.appendChild(slContent)
    document.body.appendChild(sidebarLeft)
    //
    // Right Sidebar (Modules)
    //
    var sidebarRight = document.createElement('div')
    sidebarRight.className = 'mods-sidebar mods-sidebar-right'
    sidebarRight.setAttribute('id', 'mods-sidebar-right')
    sidebarRight.setAttribute('role', 'dialog')
    sidebarRight.setAttribute('aria-label', 'Modules')
    sidebarRight.setAttribute('aria-hidden', 'true')
    // heading
    var srHead = document.createElement('div')
    srHead.className = 'mods-sidebar-heading'
    srHead.innerHTML = 'Modules'
    var srClose = document.createElement('button')
    srClose.className = 'mods-sidebar-close'
    srClose.setAttribute('aria-label', 'Close Modules sidebar')
    srClose.appendChild(lucide('x', 18))
    srClose.addEventListener('click', function() { closeSidebars() })
    srHead.appendChild(srClose)
    sidebarRight.appendChild(srHead)
    // filter input (not needed in standalone exports)
    var srFilter = null
    if (!window.mods_standalone) {
    srFilter = document.createElement('input')
    srFilter.type = 'text'
    srFilter.className = 'mods-sidebar-filter'
    srFilter.placeholder = 'Filter modules...'
    srFilter.addEventListener('input', function() {
        filterSidebar(srContent, srFilter.value)
    })
    sidebarRight.appendChild(srFilter)
    }
    // content container (populated on open)
    var srContent = document.createElement('div')
    srContent.setAttribute('id', 'mods-sidebar-right-content')
    sidebarRight.appendChild(srContent)
    document.body.appendChild(sidebarRight)

    ///////////////////
    // Logo Function // (Neil's style of making a logo)
    ///////////////////
    function logo(size) {
        var x = 0
        var y = 2.8 * size / 3.8
        var svgNS = "http://www.w3.org/2000/svg"
        var logo = document.createElementNS(svgNS, "svg")
        logo.setAttributeNS("http://www.w3.org/2000/xmlns/",
            "xmlns:xlink", "http://www.w3.org/1999/xlink")
        logo.setAttributeNS(null, 'viewBox', "0 0 " + size + " " + size)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x)
        new_rect.setAttribute("y", y)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x + 1.4 * size / 3.8)
        new_rect.setAttribute("y", y)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x + 2.8 * size / 3.8)
        new_rect.setAttribute("y", y)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x)
        new_rect.setAttribute("y", y - 1.4 * size / 3.8)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x + 2.8 * size / 3.8)
        new_rect.setAttribute("y", y - 1.4 * size / 3.8)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x + 1.4 * size / 3.8)
        new_rect.setAttribute("y", y - 2.8 * size / 3.8)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_rect = document.createElementNS(svgNS, "rect");
        new_rect.setAttribute("width", size / 3.8)
        new_rect.setAttribute("height", size / 3.8)
        new_rect.setAttribute("x", x + 2.8 * size / 3.8)
        new_rect.setAttribute("y", y - 2.8 * size / 3.8)
        new_rect.setAttribute("fill", "blue")
        logo.appendChild(new_rect)
        var new_circ = document.createElementNS(svgNS, "circle");
        new_circ.setAttribute("r", size / (2 * 3.8))
        new_circ.setAttribute("cx", x + size / (2 * 3.8))
        new_circ.setAttribute("cy", y + size / (2 * 3.8) - 2.8 * size / 3.8)
        new_circ.setAttribute("fill", "red")
        logo.appendChild(new_circ)
        var new_circ = document.createElementNS(svgNS, "circle");
        new_circ.setAttribute("r", size / (2 * 3.8))
        new_circ.setAttribute("cx", x + size / (2 * 3.8) + 1.4 * size / 3.8)
        new_circ.setAttribute("cy", y + size / (2 * 3.8) - 1.4 * size / 3.8)
        new_circ.setAttribute("fill", "red")
        logo.appendChild(new_circ)
        return logo
    }
    //
    // Add logo to the hidden span (used by init code)
    //
    document.getElementById('logo').appendChild(logo(1))
    //
    // Fixed logo in bottom-right corner
    //
    var logoCorner = document.createElement('div')
    logoCorner.style.cssText = 'position:fixed;bottom:8px;right:8px;z-index:9000;width:50px;height:50px;pointer-events:none;'
    logoCorner.appendChild(logo(50))
    document.body.appendChild(logoCorner)
    function updateLogoTheme() {
        if (document.documentElement.dataset.theme === 'dark') {
            logoCorner.style.opacity = '0.7'
            logoCorner.style.filter = 'grayscale(1) invert(1)'
        } else {
            logoCorner.style.opacity = '0.5'
            logoCorner.style.filter = 'none'
        }
    }
    updateLogoTheme()
    //
    // Sidebar toggle/close functions
    //
    function toggleSidebar(side) {
        if (side === 'left') {
            // Read DOM state to stay in sync after tab switches
            mods.ui.leftSidebarOpen = !sidebarLeft.classList.contains('open')
            if (mods.ui.leftSidebarOpen) {
                mods.ui.rightSidebarOpen = false
                sidebarRight.classList.remove('open')
                sidebarRight.setAttribute('aria-hidden', 'true')
                btnModules.setAttribute('aria-expanded', 'false')
                // Cancel any stale transition from tab backgrounding
                sidebarLeft.style.transition = 'none'
                sidebarLeft.classList.add('open')
                void sidebarLeft.offsetHeight // force reflow
                sidebarLeft.style.transition = ''
                sidebarLeft.setAttribute('aria-hidden', 'false')
                btnPrograms.setAttribute('aria-expanded', 'true')
                scrim.classList.add('visible')
                populatePrograms()
                if (slFilter) {
                    slFilter.value = ''
                    filterSidebar(slContent, '')
                    slFilter.focus()
                }
            } else {
                sidebarLeft.classList.remove('open')
                sidebarLeft.setAttribute('aria-hidden', 'true')
                btnPrograms.setAttribute('aria-expanded', 'false')
                scrim.classList.remove('visible')
            }
        } else {
            // Read DOM state to stay in sync after tab switches
            mods.ui.rightSidebarOpen = !sidebarRight.classList.contains('open')
            if (mods.ui.rightSidebarOpen) {
                mods.ui.leftSidebarOpen = false
                sidebarLeft.classList.remove('open')
                sidebarLeft.setAttribute('aria-hidden', 'true')
                btnPrograms.setAttribute('aria-expanded', 'false')
                // Cancel any stale transition from tab backgrounding
                sidebarRight.style.transition = 'none'
                sidebarRight.classList.add('open')
                void sidebarRight.offsetHeight // force reflow
                sidebarRight.style.transition = ''
                sidebarRight.setAttribute('aria-hidden', 'false')
                btnModules.setAttribute('aria-expanded', 'true')
                scrim.classList.add('visible')
                populateModules()
                if (srFilter) {
                    srFilter.value = ''
                    filterSidebar(srContent, '')
                    srFilter.focus()
                }
            } else {
                sidebarRight.classList.remove('open')
                sidebarRight.setAttribute('aria-hidden', 'true')
                btnModules.setAttribute('aria-expanded', 'false')
                scrim.classList.remove('visible')
            }
        }
    }
    function closeSidebars() {
        mods.ui.leftSidebarOpen = false
        mods.ui.rightSidebarOpen = false
        sidebarLeft.classList.remove('open')
        sidebarLeft.setAttribute('aria-hidden', 'true')
        btnPrograms.setAttribute('aria-expanded', 'false')
        sidebarRight.classList.remove('open')
        sidebarRight.setAttribute('aria-hidden', 'true')
        btnModules.setAttribute('aria-expanded', 'false')
        scrim.classList.remove('visible')
    }
    //
    // Populate Programs sidebar
    //
    function populatePrograms() {
        var container = document.getElementById('mods-sidebar-left-content')
        if (container.childNodes.length > 0) return // already populated
        // action: add program from file
        var openFile = document.createElement('div')
        openFile.className = 'mods-sidebar-action'
        openFile.setAttribute('tabindex', '0')
        openFile.setAttribute('role', 'button')
        openFile.appendChild(lucide('filePlus', 16))
        openFile.appendChild(document.createTextNode('Add from file...'))
        openFile.addEventListener('click', function() {
            closeSidebars()
            var file = document.getElementById('prog_input')
            file.value = null
            file.click()
        })
        container.appendChild(openFile)
        // action: save program
        var saveFile = document.createElement('div')
        saveFile.className = 'mods-sidebar-action'
        saveFile.setAttribute('tabindex', '0')
        saveFile.setAttribute('role', 'button')
        saveFile.appendChild(lucide('download', 16))
        saveFile.appendChild(document.createTextNode('Save program...'))
        saveFile.addEventListener('click', function() {
            closeSidebars()
            save_program()
        })
        container.appendChild(saveFile)
        if (!window.mods_standalone) {
        // action: update all modules
        var updateAll = document.createElement('div')
        updateAll.className = 'mods-sidebar-action'
        updateAll.setAttribute('tabindex', '0')
        updateAll.setAttribute('role', 'button')
        updateAll.appendChild(lucide('refreshCw', 16))
        updateAll.appendChild(document.createTextNode('Update all modules'))
        updateAll.addEventListener('click', function() {
            closeSidebars()
            update_all_modules()
        })
        container.appendChild(updateAll)
        // action: export as HTML
        var exportHtml = document.createElement('div')
        exportHtml.className = 'mods-sidebar-action'
        exportHtml.setAttribute('tabindex', '0')
        exportHtml.setAttribute('role', 'button')
        exportHtml.appendChild(lucide('fileCode', 16))
        exportHtml.appendChild(document.createTextNode('Export as HTML...'))
        exportHtml.addEventListener('click', function() {
            closeSidebars()
            export_standalone_html()
        })
        container.appendChild(exportHtml)
        // action: view local files
        var viewFiles = document.createElement('div')
        viewFiles.className = 'mods-sidebar-action'
        viewFiles.setAttribute('tabindex', '0')
        viewFiles.setAttribute('role', 'button')
        viewFiles.appendChild(lucide('folderOpen', 16))
        viewFiles.appendChild(document.createTextNode('View local files'))
        viewFiles.addEventListener('click', function() {
            closeSidebars()
            window.open('files.html')
        })
        container.appendChild(viewFiles)
        }
        // server programs list (hidden in standalone exports)
        if (!window.mods_standalone) {
        var req = new XMLHttpRequest()
        req.responseType = 'text'
        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var entries = JSON.parse(req.response)
                var prevParts = []
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i]
                    var parts = entry.category.split('/')
                    // emit labels for new category segments
                    var common = 0
                    while (common < prevParts.length && common < parts.length
                        && prevParts[common] === parts[common]) common++
                    for (var d = common; d < parts.length; ++d) {
                        var hr = document.createElement('hr')
                        container.appendChild(hr)
                        var div = document.createElement('div')
                        div.className = 'mods-sidebar-label'
                        div.style.paddingLeft = (4 + d * 16) + 'px'
                        div.textContent = parts[d]
                        container.appendChild(div)
                    }
                    // emit menu item
                    var div = document.createElement('div')
                    div.className = 'mods-sidebar-item'
                    div.style.paddingLeft = (8 + parts.length * 16) + 'px'
                    div.setAttribute('tabindex', '0')
                    div.setAttribute('role', 'button')
                    div.appendChild(lucide('workflow', 14))
                    div.appendChild(document.createTextNode(entry.name))
                    div.addEventListener('click', (function(program) {
                        return function() {
                            closeSidebars()
                            history.replaceState(null, '', '?program=' + encodeURIComponent(program))
                            prog_message_handler(program)
                        }
                    })(entry.path))
                    container.appendChild(div)
                    prevParts = parts
                }
            }
        }
        req.open('GET', 'programs/index.json' + '?rnd=' + Math.random())
        req.send()
        }
    }
    //
    // Populate Modules sidebar
    //
    function populateModules() {
        var container = document.getElementById('mods-sidebar-right-content')
        if (container.childNodes.length > 0) return // already populated
        // action: add module from file
        var openFile = document.createElement('div')
        openFile.className = 'mods-sidebar-action'
        openFile.setAttribute('tabindex', '0')
        openFile.setAttribute('role', 'button')
        openFile.appendChild(lucide('filePlus', 16))
        openFile.appendChild(document.createTextNode('Add from file...'))
        openFile.addEventListener('click', function() {
            closeSidebars()
            // place module at center of viewport
            var t = mods_transform()
            mods.ui.top = t.oy - t.ty + (window.innerHeight / 2 - t.oy) / t.s
            mods.ui.left = t.ox - t.tx + (window.innerWidth / 2 - t.ox) / t.s
            var file = document.getElementById('mod_input')
            file.value = null
            file.click()
        })
        container.appendChild(openFile)
        // server modules list (hidden in standalone exports)
        if (!window.mods_standalone) {
        var req = new XMLHttpRequest()
        req.responseType = 'text'
        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var entries = JSON.parse(req.response)
                var prevParts = []
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i]
                    var parts = entry.category.split('/')
                    // emit labels for new category segments
                    var common = 0
                    while (common < prevParts.length && common < parts.length
                        && prevParts[common] === parts[common]) common++
                    for (var d = common; d < parts.length; ++d) {
                        var hr = document.createElement('hr')
                        container.appendChild(hr)
                        var div = document.createElement('div')
                        div.className = 'mods-sidebar-label'
                        div.style.paddingLeft = (4 + d * 16) + 'px'
                        div.textContent = parts[d]
                        container.appendChild(div)
                    }
                    // emit menu item
                    var div = document.createElement('div')
                    div.className = 'mods-sidebar-item'
                    div.style.paddingLeft = (8 + parts.length * 16) + 'px'
                    div.setAttribute('tabindex', '0')
                    div.setAttribute('role', 'button')
                    div.appendChild(lucide('puzzle', 14))
                    div.appendChild(document.createTextNode(entry.name))
                    div.addEventListener('click', (function(modulePath) {
                        return function() {
                            closeSidebars()
                            // place module at center of viewport
                            var t = mods_transform()
                            var top = t.oy - t.ty + (window.innerHeight / 2 - t.oy) / t.s
                            var left = t.ox - t.tx + (window.innerWidth / 2 - t.ox) / t.s
                            mod_message_handler(modulePath, top, left)
                        }
                    })(entry.path))
                    container.appendChild(div)
                    prevParts = parts
                }
            }
        }
        req.open('GET', 'modules/index.json' + '?rnd=' + Math.random())
        req.send()
        }
    }
    //
    // Filter sidebar items by search text
    //
    function filterSidebar(container, query) {
        var q = query.toLowerCase()
        var children = container.childNodes
        var lastLabel = null
        var lastHr = null
        var labelText = ''
        var sectionHasMatch = false
        for (var i = 0; i < children.length; i++) {
            var el = children[i]
            if (el.tagName === 'HR') {
                if (lastLabel) lastLabel.style.display = sectionHasMatch ? '' : 'none'
                if (lastHr) lastHr.style.display = sectionHasMatch ? '' : 'none'
                lastHr = el
                lastLabel = null
                labelText = ''
                sectionHasMatch = false
            } else if (el.classList && el.classList.contains('mods-sidebar-label')) {
                lastLabel = el
                labelText = el.textContent.toLowerCase()
            } else if (el.classList && el.classList.contains('mods-sidebar-item')) {
                var text = el.textContent.toLowerCase() + ' ' + labelText
                var words = q.split(/\s+/).filter(function(w) { return w !== '' })
                var match = words.length === 0 || words.every(function(w) { return text.indexOf(w) !== -1 })
                el.style.display = match ? '' : 'none'
                if (match) sectionHasMatch = true
            } else if (el.classList && el.classList.contains('mods-sidebar-action')) {
                el.style.display = q === '' ? '' : 'none'
            }
        }
        if (lastLabel) lastLabel.style.display = sectionHasMatch ? '' : 'none'
        if (lastHr) lastHr.style.display = sectionHasMatch ? '' : 'none'
    }
    function toggle_dark_mode() {
        var isDark = document.documentElement.dataset.theme === 'dark'
        document.documentElement.dataset.theme = isDark ? 'light' : 'dark'
        localStorage.setItem('mods-theme', document.documentElement.dataset.theme)
        updateDarkBtn()
        updateLogoTheme()
    }
    //
    // Set the initial prompt
    //
    set_prompt('tap Programs/Modules to start; scroll to zoom, drag to pan')
    //
    // Check local version
    //
    check_version()

    //////////////////////////////////
    // Canvas wrapper (transformed)  //
    //////////////////////////////////
    var canvasWrapper = document.createElement('div')
    canvasWrapper.setAttribute('id', 'mods-canvas')
    canvasWrapper.style.position = 'absolute'
    canvasWrapper.style.top = '0'
    canvasWrapper.style.left = '0'
    canvasWrapper.style.width = '100%'
    canvasWrapper.style.height = '100%'
    canvasWrapper.style.transformOrigin = '0px 0px'
    document.body.appendChild(canvasWrapper)
    //
    // SVG canvas for drawing links
    //
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.style.position = 'absolute'
    svg.style.backgroundColor = 'rgba(200,200,200,0)' // debug for offset check
    svg.style.top = mods.ui.header
    svg.style.left = 0
    svg.style.zIndex = 0 // Original is 0
    svg.style.overflow = 'visible'
    svg.setAttribute('width', 40)
    svg.setAttribute('height', 40)
    svg.setAttribute('id', 'svg')
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
    canvasWrapper.appendChild(svg)
    //
    // SVG dot grid pattern
    //
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    pattern.setAttribute('id', 'mods-grid-pattern')
    pattern.setAttribute('width', '20')
    pattern.setAttribute('height', '20')
    pattern.setAttribute('patternUnits', 'userSpaceOnUse')
    var gridDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    gridDot.setAttribute('id', 'mods-grid-dot')
    gridDot.setAttribute('cx', '10')
    gridDot.setAttribute('cy', '10')
    gridDot.setAttribute('r', '1')
    pattern.appendChild(gridDot)
    defs.appendChild(pattern)
    svg.appendChild(defs)
    var gridRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    gridRect.setAttribute('x', '-15000')
    gridRect.setAttribute('y', '-15000')
    gridRect.setAttribute('width', '30000')
    gridRect.setAttribute('height', '30000')
    gridRect.setAttribute('fill', 'url(#mods-grid-pattern)')
    gridRect.style.pointerEvents = 'none'
    svg.appendChild(gridRect)
    //
    // link container (a group of svg paths)
    //
    var svg = document.getElementById('svg')
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.style.zIndex = 0 // Original is 0, set 2 for debugging links on top
    g.setAttribute('id', 'links')
    svg.appendChild(g)
    //
    // file reading controls
    //
    var file = document.createElement('input')
    file.setAttribute('type', 'file')
    file.setAttribute('id', 'mod_input')
    file.style.position = 'absolute'
    file.style.left = 0
    file.style.top = 0
    file.style.width = 0
    file.style.height = 0
    file.style.opacity = 0
    file.addEventListener('change', function() {
        mod_read_handler()
    })
    canvasWrapper.appendChild(file)
    var file = document.createElement('input')
    file.setAttribute('type', 'file')
    file.setAttribute('id', 'prog_input')
    file.style.position = 'absolute'
    file.style.left = 0
    file.style.top = 0
    file.style.width = 0
    file.style.height = 0
    file.style.opacity = 0
    file.addEventListener('change', function() {
        prog_read_handler()
    })
    canvasWrapper.appendChild(file)
    //
    // module container
    //
    var div = document.createElement('div')
    div.setAttribute('id', 'modules')
    canvasWrapper.appendChild(div)
    //
    // Set initial transformation (now that canvasWrapper exists)
    //
    home()
    //
    // check for program load query
    //
    if (location.search.length > 0) {
        var args = location.search.slice(1).split('&')
        var queryProgram = null
        var querySrc = null
        for (var a in args) {
            var arg = args[a].split('=')
            var val = decodeURIComponent((arg[1] || '').replace(/\+/g, ' '))
            if (arg[0] == 'program')
                queryProgram = val
            else if (arg[0] == 'src')
                querySrc = val
        }
        if (querySrc) mods.ui.querySrc = querySrc
        if (queryProgram) prog_message_handler(queryProgram)
    }
    //
    // listen for postMessage program load from external apps
    //
    window.addEventListener('message', function(e) {
        var data = e.data
        if (!data || data.type !== 'program' || !data.data) return
        var prog = data.data
        if (typeof prog === 'string') {
            try {
                prog = JSON.parse(prog)
            } catch (err) {
                return
            }
        }
        if (e.source) e.source.postMessage('ready', e.origin)
        mods.ui.progname = data.name || 'postMessage'
        mods.ui.progpath = ''
        prog_load(prog)
    })

    //////////////////////
    // program routines //
    //////////////////////
    function prog_read_handler(event) {
        var file = document.getElementById('prog_input')
        var file_reader = new FileReader()
        file_reader.onload = prog_load_handler
        file_reader.readAsText(file.files[0])
        mods.ui.progname = file.files[0].name
        mods.ui.progpath = ''
    }

    function prog_message_handler(filename) {
        var req = new XMLHttpRequest()
        req.responseType = 'text'
        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE) {
                prog = JSON.parse(req.response)
                prog_load(prog)
            }
        }
        mods.ui.progpath = filename
        var index = filename.lastIndexOf('/')
        if (index != -1) {
            mods.ui.progname = filename.slice(index + 1)
        } else
            mods.ui.progname = filename
        //
        // send request, with random query to prevent caching
        //
        req.open('GET', filename + '?rnd=' + Math.random())
        req.send()
    }

    function prog_load_handler(event) {
        prog = JSON.parse(event.target.result)
        prog_load(prog)
    }

    function prog_load(prog) {
        // clear existing modules and links before loading
        var modules = document.getElementById('modules')
        while (modules.firstChild) modules.removeChild(modules.firstChild)
        var svg = document.getElementById('svg')
        var links = svg.getElementById('links')
        while (links.firstChild) links.removeChild(links.firstChild)
        //
        if (prog.version === 2) {
            prog_load_v2(prog)
            return
        }
        //
        // load modules
        //
        for (var idnumber in prog.modules) {
            var module = prog.modules[idnumber]
            var str = module.definition
            try {
                eval('var args = ' + str)
            } catch (err) {
                console.log(err.message)
                return
            }
            args.definition = str
            args.id = idnumber
            var t = mods_transform()
            var xw = t.ox - t.tx + (mods.ui.xstart - t.ox) / t.s
            var yw = t.oy - t.ty + (mods.ui.ystart - t.oy) / t.s - mods.ui.header
            args.top = parseFloat(module.top) + yw
            args.left = parseFloat(module.left) + xw
            args.filename = module.filename
            add_module(args)
        }
        //
        // load links
        //
        for (var linkid in prog.links) {
            var str = prog.links[linkid]
            eval('var link = ' + str)
            eval('var linksrc = ' + link.source)
            eval('var linkdst = ' + link.dest)
            var src = document.getElementById(
                JSON.stringify({
                    id: linksrc.id,
                    type: linksrc.type,
                    name: linksrc.name
                }))
            var dst = document.getElementById(
                JSON.stringify({
                    id: linkdst.id,
                    type: linkdst.type,
                    name: linkdst.name
                }))
            add_link(src, dst)
        }
        // zoom to fit
        zoom_extents()
    }

    function prog_load_v2(prog, options) {
        options = options || {}
        var applyOffset = options.applyOffset !== false
        var warnings = []
        //
        // build fetch promises for each module
        //
        var ids = Object.keys(prog.modules)
        var promises = ids.map(function(idnumber) {
            var entry = prog.modules[idnumber]
            if (entry.module) {
                return fetch_module_source(entry.module).then(function(src) {
                    return { id: idnumber, source: src, entry: entry }
                }).catch(function(err) {
                    warnings.push(entry.module + ': ' + err.message)
                    return null
                })
            } else if (entry.definition) {
                return Promise.resolve({ id: idnumber, source: entry.definition, entry: entry })
            } else {
                warnings.push('Module ' + idnumber + ' has no source or reference')
                return Promise.resolve(null)
            }
        })
        //
        // wait for all fetches, then instantiate
        //
        Promise.all(promises).then(function(results) {
            var t = mods_transform()
            var xw = applyOffset ? t.ox - t.tx + (mods.ui.xstart - t.ox) / t.s : 0
            var yw = applyOffset ? t.oy - t.ty + (mods.ui.ystart - t.oy) / t.s - mods.ui.header : 0
            //
            // instantiate modules
            //
            for (var i = 0; i < results.length; i++) {
                if (results[i] == null) continue
                var r = results[i]
                var str = r.source
                try {
                    eval('var args = ' + str)
                } catch (err) {
                    warnings.push('eval failed for ' + (r.entry.module || r.id) + ': ' + err.message)
                    results[i] = null
                    continue
                }
                args.definition = str
                args.id = r.id
                args.top = parseFloat(r.entry.top) + yw
                args.left = parseFloat(r.entry.left) + xw
                args.filename = r.entry.module || r.entry.filename || ''
                var moduleContainer = add_module(args)
                apply_module_params(r.id, r.entry.params)
                if (r.entry.collapsed) toggle_collapse(moduleContainer)
            }
            //
            // restore links
            //
            for (var linkid in prog.links) {
                var str = prog.links[linkid]
                try {
                    eval('var link = ' + str)
                    eval('var linksrc = ' + link.source)
                    eval('var linkdst = ' + link.dest)
                    var src = document.getElementById(
                        JSON.stringify({
                            id: linksrc.id,
                            type: linksrc.type,
                            name: linksrc.name
                        }))
                    var dst = document.getElementById(
                        JSON.stringify({
                            id: linkdst.id,
                            type: linkdst.type,
                            name: linkdst.name
                        }))
                    if (src && dst)
                        add_link(src, dst)
                    else
                        console.warn('Link endpoint not found:', str)
                } catch (err) {
                    console.warn('Link restore failed:', err.message)
                }
            }
            //
            // zoom to fit
            //
            zoom_extents()
            //
            // inject &src= URL into the matching reader module
            // match file extension to module name (e.g. .png -> "read png")
            //
            if (mods.ui.querySrc) {
                var srcUrl = mods.ui.querySrc
                var ext = srcUrl.split('.').pop().split('?')[0].toLowerCase()
                var containers = document.getElementById('modules').children
                for (var i = 0; i < containers.length; i++) {
                    var name = (containers[i].dataset.name || '').toLowerCase()
                    if (name == 'read ' + ext) {
                        // use the mod.src reference set by reader modules
                        var id = containers[i].getAttribute('id')
                        if (mods.mod[id] && mods.mod[id].src) {
                            mods.mod[id].src.value = srcUrl
                            mods.mod[id].src.dispatchEvent(new Event('input'))
                        }
                        break
                    }
                }
                delete mods.ui.querySrc
            }
            //
            // show warnings if any
            //
            if (warnings.length > 0) {
                console.warn('Program load warnings:', warnings)
                set_prompt(warnings.length + ' module(s) failed to load')
            }
        })
    }

    function save_program() {
        var filename = prompt('program name?', mods.ui.progname.replaceAll("%20","\ "))
        if (filename == null | filename == "") {} else {
            mods.ui.progname = filename
            var prog = build_v2_program()
            //
            // download
            //
            var text = JSON.stringify(prog, null, 2)
            var a = document.createElement('a')
            a.setAttribute('href', 'data:text/plain;charset=utf-8,' +
                encodeURIComponent(text))
            a.setAttribute('download', filename)
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
    }

    function save_in_place() {
        if (!mods.ui.progpath) {
            save_program()
            return
        }
        var prog = build_v2_program()
        var text = JSON.stringify(prog, null, 2)
        var req = new XMLHttpRequest()
        req.open('PUT', mods.ui.progpath)
        req.setRequestHeader('Content-Type', 'application/json')
        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE) {
                if (req.status == 200)
                    set_prompt('Saved!')
                else
                    set_prompt('Save failed: ' + req.statusText)
            }
        }
        req.send(text)
    }

    function build_v2_program() {
        var prog = {
            version: 2,
            modules: {},
            links: []
        }
        var modules = document.getElementById('modules')
        //
        // save modules
        //
        for (var c = 0; c < modules.childNodes.length; ++c) {
            var module = modules.childNodes[c]
            var idnumber = module.id
            var fn = module.dataset.filename
            var entry = {
                top: module.dataset.top,
                left: module.dataset.left,
                params: extract_module_params(idnumber)
            }
            if (fn && fn !== '' && fn !== 'undefined') {
                entry.module = fn
            } else {
                entry.definition = update_module_definition(
                    idnumber, module.dataset.definition)
            }
            if (module.dataset.collapsed === 'true') entry.collapsed = true
            prog.modules[idnumber] = entry
        }
        //
        // save links
        //
        var svg = document.getElementById('svg')
        var links = svg.getElementById('links')
        for (var l = 0; l < links.childNodes.length; ++l) {
            var link = links.childNodes[l]
            var linkid = link.id
            prog.links.push(linkid)
        }
        return prog
    }

    function update_all_modules() {
        var modules = document.getElementById('modules')
        if (modules.childNodes.length === 0) {
            set_prompt('no modules to update')
            return
        }
        //
        // snapshot current state as v2 program
        //
        var prog = build_v2_program()
        //
        // delete all modules (iterate backwards since DOM mutates)
        //
        var ids = []
        for (var c = 0; c < modules.childNodes.length; ++c)
            ids.push(modules.childNodes[c].id)
        for (var i = 0; i < ids.length; i++)
            delete_module(ids[i])
        //
        // reload via v2 loader (no viewport offset — preserve absolute positions)
        //
        set_prompt('updating all modules...')
        prog_load_v2(prog, { applyOffset: false })
    }

    function export_standalone_html() {
        var modules = document.getElementById('modules')
        if (modules.childNodes.length === 0) {
            set_prompt('no modules to export')
            return
        }
        set_prompt('building standalone HTML...')
        //
        // build a v1-style embedded program for portability
        //
        var prog = {
            modules: {},
            links: []
        }
        for (var c = 0; c < modules.childNodes.length; ++c) {
            var module = modules.childNodes[c]
            var idnumber = module.id
            prog.modules[idnumber] = {
                definition: update_module_definition(
                    idnumber, module.dataset.definition),
                top: module.dataset.top,
                left: module.dataset.left,
                filename: module.dataset.filename,
                inputs: {},
                outputs: {}
            }
        }
        var svg = document.getElementById('svg')
        var links = svg.getElementById('links')
        for (var l = 0; l < links.childNodes.length; ++l)
            prog.links.push(links.childNodes[l].id)
        //
        // fetch mods.js source, then build HTML
        //
        fetch_module_source('js/mods.js').then(function(modsSource) {
            var progJson = JSON.stringify(prog)
            var html = '<html>\n<head>\n'
            html += '<meta charset="utf-8">\n'
            html += '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            html += '<title>' + (mods.ui.progname || 'mods program') + '</title>\n'
            html += '</head>\n<body>\n'
            html += '<script>window.mods_standalone = true;<\/script>\n'
            html += '<script>\n' + modsSource + '\n<\/script>\n'
            html += '<script>\n'
            html += 'window.addEventListener("load", function() {\n'
            html += '  var prog = ' + progJson + ';\n'
            html += '  if (window.mods_prog_load) window.mods_prog_load(prog);\n'
            html += '});\n'
            html += '<\/script>\n'
            html += '</body>\n</html>'
            //
            // download
            //
            var filename = (mods.ui.progname || 'program') + '.html'
            var a = document.createElement('a')
            a.setAttribute('href', 'data:text/html;charset=utf-8,' +
                encodeURIComponent(html))
            a.setAttribute('download', filename)
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            set_prompt('exported ' + filename)
        }).catch(function(err) {
            alert('Failed to fetch mods.js: ' + err.message)
            set_prompt('')
        })
    }

    // expose functions for MCP server and external tools
    window.mods_prog_load = prog_load
    window.mods_build_v2_program = build_v2_program

    /////////////////////
    // module routines //
    /////////////////////
    function mod_read_handler(event) {
        var file = document.getElementById('mod_input')
        var file_reader = new FileReader()
        file_reader.onload = mod_load_handler
        file_reader.readAsText(file.files[0])
    }

    function mod_message_handler(filename, top, left) {
        var req = new XMLHttpRequest()
        req.responseType = 'text'
        req.onreadystatechange = function() {
            if (req.readyState == XMLHttpRequest.DONE) {
                var str = req.response
                try {
                    eval('var args = ' + str)
                } catch (err) {
                    console.log(err.message)
                    return
                }
                args.definition = str
                args.id = String(Math.random())
                args.top = top
                args.left = left
                args.filename = filename
                add_module(args)
            }
        }
        //
        // send request, with random query to prevent caching
        //
        req.open('GET', filename + '?rnd=' + Math.random())
        req.send()
    }

    function fetch_module_source(filename) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest()
            req.responseType = 'text'
            req.onreadystatechange = function() {
                if (req.readyState == XMLHttpRequest.DONE) {
                    if (req.status == 200)
                        resolve(req.response)
                    else
                        reject(new Error('Failed to fetch ' + filename + ' (HTTP ' + req.status + ')'))
                }
            }
            req.open('GET', filename + '?rnd=' + Math.random())
            req.send()
        })
    }

    function mod_load_handler(event) {
        str = event.target.result
        try {
            eval('var args = ' + str)
        } catch (err) {
            console.log(err.message)
            return
        }
        args.definition = str
        args.id = String(Math.random())
        args.top = mods.ui.top
        args.left = mods.ui.left
        args.filename = ""
        var div = add_module(args)
        return (div)
    }

    function add_module(args) {
        var idnumber = args.id
        mods.mod[idnumber] = args.mod
        var modules = document.getElementById('modules')
        //
        // container
        //
        var container = document.createElement('div')
        container.setAttribute("id", idnumber)
        container.style.position = "absolute"
        container.style.top = args.top
        container.style.left = args.left
        container.dataset.top = args.top
        container.dataset.left = args.left
        container.dataset.filename = args.filename
        container.dataset.name = args.name
        container.style.zIndex = 0
        container.style.width = window.innerWidth
        container.dataset.definition = args.definition
        container.dataset.collapsed = 'false'
        modules.appendChild(container)
        //
        // name
        //
        var divname = document.createElement('div')
        divname.appendChild(document.createTextNode(args.name))
        divname.addEventListener('mouseover', name_over)
        divname.addEventListener('mouseout', name_out)
        divname.addEventListener('mousedown', name_mousedown)
        divname.addEventListener('touchstart', name_touchdown)
        divname.style.backgroundColor = "rgb(255, 89, 191)"
        divname.style.padding = 1.5 * mods.ui.padding
        divname.style.position = "absolute"
        divname.style.cursor = 'move'
        divname.style.top = 0
        divname.style.left = 0
        divname.style.textAlign = 'center'
        divname.style.border = mods.ui.border + 'px solid'
        divname.style.borderRadius = mods.ui.borderRadius
        container.appendChild(divname)
        //
        // controls
        //
        var divctrl = document.createElement('div')
        var editspan = document.createElement('span')
        editspan.innerHTML = 'edit'
        editspan.style.fontWeight = 'normal'
        editspan.addEventListener('mouseover', function(event) {
            set_prompt('click to edit')
            editspan.style.fontWeight = 'bold'
        })
        editspan.addEventListener('mouseout', function(event) {
            set_prompt('')
            editspan.style.fontWeight = 'normal'
        })
        editspan.addEventListener('mousedown', edit_module)
        divctrl.appendChild(editspan)
        if (args.description) {
            var infospan = document.createElement('span')
            infospan.textContent = ' info'
            infospan.style.fontWeight = 'normal'
            infospan.addEventListener('mouseover', function(event) {
                set_prompt('click for module info')
                infospan.style.fontWeight = 'bold'
            })
            infospan.addEventListener('mouseout', function(event) {
                set_prompt('')
                infospan.style.fontWeight = 'normal'
            })
            infospan.addEventListener('mousedown', function(event) {
                event.stopPropagation()
                // toggle: if tooltip already open, dismiss it
                var existing = document.querySelector('.mods-info-tooltip')
                if (existing) {
                    existing.remove()
                    return
                }
                // create tooltip
                var tip = document.createElement('div')
                tip.className = 'mods-info-tooltip'
                tip.textContent = args.description
                document.body.appendChild(tip)
                // position below the control bar
                var rect = infospan.getBoundingClientRect()
                tip.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px'
                tip.style.top = (rect.bottom + 6) + 'px'
                // dismiss on click outside
                function dismissTip(e) {
                    if (!tip.contains(e.target) && !infospan.contains(e.target)) {
                        tip.remove()
                        document.removeEventListener('mousedown', dismissTip, true)
                        document.removeEventListener('touchstart', dismissTip, true)
                    }
                }
                setTimeout(function() {
                    document.addEventListener('mousedown', dismissTip, true)
                    document.addEventListener('touchstart', dismissTip, true)
                }, 0)
            })
            divctrl.appendChild(infospan)
        }
        var collapsespan = document.createElement('span')
        collapsespan.className = 'mods-collapse-btn'
        collapsespan.textContent = ' collapse'
        collapsespan.style.fontWeight = 'normal'
        collapsespan.addEventListener('mouseover', function(event) {
            set_prompt('click to collapse/expand module')
            collapsespan.style.fontWeight = 'bold'
        })
        collapsespan.addEventListener('mouseout', function(event) {
            set_prompt('')
            collapsespan.style.fontWeight = 'normal'
        })
        collapsespan.addEventListener('mousedown', function(event) {
            event.stopPropagation()
            toggle_collapse(container)
        })
        divctrl.appendChild(collapsespan)
        divctrl.style.backgroundColor = "rgb(200, 200, 200)"
        divctrl.style.padding = mods.ui.padding
        divctrl.style.position = "absolute"
        divctrl.style.cursor = 'default'
        divctrl.style.top = divname.clientHeight + mods.ui.border
        divctrl.style.left = 0
        divctrl.style.textAlign = 'center'
        divctrl.style.border = mods.ui.border + 'px solid'
        divctrl.style.borderRadius = mods.ui.borderRadius
        container.appendChild(divctrl)
        divctrl.style.left = divname.clientWidth / 2 - divctrl.clientWidth / 2 // center align with divname
        //
        // interface
        //
        var divint = document.createElement('div')
        // no thinner than divctrl
        divint.style.minWidth = divctrl.offsetWidth
        divint.style.padding = mods.ui.padding
        divint.style.position = "absolute"
        divint.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
        divint.style.textAlign = 'center'
        // divint.style.border = '2px solid'
        divint.style.borderColor = "rgb(200, 200, 200)"
        divint.style.borderRadius = mods.ui.borderRadius
        divint.style.boxSizing = 'border-box'
        divint.setAttribute('id', JSON.stringify({
            id: idnumber,
            type: 'interface'
        }))
        divint.dataset.id = idnumber
        divint.dataset.divNameSize = divname.clientWidth
        args.interface(divint)
        container.appendChild(divint)
        divint.style.left = divname.clientWidth / 2 - divint.clientWidth / 2 // center align with divname 
        //
        // inputs
        //
        var divin = document.createElement('div')
        divin.setAttribute('id', JSON.stringify({
            id: idnumber,
            type: 'inputs'
        }))
        divin.style.backgroundColor = "rgb(255, 225, 54)"
        divin.style.padding = mods.ui.padding
        divin.style.paddingLeft = '4px'
        divin.style.position = "absolute"
        divin.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
        divin.style.border = mods.ui.border + 'px solid'
        divin.style.borderRadius = mods.ui.borderRadius
        divin.style.cursor = 'default'
        // todo: are the listeners below necessary?
        divin.addEventListener('mousedown', nothing)
        divin.addEventListener('touchstart', nothing)
        divin.addEventListener('mouseup', nothing)
        divin.addEventListener('touchend', nothing)
        // populate divin
        var div = document.createElement('div')
        var b = document.createElement('b')
        b.appendChild(document.createTextNode('inputs'))
        div.appendChild(b)
        div.style.paddingBottom = '7px'
        div.style.textAlign= "right"
        divin.appendChild(div)
        for (var v in args.inputs) {
            var div = document.createElement('div')
            // div.style.borderTop = 'dotted red 2px'
            // label
            div.innerHTML += '> '
            if (args.inputs[v].label != undefined)
            div.innerHTML += args.inputs[v].label
            else
            div.innerHTML += v
            // (type)
            if (args.inputs[v].type != '')
                div.innerHTML += ' (' + args.inputs[v].type + ')'
            div.setAttribute('id', JSON.stringify({
                id: idnumber,
                type: 'inputs',
                name: v
            }))
            div.addEventListener('mouseover', input_over)
            div.addEventListener('mouseout', input_out)
            div.addEventListener('mousedown', input_mousedown)
            div.addEventListener('touchstart', input_touchdown)
            div.dataset.links = JSON.stringify([])
            div.dataset.name = v
            divin.appendChild(div)
            div.dataset.id = JSON.stringify({
                id: idnumber,
                type: 'input',
                name: v,
                rnd: Math.random()
            }) // randomize for unique events
            window.addEventListener(div.dataset.id, args.inputs[v].event)
        }
        // hide if there are no inputs
        if ((Object.keys(args.inputs).length) == 0) 
            divin.style.visibility = 'hidden'
        // align left of divint
        divin.style.left = divname.clientWidth / 2 - divint.clientWidth / 2 - divin.clientWidth 
        for (var i = 1; i < divin.childNodes.length; ++i) {
            divin.childNodes[i].dataset.dx = divin.offsetLeft +
                divin.childNodes[i].offsetLeft
            divin.childNodes[i].dataset.dy = divin.offsetTop +
                divin.childNodes[i].offsetTop +
                divin.childNodes[i].offsetHeight / 2
        }
        // add divin to module container
        container.appendChild(divin)
        //
        // outputs
        //
        var divout = document.createElement('div')
        divout.setAttribute('id', JSON.stringify({
            id: idnumber,
            type: 'outputs'
        }))
        divout.style.backgroundColor = "rgb(255, 163, 25)"
        divout.style.padding = mods.ui.padding
        divout.style.paddingRight = '4px'
        divout.style.position = "absolute"
        divout.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
        divout.style.border = mods.ui.border + 'px solid'
        divout.style.borderRadius = mods.ui.borderRadius
        divout.style.cursor = 'default'
        // todo: are the listeners below necessary?
        divout.addEventListener('mousedown', nothing)
        divout.addEventListener('touchstart', nothing)
        divout.addEventListener('mouseup', nothing)
        divout.addEventListener('touchend', nothing)
        // populate divout
        var div = document.createElement('div')
        var b = document.createElement('b')
        b.appendChild(document.createTextNode('outputs'))
        div.appendChild(b)
        div.style.paddingBottom = '7px'
        divout.appendChild(div)
        for (var v in args.outputs) {
            var div = document.createElement('div')
            if (args.outputs[v].label != undefined)
                div.innerHTML += args.outputs[v].label
            else
                div.innerHTML += v
            if (args.outputs[v].type != '')
                div.innerHTML += ' (' + args.outputs[v].type + ')'
            div.innerHTML += ' >'
            div.setAttribute('id', JSON.stringify({
                id: idnumber,
                type: 'outputs',
                name: v
            }))
            div.style.textAlign= "right"
            div.addEventListener('mouseover', output_over)
            div.addEventListener('mouseout', output_out)
            div.addEventListener('mousedown', output_mousedown)
            div.addEventListener('touchstart', output_touchdown)
            div.dataset.links = JSON.stringify([])
            div.dataset.name = v
            divout.appendChild(div)
            div.dataset.id = JSON.stringify({
                id: idnumber,
                type: 'output',
                name: v,
                rnd: Math.random()
            }) // randomize for unique events
            window.addEventListener(div.dataset.id, args.outputs[v].event)
        }
        // hide if there are no outputs
        if ((Object.keys(args.outputs).length) == 0)
        divout.style.visibility = 'hidden'
        // align right of divint
        divout.style.left = divname.clientWidth / 2 + divint.clientWidth / 2 
        for (var i = 1; i < divout.childNodes.length; ++i) {
            divout.childNodes[i].dataset.dx = divout.offsetLeft +
            divout.childNodes[i].offsetLeft +
            divout.childNodes[i].offsetWidth
            divout.childNodes[i].dataset.dy = divout.offsetTop +
            divout.childNodes[i].offsetTop +
            divout.childNodes[i].offsetHeight / 2
        }
        // add divout to module container
        container.appendChild(divout)
        //
        // adjust divint height no shorter than divin or divout
        divint.style.minHeight = Math.max(divin.offsetHeight, divout.offsetHeight) 

        //
        // initialization
        //
        args.init()
        //
        // resize to contents
        //
        container.style.width = divint.clientWidth + divin.clientWidth + divout.clientWidth
        mods.fit(divint)
        //
        // auto-resize on content changes
        //
        new ResizeObserver(function() { mods.fit(divint) }).observe(divint)
        //
        // return container
        //
        return (container)
    }

    function toggle_collapse(container) {
        var idnumber = container.id
        var divint = document.getElementById(JSON.stringify({id: idnumber, type: 'interface'}))
        var divin = document.getElementById(JSON.stringify({id: idnumber, type: 'inputs'}))
        var divout = document.getElementById(JSON.stringify({id: idnumber, type: 'outputs'}))
        var divctrl = container.childNodes[1] // divname=0, divctrl=1
        var collapsespan = container.querySelector('.mods-collapse-btn')
        var divNameW = parseFloat(divint.dataset.divNameSize)
        if (container.dataset.collapsed === 'true') {
            // expand
            container.dataset.collapsed = 'false'
            container.style.opacity = '1'
            divint.style.display = ''
            divint.style.minHeight = Math.max(divin.offsetHeight, divout.offsetHeight)
            container.style.width = divint.clientWidth + divin.clientWidth + divout.clientWidth
            mods.fit(divint)
            if (collapsespan) collapsespan.textContent = ' collapse'
            // re-center divctrl
            divctrl.style.left = divNameW / 2 - divctrl.clientWidth / 2
        } else {
            // collapse
            container.dataset.collapsed = 'true'
            container.style.opacity = '0.45'
            divint.style.display = 'none'
            if (collapsespan) collapsespan.textContent = ' expand'
            // re-center divctrl after text change
            divctrl.style.left = divNameW / 2 - divctrl.clientWidth / 2
            var centerX = divNameW / 2
            divin.style.left = centerX - divin.clientWidth
            divout.style.left = centerX
            for (var i = 1; i < divin.childNodes.length; ++i) {
                divin.childNodes[i].dataset.dx = divin.offsetLeft + divin.childNodes[i].offsetLeft
                divin.childNodes[i].dataset.dy = divin.offsetTop + divin.childNodes[i].offsetTop + divin.childNodes[i].offsetHeight / 2
            }
            for (var i = 1; i < divout.childNodes.length; ++i) {
                divout.childNodes[i].dataset.dx = divout.offsetLeft + divout.childNodes[i].offsetLeft + divout.childNodes[i].offsetWidth
                divout.childNodes[i].dataset.dy = divout.offsetTop + divout.childNodes[i].offsetTop + divout.childNodes[i].offsetHeight / 2
            }
            container.style.width = divin.clientWidth + divout.clientWidth
            draw_links(idnumber, mods.ui.link_color)
        }
    }

    function delete_module(idnumber) {
        //
        // delete links
        //
        var ins = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'inputs'
            }))
        var outs = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'outputs'
            }))
        for (var i = 1; i < ins.childNodes.length; ++i) {
            var links = JSON.parse(ins.childNodes[i].dataset.links)
            for (var l in links)
                delete_link(links[l])
        }
        for (var i = 1; i < outs.childNodes.length; ++i) {
            var links = JSON.parse(outs.childNodes[i].dataset.links)
            for (var l in links)
                delete_link(links[l])
        }
        //
        // delete container
        //
        var modules = document.getElementById('modules')
        var container = document.getElementById(idnumber)
        modules.removeChild(container)
        //
        // clear prompt
        //
        set_prompt('')
    }

    function update_module_definition(id) {
        //
        // get definition
        //
        var module = document.getElementById(id)
        var def = module.dataset.definition
        //
        // check for mod
        //
        if (mods.mod[id] == undefined)
            return def
        //
        // split definition
        //
        var lines = def.split('\n')
        //
        // find init function
        //
        var line = 0
        while (line < lines.length) {
            if (lines[line].indexOf("var init") != -1)
                break
            line += 1
        }
        //
        // read initializations up to inputs function
        //
        while (line < lines.length) {
            if (lines[line].indexOf(".value =") != -1 && lines[line].indexOf("mod.") != -1) {
                var indent = lines[line].slice(0, lines[line].indexOf("mod."))
                var start = indent.length + 4
                var end = lines[line].indexOf(".value =")
                var key = lines[line].slice(start, end)
                if (mods.mod[id][key] != undefined) {
                    var value = mods.mod[id][key]['value']
                    if (String(value + '\n').indexOf('\n') != -1)
                        value = String(value).replace(/\n/g, "\\n")
                    lines[line] = indent + "mod." + key + ".value = '" + value + "'"
                }
            } else if (lines[line].indexOf(".checked =") != -1 && lines[line].indexOf("mod.") != -1) {
                var indent = lines[line].slice(0, lines[line].indexOf("mod."))
                var start = indent.length + 4
                var end = lines[line].indexOf(".checked")
                var key = lines[line].slice(start, end)
                if (mods.mod[id][key] != undefined) {
                    var value = mods.mod[id][key]['checked']
                    lines[line] = indent + "mod." + key + ".checked = " + value
                }
            }
            if (lines[line].indexOf("var inputs") != -1)
                break
            line += 1
        }
        return (lines.join('\n'))
    }

    function extract_module_params(id) {
        var params = {}
        var mod = mods.mod[id]
        if (mod == undefined) return params
        for (var key in mod) {
            var el = mod[key]
            if (el instanceof HTMLInputElement) {
                if (el.type === 'file') continue
                if (el.type === 'checkbox' || el.type === 'radio')
                    params[key] = { checked: el.checked }
                else
                    params[key] = { value: el.value }
            } else if (el instanceof HTMLSelectElement) {
                params[key] = { value: el.value }
            } else if (el instanceof HTMLTextAreaElement) {
                params[key] = { value: el.value }
            }
        }
        return params
    }

    function apply_module_params(id, params) {
        if (!params) return
        var mod = mods.mod[id]
        if (mod == undefined) return
        for (var key in params) {
            if (mod[key] == undefined) {
                console.warn('apply_module_params: key "' + key + '" not found in module ' + id)
                continue
            }
            try {
                if ('checked' in params[key])
                    mod[key].checked = params[key].checked
                else if ('value' in params[key])
                    mod[key].value = params[key].value
            } catch (e) {
                continue
            }
            // trigger input event so module-local listeners (e.g. update_text) fire
            if (mod[key] instanceof HTMLElement)
                mod[key].dispatchEvent(new Event('input'))
        }
        //
        // src: if module has a src text input and a file input, fetch from server
        //
        if (mod.src instanceof HTMLInputElement && mod.src.type === 'text' &&
            mod.src.value && mod.file instanceof HTMLInputElement && mod.file.type === 'file') {
            var src = mod.src.value
            fetch(src).then(function(resp) {
                if (!resp.ok) return
                return resp.blob()
            }).then(function(blob) {
                if (!blob) return
                var filename = src.split('/').pop()
                var file = new File([blob], filename, {type: blob.type})
                var dt = new DataTransfer()
                dt.items.add(file)
                mod.file.files = dt.files
                mod.file.dispatchEvent(new Event('change'))
            }).catch(function() {})
        }
    }

    //
    // editor helpers (hoisted to module scope)
    //
    function editorIcon(paths, size) {
        var svgNS = 'http://www.w3.org/2000/svg'
        var svg = document.createElementNS(svgNS, 'svg')
        svg.setAttribute('width', size)
        svg.setAttribute('height', size)
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', 'currentColor')
        svg.setAttribute('stroke-width', '2')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')
        var parser = new DOMParser()
        var doc = parser.parseFromString('<svg xmlns="' + svgNS + '">' + paths + '</svg>', 'image/svg+xml')
        var parsed = doc.documentElement
        for (var c = 0; c < parsed.childNodes.length; c++)
            svg.appendChild(document.importNode(parsed.childNodes[c], true))
        return svg
    }
    var ICO = {
        refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
        folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
        check: '<polyline points="20 6 9 17 4 12"/>',
        x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
        minus: '<path d="M5 12h14"/>'
    }
    function tbBtn(iconPaths, title, onclick, opts) {
        opts = opts || {}
        var btn = document.createElement('button')
        btn.title = title
        if (opts.primary) btn.className = 'mods-btn-primary'
        if (iconPaths) btn.appendChild(editorIcon(iconPaths, 15))
        if (opts.label) btn.appendChild(document.createTextNode(opts.label))
        btn.addEventListener('click', onclick)
        return btn
    }
    function tbSep() {
        var sep = document.createElement('div')
        sep.className = 'mods-tb-sep'
        return sep
    }
    //
    // editor state and dialog
    //
    var editorDialog = null
    var editorResizeHandle = null
    var editorState = {}
    var editorCM = null
    var editorText = null
    var editorFontsize = 130

    function ensureCodeMirror(callback) {
        if (window.CodeMirror) { callback(); return }
        // use origin + pathname to avoid query string polluting the path
        var cmBase = (location.origin + location.pathname).replace(/[^\/]*$/, '') + 'js/codemirror/'
        var css = document.createElement('link')
        css.rel = 'stylesheet'
        css.href = cmBase + 'codemirror.min.css'
        document.head.appendChild(css)
        function loadScript(src, onload, onerror) {
            var s = document.createElement('script')
            s.src = src
            s.onload = onload
            s.onerror = onerror || onload
            document.head.appendChild(s)
        }
        loadScript(cmBase + 'codemirror.min.js', function() {
            loadScript(cmBase + 'mode/javascript/javascript.min.js', function() {
                loadScript(cmBase + 'addon/edit/matchbrackets.min.js', callback, callback)
            }, callback)
        }, callback)
    }

    function ensureEditorDialog() {
        if (editorDialog) return
        editorDialog = document.createElement('dialog')
        editorDialog.id = 'mods-editor-dialog'
        editorDialog.addEventListener('close', function() {
            if (editorCM) {
                editorCM.toTextArea()
                editorCM = null
            }
        })
        // stop keyboard events from reaching canvas handlers (DEL, Ctrl+H, etc.)
        var escPending = false
        editorDialog.addEventListener('keydown', function(e) {
            e.stopPropagation()
            if (e.key === 'Escape') {
                e.preventDefault()
                var current = editorCM ? editorCM.getValue() : editorText.value
                if (current !== editorState.def) {
                    if (escPending) {
                        // second ESC — discard
                        escPending = false
                        editorDialog.close()
                    } else {
                        // first ESC — show warning
                        escPending = true
                        var warn = editorDialog.querySelector('.mods-editor-warn')
                        if (!warn) {
                            warn = document.createElement('div')
                            warn.className = 'mods-editor-warn'
                            warn.style.cssText = 'background:#FF75B5;color:#000;text-align:center;padding:4px;font-size:12px;font-weight:bold;flex-shrink:0;'
                            editorDialog.children[1].after(warn)
                        }
                        warn.textContent = 'Unsaved changes — press ESC again to discard'
                        setTimeout(function() {
                            escPending = false
                            if (warn.parentNode) warn.remove()
                        }, 3000)
                    }
                } else {
                    editorDialog.close()
                }
            }
        })
        editorDialog.addEventListener('keyup', function(e) { e.stopPropagation() })
        // stop wheel from zooming the canvas behind the dialog
        editorDialog.addEventListener('wheel', function(e) { e.stopPropagation() })
        // resize handle (stored as module var so it survives dialog clearing)
        editorResizeHandle = document.createElement('div')
        editorResizeHandle.id = 'mods-editor-resize'
        editorDialog.appendChild(editorResizeHandle)
        var resizeDrag = null
        editorResizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault()
            resizeDrag = { startX: e.clientX, startY: e.clientY }
        })
        editorResizeHandle.addEventListener('touchstart', function(e) {
            e.preventDefault()
            var touch = e.touches[0]
            resizeDrag = { startX: touch.clientX, startY: touch.clientY }
        }, { passive: false })
        function resizeMove(clientX, clientY) {
            if (!resizeDrag) return
            var isLandscape = window.innerWidth > window.innerHeight * 4 / 3
            if (isLandscape) {
                var newLeft = Math.max(200, Math.min(window.innerWidth - 200, clientX))
                editorDialog.style.left = newLeft + 'px'
            } else {
                var newTop = Math.max(mods.ui.header + 100, Math.min(window.innerHeight - 100, clientY))
                editorDialog.style.top = newTop + 'px'
            }
            if (editorCM) editorCM.refresh()
        }
        window.addEventListener('mousemove', function(e) {
            if (!resizeDrag) return
            e.preventDefault()
            resizeMove(e.clientX, e.clientY)
        })
        window.addEventListener('touchmove', function(e) {
            if (!resizeDrag) return
            resizeMove(e.touches[0].clientX, e.touches[0].clientY)
        }, { passive: true })
        window.addEventListener('mouseup', function() { resizeDrag = null })
        window.addEventListener('touchend', function() { resizeDrag = null })
        // clear inline position overrides when orientation changes
        var lastOrient = null
        window.addEventListener('resize', function() {
            if (!editorDialog.open) return
            var orient = window.innerWidth > window.innerHeight * 4 / 3 ? 'L' : 'P'
            if (lastOrient && orient !== lastOrient) {
                editorDialog.style.left = ''
                editorDialog.style.top = ''
            }
            lastOrient = orient
            if (editorCM) editorCM.refresh()
        })
        document.body.appendChild(editorDialog)
    }

    function edit_module(evt) {
        var mod = evt.target.parentNode.parentNode
        editorState.idnumber = mod.id
        editorState.def = update_module_definition(editorState.idnumber)
        editorState.top = mod.dataset.top
        editorState.left = mod.dataset.left
        editorState.name = mod.dataset.name
        editorState.filename = mod.dataset.filename
        editorFontsize = 130
        editorCM = null
        //
        ensureEditorDialog()
        editorDialog.textContent = ''
        // reset inline position overrides so CSS defaults apply
        editorDialog.style.left = ''
        editorDialog.style.top = ''
        // re-append resize handle (detached by textContent='', but keeps event listeners)
        editorDialog.appendChild(editorResizeHandle)
        //
        // hidden file input
        //
        var file = document.createElement('input')
        file.setAttribute('type', 'file')
        file.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;opacity:0;'
        file.addEventListener('change', function() {
            if (!file.files[0]) return
            var reader = new FileReader()
            reader.onload = function(event) {
                editorText.value = event.target.result
                if (editorCM) editorCM.setValue(event.target.result)
                update_module()
                editorDialog.close()
            }
            reader.readAsText(file.files[0])
        })
        editorDialog.appendChild(file)
        //
        // toolbar
        //
        var toolbar = document.createElement('div')
        toolbar.className = 'mods-editor-toolbar'
        if (editorState.filename && editorState.filename !== 'undefined' && editorState.filename !== '') {
            toolbar.appendChild(tbBtn(ICO.refresh, 'Reload from server', function() {
                var req = new XMLHttpRequest()
                req.responseType = 'text'
                req.onreadystatechange = function() {
                    if (req.readyState == XMLHttpRequest.DONE) {
                        if (req.status == 200) {
                            editorText.value = req.response
                            if (editorCM) editorCM.setValue(req.response)
                            update_module()
                            editorDialog.close()
                        } else {
                            alert('Module location changed. Use Open instead.')
                        }
                    }
                }
                req.open('GET', editorState.filename + '?rnd=' + Math.random())
                req.send()
            }))
        }
        toolbar.appendChild(tbBtn(ICO.folder, 'Open file', function() {
            file.value = null
            file.click()
        }))
        toolbar.appendChild(tbBtn(ICO.download, 'Save to file', function() {
            var val = editorCM ? editorCM.getValue() : editorText.value
            var a = document.createElement('a')
            a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(val))
            a.setAttribute('download', editorState.name)
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }))
        toolbar.appendChild(tbSep())
        toolbar.appendChild(tbBtn(ICO.check, 'Apply changes', function() {
            update_module()
        }, { label: 'Apply' }))
        toolbar.appendChild(tbBtn(ICO.check, 'Apply and close', function() {
            update_module()
            editorDialog.close()
        }, { label: 'Apply & Close', primary: true }))
        toolbar.appendChild(tbSep())
        toolbar.appendChild(tbBtn(ICO.minus, 'Decrease font', function() {
            editorFontsize /= 1.2; updateEditorFontSize()
        }))
        toolbar.appendChild(tbBtn(ICO.plus, 'Increase font', function() {
            editorFontsize *= 1.2; updateEditorFontSize()
        }))
        toolbar.appendChild(tbSep())
        toolbar.appendChild(tbBtn(ICO.x, 'Close', function() { editorDialog.close() }))
        editorDialog.appendChild(toolbar)
        //
        // textarea
        //
        editorText = document.createElement('textarea')
        editorText.setAttribute('spellcheck', 'false')
        editorText.style.cssText = 'flex:1;width:100%;resize:none;border:none;outline:none;box-sizing:border-box;font-size:' + editorFontsize + '%;background:#292A2B;color:#E6E6E6;padding:8px;font-family:monospace;'
        editorText.value = editorState.def
        editorDialog.appendChild(editorText)
        //
        // show dialog then init CodeMirror
        //
        editorDialog.show()
        // rAF so dialog layout is complete before we read its position
        requestAnimationFrame(function() { panModuleIntoView(editorState.idnumber) })
        ensureCodeMirror(function() {
            if (!window.CodeMirror) return
            if (!editorDialog.open) return
            editorText.style.display = 'none'
            editorCM = CodeMirror(function(el) {
                editorText.parentNode.insertBefore(el, editorText)
            }, {
                value: editorText.value,
                mode: 'javascript',
                theme: 'panda',
                lineNumbers: true,
                indentUnit: 4,
                tabSize: 4,
                matchBrackets: true
            })
            editorCM.getWrapperElement().style.flex = '1'
            editorCM.getWrapperElement().style.fontSize = editorFontsize + '%'
            editorCM.refresh()
        })
    }

    function panModuleIntoView(idnumber) {
        var container = document.getElementById(idnumber)
        if (!container || !editorDialog || !editorDialog.open) return
        // 1. reset transform to measure true positions
        canvasWrapper.style.transformOrigin = '0px 0px'
        canvasWrapper.style.transform = 'scale(1) translate(0px,0px)'
        void canvasWrapper.offsetHeight // force reflow
        // 2. measure module bounding box
        //    childNodes: [0]=divname, [1]=divctrl, [2]=divint, [3]=divin, [4]=divout
        var north = container.childNodes[0].getBoundingClientRect().top
        var east  = container.childNodes[3].getBoundingClientRect().left
        var west  = container.childNodes[4].getBoundingClientRect().right
        var south = container.childNodes[4].getBoundingClientRect().bottom
        var w = west - east
        var h = south - north
        // 3. measure available space next to dialog
        var dialogRect = editorDialog.getBoundingClientRect()
        var isLandscape = dialogRect.left > 0 && dialogRect.top <= mods.ui.header + 1
        var availW, availH, targetX, targetY
        if (isLandscape) {
            availW = dialogRect.left
            availH = window.innerHeight - mods.ui.header
            targetX = availW / 2
            targetY = mods.ui.header + availH / 2
        } else {
            availW = window.innerWidth
            availH = dialogRect.top - mods.ui.header
            targetX = availW / 2
            targetY = mods.ui.header + availH / 2
        }
        // 4. scale to fit module in available space (80% padding)
        var scale = Math.min(availW / w, availH / h) * 0.8
        // 5. center module: s*(cx+tx) = targetX → tx = targetX/s - cx
        var moduleMidX = (east + west) / 2
        var moduleMidY = (north + south) / 2
        var tx = targetX / scale - moduleMidX
        var ty = targetY / scale - moduleMidY
        canvasWrapper.style.transform = 'scale(' + scale + ') translate(' + tx + 'px,' + ty + 'px)'
    }

    function updateEditorFontSize() {
        if (editorText) editorText.style.fontSize = editorFontsize + '%'
        if (editorCM) {
            editorCM.getWrapperElement().style.fontSize = editorFontsize + '%'
            editorCM.refresh()
        }
    }

    function update_module() {
        var idnumber = editorState.idnumber
        //
        // save links
        //
        var ins = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'inputs'
            }))
        var inlinks = []
        for (var i = 1; i < ins.childNodes.length; ++i) {
            var links = JSON.parse(ins.childNodes[i].dataset.links)
            for (var l in links)
                inlinks.push(links[l])
        }
        var outs = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'outputs'
            }))
        var outlinks = []
        for (var i = 1; i < outs.childNodes.length; ++i) {
            var links = JSON.parse(outs.childNodes[i].dataset.links)
            for (var l in links)
                outlinks.push(links[l])
        }
        // validate syntax before deleting (issue #25)
        var def = editorCM ? editorCM.getValue() : editorText.value
        try {
            eval('var args = ' + def) // eslint-disable-line no-eval — mods modules are JS closures by design
        } catch (err) {
            set_prompt('parse error: ' + err.message)
            var container = document.getElementById(idnumber)
            if (container) {
                container.dataset.definition = def
                var errbar = container.querySelector('.mods-error-bar')
                var divname = container.childNodes[0]
                if (!errbar) {
                    errbar = document.createElement('div')
                    errbar.className = 'mods-error-bar'
                    errbar.style.backgroundColor = 'rgb(200, 50, 50)'
                    errbar.style.color = 'white'
                    errbar.style.padding = 1.5 * mods.ui.padding
                    errbar.style.position = 'absolute'
                    errbar.style.left = '0'
                    errbar.style.textAlign = 'center'
                    errbar.style.border = mods.ui.border + 'px solid'
                    errbar.style.borderRadius = mods.ui.borderRadius
                    errbar.style.fontSize = '12px'
                    container.appendChild(errbar)
                }
                errbar.textContent = ''
                errbar.appendChild(document.createTextNode('syntax error \u2014 edit module'))
                errbar.appendChild(document.createElement('br'))
                errbar.appendChild(document.createTextNode(err.message))
                errbar.style.top = -errbar.clientHeight - mods.ui.border
                errbar.style.left = divname.clientWidth / 2 - errbar.clientWidth / 2
            }
            return
        }
        //
        // delete module and re-add
        //
        delete_module(idnumber)
        args.definition = def
        args.id = idnumber
        args.top = editorState.top
        args.left = editorState.left
        args.filename = editorState.filename
        add_module(args)
        //
        // add links
        //
        for (var l in inlinks) {
            eval('var link = ' + inlinks[l]) // eslint-disable-line no-eval
            eval('var linksrc = ' + link.source) // eslint-disable-line no-eval
            eval('var linkdst = ' + link.dest) // eslint-disable-line no-eval
            var src = document.getElementById(
                JSON.stringify({
                    id: linksrc.id,
                    type: linksrc.type,
                    name: linksrc.name
                }))
            var dst = document.getElementById(
                JSON.stringify({
                    id: linkdst.id,
                    type: linkdst.type,
                    name: linkdst.name
                }))
            add_link(src, dst)
        }
        for (var l in outlinks) {
            eval('var link = ' + outlinks[l]) // eslint-disable-line no-eval
            eval('var linksrc = ' + link.source) // eslint-disable-line no-eval
            eval('var linkdst = ' + link.dest) // eslint-disable-line no-eval
            var src = document.getElementById(
                JSON.stringify({
                    id: linksrc.id,
                    type: linksrc.type,
                    name: linksrc.name
                }))
            var dst = document.getElementById(
                JSON.stringify({
                    id: linkdst.id,
                    type: linkdst.type,
                    name: linkdst.name
                }))
            add_link(src, dst)
        }
    }

    /////////////////
    // UI routines //
    /////////////////
    function set_prompt(txt) {
        var span = document.getElementById('prompt')
        span.childNodes[0].innerHTML = ' ' + txt
        // cancel link button
        var linking = mods.ui.source != null
        btnCancelLink.classList.toggle('visible', linking)
        // link actions
        var linkSelected = mods.ui.selected_link != null
        btnDeleteLink.classList.toggle('visible', linkSelected)
        // module actions
        var modulesSelected = Object.keys(mods.ui.selected).length > 0
        btnCopyModules.classList.toggle('visible', modulesSelected)
        btnDeleteModules.classList.toggle('visible', modulesSelected)
        // paste visible if clipboard has content and not expired
        var hasClipboard = mods.ui.clipboard && mods.ui.clipboard.length > 0 && !mods.ui._pasteExpired
        btnPasteModules.classList.toggle('visible', hasClipboard)
        if (hasClipboard) {
            clearTimeout(mods.ui._pasteTimer)
            mods.ui._pasteTimer = setTimeout(function() {
                mods.ui._pasteExpired = true
                btnPasteModules.classList.remove('visible')
            }, 10000)
        }
    }

    function set_version(txt) {
        var span = document.getElementById('version')
        span.childNodes[0].innerHTML = ' ' + txt
        span.childNodes[0].style.fontWeight = 'bold'
    }

    function nothing(evt) {
        evt.preventDefault()
        evt.stopPropagation()
    }

    ///////////////////
    // link routines //
    ///////////////////
    mods.add_link = function(src, dst) {
        add_link(src, dst)
    }

    function add_link(src, dst) {
        //
        // link order from out to in
        //
        if (src.id.indexOf('outputs') == -1) {
            var tmp = src
            src = dst
            dst = tmp
        }
        //
        // check if link exists
        //
        var id = JSON.stringify({
            source: src.id,
            dest: dst.id
        })
        var link = document.getElementById(id)
        if (link != null) {
            //
            // yes, remove it and return
            //
            delete_link(id)
            return
        }
        //
        // no, add link 
        //
        var links = JSON.parse(src.dataset.links)
        links.push(id)
        src.dataset.links = JSON.stringify(links)
        var links = JSON.parse(dst.dataset.links)
        links.push(id)
        dst.dataset.links = JSON.stringify(links)
        //
        // draw link 
        //
        xsrc = src.parentNode.parentNode.offsetLeft +
            parseFloat(src.dataset.dx)
        ysrc = src.parentNode.parentNode.offsetTop +
            parseFloat(src.dataset.dy) -
            mods.ui.header
        xdst = dst.parentNode.parentNode.offsetLeft +
            parseFloat(dst.dataset.dx)
        ydst = dst.parentNode.parentNode.offsetTop +
            parseFloat(dst.dataset.dy) -
            mods.ui.header
        var links = document.getElementById('links')
        // create a group for the link paths
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('id', id)
        // add event listeners
        g.addEventListener('mouseover',link_over)
        g.addEventListener('mouseout',link_out)
        g.addEventListener('mousedown',link_mousedown)
        g.addEventListener('touchstart',link_mousedown)
        // add a white link line
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + mods.ui.bezier) + ',' +
        ysrc + ' ' + (xdst - mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-width', mods.ui.link_stroke_with+4) 
        g.appendChild(path)
        // Add a thinner blue link line over it 
        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path2.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + mods.ui.bezier) + ',' +
        ysrc + ' ' + (xdst - mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
        path2.setAttribute('fill', 'none')
        path2.setAttribute('stroke', mods.ui.link_color)
        path2.setAttribute('stroke-width', mods.ui.link_stroke_with) 
        g.appendChild(path2)
        // var new_circ = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
        // new_circ.setAttribute("points", [[xsrc+2, ysrc + mods.ui.link_stroke_with/2] , [xsrc+2, ysrc - mods.ui.link_stroke_with/2] , [xsrc+2 + 0.866*mods.ui.link_stroke_with , ysrc]] )
        // g.appendChild(new_circ)
        // var new_circ = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        // new_circ.setAttribute("r", mods.ui.link_stroke_with+2)
        // new_circ.setAttribute("cx", xdst)
        // new_circ.setAttribute("cy", ydst)
        // new_circ.setAttribute("fill", mods.ui.link_color)
        // g.appendChild(new_circ)
        // add the group to links container
        links.appendChild(g)
    
        /*
        //
        // don't trigger link
        //
        eval('var evtid = '+src.id)
        evtid.type = 'output'
        var evtstr = JSON.stringify(evtid)
        var evt = new CustomEvent(evtstr)
        window.dispatchEvent(evt)
        */
    }

    function add_temp_link(src,posx,posy) {
        //
        // draw link (in dinamic mode xdst and ydst are current mouse position)
        //
        var t = mods_transform()
        xsrc = src.parentNode.parentNode.offsetLeft +
            parseFloat(src.dataset.dx)
        ysrc = src.parentNode.parentNode.offsetTop +
            parseFloat(src.dataset.dy) -
            mods.ui.header
        // calculate xdst and ydst
        xdst = t.ox - t.tx + (posx-t.ox)/t.s       
        ydst = t.oy - t.ty + (posy-t.oy) / t.s - mods.ui.header
        // reverse bezier if starts from an input
        var sign = 1
        if (JSON.parse(mods.ui.source.dataset.id).type == 'input') {
            sign = -1
        }
        var links = document.getElementById('links')
        // add a temporary link path
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('id', 'temp_link')
        path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + sign*mods.ui.bezier) + ',' +
        ysrc + ' ' + (xdst - sign*mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-linecap', 'round') 
        path.setAttribute('stroke', 'rgb(0,230,0)')
        path.setAttribute('stroke-width', mods.ui.link_stroke_with) 
        path.setAttribute('stroke-dasharray', "5,10") 
        links.appendChild(path)
    }

    function add_stub_link(src) {
        //
        // draw a short dangling stub from the source (for touch devices)
        //
        var xsrc = src.parentNode.parentNode.offsetLeft +
            parseFloat(src.dataset.dx)
        var ysrc = src.parentNode.parentNode.offsetTop +
            parseFloat(src.dataset.dy) -
            mods.ui.header
        var sign = 1
        if (JSON.parse(src.dataset.id).type == 'input') {
            sign = -1
        }
        var stubLen = 40
        var xdst = xsrc + sign * stubLen
        var ydst = ysrc + sign * 15 // slight droop for "dangling cable" look
        var links = document.getElementById('links')
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('id', 'temp_link')
        path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + sign * stubLen * 0.6) + ',' +
            ysrc + ' ' + (xdst - sign * stubLen * 0.3) + ',' + ydst + ' ' + xdst + ',' + ydst)
        path.setAttribute('fill', 'none')
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('stroke', 'rgb(0,230,0)')
        path.setAttribute('stroke-width', mods.ui.link_stroke_with)
        path.setAttribute('stroke-dasharray', '5,10')
        links.appendChild(path)
    }

    function redraw_temp_link(src,posx,posy) {
        //
        // redraws the temp link
        //
        var t = mods_transform()
        xsrc = src.parentNode.parentNode.offsetLeft + parseFloat(src.dataset.dx)
        ysrc = src.parentNode.parentNode.offsetTop + parseFloat(src.dataset.dy) - mods.ui.header
        // calculate xdst and ydst
        xdst = t.ox - t.tx + (posx-t.ox)/t.s       
        ydst = t.oy - t.ty + (posy-t.oy) / t.s - mods.ui.header
        // reverse bezier if starts from an input
        var sign = 1
        if (JSON.parse(mods.ui.source.dataset.id).type == 'input') {
            sign = -1
        }
        // get the temp link path
        var path = document.getElementById('temp_link')
        path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + sign*mods.ui.bezier) + ',' +
        ysrc + ' ' + (xdst - sign*mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
    }



    function delete_link(linkid) {
        //
        // delete a link
        //
        // if we are deleting a selected link, set the flag to null
        if (mods.ui.selected_link == linkid) {
            mods.ui.selected_link = null
        }
        var links = document.getElementById('links') // get the links container
        links.removeChild(document.getElementById(linkid))
        link = JSON.parse(linkid)
        src = document.getElementById(link.source)
        dst = document.getElementById(link.dest)
        var links = JSON.parse(src.dataset.links)
        var index = links.indexOf(linkid)
        links.splice(index, 1)
        src.dataset.links = JSON.stringify(links)
        var links = JSON.parse(dst.dataset.links)
        var index = links.indexOf(linkid)
        links.splice(index, 1)
        dst.dataset.links = JSON.stringify(links)
    }

    function delete_temp_link() {
        //
        // delete a temporary link if exists
        //
        var links = document.getElementById('links') // get the links container
        var temp_link = document.getElementById('temp_link')
        if (typeof(temp_link) != 'undefined' && temp_link != null)
            {
            // Exists.
            links.removeChild(temp_link)
            mods.ui.source = null // possibly duplicated sometimes but it´s not done when you delete a module 
            // tofix because this can be triggered when deleting another module
            }
    }


    function draw_links(idnumber, color) {
        //
        // draw a module's links
        //
        var ins = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'inputs'
            }))
        var outs = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'outputs'
            }))
        for (var i = 1; i < ins.childNodes.length; ++i) {
            var links = JSON.parse(ins.childNodes[i].dataset.links)
            for (var l in links)
                draw_link(links[l], color)
        }
        for (var i = 1; i < outs.childNodes.length; ++i) {
            var links = JSON.parse(outs.childNodes[i].dataset.links)
            for (var l in links)
                draw_link(links[l], color)
        }
    }

    function draw_link(id, color) {
        //
        // actually redraws an existing link
        //
        var link = JSON.parse(id)
        src = document.getElementById(link.source)
        dst = document.getElementById(link.dest)
        xsrc = src.parentNode.parentNode.offsetLeft + parseFloat(src.dataset.dx)
        ysrc = src.parentNode.parentNode.offsetTop + parseFloat(src.dataset.dy) - mods.ui.header
        xdst = dst.parentNode.parentNode.offsetLeft + parseFloat(dst.dataset.dx)
        ydst = dst.parentNode.parentNode.offsetTop + parseFloat(dst.dataset.dy) - mods.ui.header
        // iterate through all paths of the link group
        var g = document.getElementById(id).childNodes // an array of childnodes
        for (var i = 0; i < g.length; ++i) {
            g[i].setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + mods.ui.bezier) + ',' + ysrc + ' ' + (xdst - mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
        }
        // change the color of the top path
        g[1].setAttribute('stroke-linecap', 'butt')
        g[1].setAttribute('stroke-dasharray', "none") 
        g[1].setAttribute('stroke', color)
    }

    ///////////////////
    // mods routines // to be called from modules
    ///////////////////
    mods.fit = function(div) {
        //
        // fit a module. Call this function to redraw the module when it's width changes
        //
        div.style.left = div.dataset.divNameSize / 2 - div.clientWidth / 2
        var divin = document.getElementById(
            JSON.stringify({
                id: div.dataset.id,
                type: 'inputs'
            }))
        divin.style.left = div.dataset.divNameSize / 2 - div.clientWidth / 2 - divin.clientWidth
        // recalculate dx,dy (bugfix issue #6)
        for (var i = 1; i < divin.childNodes.length; ++i) {
            divin.childNodes[i].dataset.dx = divin.offsetLeft +
                divin.childNodes[i].offsetLeft
            divin.childNodes[i].dataset.dy = divin.offsetTop +
                divin.childNodes[i].offsetTop +
                divin.childNodes[i].offsetHeight / 2
        }        
        var divout = document.getElementById(
            JSON.stringify({
                id: div.dataset.id,
                type: 'outputs'
            }))
        divout.style.left = div.dataset.divNameSize / 2 + div.clientWidth / 2
        // recalculate dx,dy (bugfix issue #6)
        for (var i = 1; i < divout.childNodes.length; ++i) {
            divout.childNodes[i].dataset.dx = divout.offsetLeft +
                divout.childNodes[i].offsetLeft +
                divout.childNodes[i].offsetWidth
            divout.childNodes[i].dataset.dy = divout.offsetTop +
                divout.childNodes[i].offsetTop +
                divout.childNodes[i].offsetHeight / 2
        }
        // redraw links (bugfix issue #6)
        // before redrawing, unselect any selected link
        if (mods.ui.selected_link != null) { // a link is selected
            // get the link
            var link = mods.ui.selected_link
            // redraw it solid and flag unselected link
            draw_link(link, mods.ui.link_color)
            mods.ui.selected_link = null
        }
	    draw_links(div.dataset.id, mods.ui.link_color)
    }
    mods.output = function(mod, varname, val) {
        //
        // send module outputs
        //
        var div = mod.div
        var key = JSON.parse(div.id)
        var idnumber = key.id
        var out = document.getElementById(
            JSON.stringify({
                id: idnumber,
                type: 'outputs',
                name: varname
            }))
        var links = JSON.parse(out.dataset.links)
        for (var l in links) {
            var link = JSON.parse(links[l])
            var dest = JSON.parse(link.dest)
            var divin = document.getElementById(JSON.stringify({
                id: dest.id,
                type: 'inputs',
                name: dest.name
            }))
            var evt = new CustomEvent(divin.dataset.id, {
                detail: val
            })
            window.dispatchEvent(evt)
        }
        //
        // notify external tools via postMessage
        //
        var container = document.getElementById(idnumber)
        var message = {
            type: 'moduleOutput',
            module: {
                id: idnumber,
                name: container ? container.dataset.name : ''
            },
            output: varname
        }
        if (val != null && typeof val === 'object'
            && !(val instanceof ImageData)
            && !ArrayBuffer.isView(val)
            && !(val instanceof ArrayBuffer)
            && !Array.isArray(val)) {
            message.data = val
        }
        window.postMessage(message, '*')
    }
    //
    // module modification calls
    //
    mods.module_create = function(args) {
        var event = {
            target: {
                result: args
            }
        }
        var div = mod_load_handler(event)
        return (div)
    }
    mods.module_delete = function(id) {
        delete_module(id)
    }
    mods.module_id = function(div) {
        return div.parentNode.id
    }
    mods.module_left = function(id) {
        var module = document.getElementById(id)
        return (parseInt(module.style.left))
    }
    mods.module_move = function(id, dx, dy) {
    // before moving, unselect any selected link
    if (mods.ui.selected_link != null) { // a link is selected
        // get the link
        var link = mods.ui.selected_link
        // redraw it solid and flag unselected link
        draw_link(link, mods.ui.link_color)
        mods.ui.selected_link = null
    }
    var module = document.getElementById(id)
        var top = parseInt(module.style.top)
        module.style.top = top + dy
        module.dataset.top = top + dy
        var left = parseInt(module.style.left)
        module.style.left = left + dx
        module.dataset.left = left + dx
        draw_links(id, mods.ui.link_color)
    }
    mods.module_inputs = function(id, index) {
        var module = document.getElementById(id)
        var inputs = document.getElementById(
            JSON.stringify({
                id: id,
                type: 'inputs'
            }))
        console.log(inputs.childNodes[index])
    }
    mods.module_outputs = function(id, index) {
        var module = document.getElementById(id)
        var outputs = document.getElementById(
            JSON.stringify({
                id: id,
                type: 'outputs'
            }))
        console.log(outputs.childNodes[index])
    }
    mods.module_position = function(id, x, y) {
        // before moving, unselect any selected link
        if (mods.ui.selected_link != null) { // a link is selected
            // get the link
            var link = mods.ui.selected_link
            // redraw it solid and flag unselected link
            draw_link(link, mods.ui.link_color)
            mods.ui.selected_link = null
        }
        var module = document.getElementById(id)
        var top = parseInt(module.style.top)
        module.style.top = y
        module.dataset.top = y
        var left = parseInt(module.style.left)
        module.style.left = x
        module.dataset.left = x
        draw_links(id, mods.ui.link_color)
    }
    mods.module_top = function(id) {
        var module = document.getElementById(id)
        return (parseInt(module.style.top))
    }
    mods.module_width = function(id) {
        var module = document.getElementById(id)
        return (parseInt(module.clientWidth))
    }

    // mods.module_height = function(id) { // todo: why is height not defined? proposal of definition
    //     var module = document.getElementById(id)
    //     return (parseInt(module.clientHeight))
    // }

    //////////////////////////
    // links event handlers // (TODO)
    //////////////////////////
    function link_over(evt) {
        // get the link
        var link = evt.target.parentNode.id
        // highlight unless I am creating a link
        if (mods.ui.source == null) {
            // and if you are not hovering an already selected link
            if (mods.ui.selected_link == null || mods.ui.selected_link != link) {
                draw_link(link, mods.ui.link_highlight)
                set_prompt('click to select/deselect')
                }   
            }
        }
    function link_out(evt) {
        // get the link
        var link = evt.target.parentNode.id
        // only works when not in the process of creating a link
        if (mods.ui.source == null) {
            // if I am exiting in a non selected link draw link in normal color
            if (mods.ui.selected_link == null || mods.ui.selected_link != link) {
                draw_link(link, mods.ui.link_color)
                set_prompt('')
                }
            }
        }
    function link_mousedown(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        // get the link
        var link = evt.target.parentNode.id
        // only works when not in the process of creating a link
        if (mods.ui.source == null) {
            //
            // if no link was previously selected, select it
            //
            if (mods.ui.selected_link == null) {
                // store selected link
                mods.ui.selected_link = link
                // Format the link
                draw_link(link, mods.ui.link_highlight)
                // set extra formatting (todo: include optional formatting in main function)
                var path = evt.target.parentNode.childNodes[1]
                // console.log(path)
                path.setAttribute('stroke-linecap', 'round')
                path.setAttribute('stroke-dasharray', "5,10") 
                set_prompt('tap link or canvas to deselect')
                }
            //
            // there is a link already selected, if the same one
            //
            else {
                if (mods.ui.selected_link == link) {
                    // unselect the already selected link and redraw it solid
                    mods.ui.selected_link = null
                    draw_link(link, mods.ui.link_highlight)
                    set_prompt('')
                }
                else {
                    //
                    // we have selected a new link
                    //
                    // redraw the old link
                    draw_link(mods.ui.selected_link, mods.ui.link_color)
                    // store the new link
                    mods.ui.selected_link = link
                    // Format the link
                    draw_link(link, mods.ui.link_highlight)
                    // set extra formatting (todo: include optional formatting in main function)
                    var path = evt.target.parentNode.childNodes[1]
                    // console.log(path)
                    path.setAttribute('stroke-linecap', 'round')
                    path.setAttribute('stroke-dasharray', "5,10") 
                    set_prompt('tap link or canvas to deselect')
                }
            }
        }
    }
    //
    // input event handlers
    //
    function input_over(evt) {
        evt.target.style.fontWeight = 'bold'
        //evt.target.style.color = 'red'
        // var links = JSON.parse(evt.target.dataset.links)
        // for (var l in links)
        //     console.log(links[l])
        //     draw_link(links[l], mods.ui.link_highlight)
        if (mods.ui.source == null)
            set_prompt('click to link')
    }

    function input_out(evt) {
        evt.target.style.fontWeight = 'normal'
        //evt.target.style.color = 'black'
        // var links = JSON.parse(evt.target.dataset.links)
        // for (var l in links)
        //     draw_link(links[l], mods.ui.link_color)
        if (mods.ui.source == null)
            set_prompt('')
    }

    function input_mousedown(evt) {
        if (mods.ui.source == null) {
            // this is the first click, set the source
            mods.ui.source = evt.target
            set_prompt('output variable to link/unlink to? ESC to cancel')
            // draw a temporary link
            add_temp_link(mods.ui.source,evt.clientX,evt.clientY)
            window.addEventListener('mousemove', function(e) {
                if (mods.ui.source != null) {
                    redraw_temp_link(mods.ui.source,e.clientX,e.clientY)
                }
            })
        } else {
            // this is the second click
            // check that we are not clicking the same module
            if (JSON.parse(evt.target.dataset.id).id == JSON.parse(mods.ui.source.dataset.id).id) {
                // do not create the link
                set_prompt('choose a different module')
            }
            // check that the source and destination are of different type
            else if (JSON.parse(evt.target.dataset.id).type == JSON.parse(mods.ui.source.dataset.id).type) {
                // do not create the link
                set_prompt('choose an output')
            }
            else {
            // delete the temporary link and create the permanent one
            add_link(mods.ui.source, evt.target)
            delete_temp_link()
            // link created, clear prompt and source
            set_prompt('')
            mods.ui.source = null
        }
        }
    }

    function input_touchdown(evt) {
        if (mods.ui.source == null) {
            // this is the first click, set the source
            mods.ui.source = evt.target
            set_prompt('tap an output to link')
            // draw a dangling stub line from the source
            add_stub_link(mods.ui.source)
        } else {
            // this is the second click
            // check that we are not clicking the same module
            if (JSON.parse(evt.target.dataset.id).id == JSON.parse(mods.ui.source.dataset.id).id) {
                // do not create the link
                set_prompt('choose a different module')
            }
            // check that the source and destination are of different type
            else if (JSON.parse(evt.target.dataset.id).type == JSON.parse(mods.ui.source.dataset.id).type) {
                // do not create the link
                set_prompt('choose an output')
            }
            else {
            add_link(mods.ui.source, evt.target)
            delete_temp_link()
            // link created, clear prompt and source
            set_prompt('')
            mods.ui.source = null
        }
        }
    }
    //
    // output event handlers
    //
    function output_over(evt) {
        evt.target.style.fontWeight = 'bold'
        //evt.target.style.Color = 'red'
        // var links = JSON.parse(evt.target.dataset.links)
        // for (var l in links)
        //     draw_link(links[l], mods.ui.link_highlight)
        if (mods.ui.source == null)
            set_prompt('click to link')
    }

    function output_out(evt) {
        evt.target.style.fontWeight = 'normal'
        //evt.target.style.color = 'black'
        // var links = JSON.parse(evt.target.dataset.links)
        // for (var l in links)
        //     draw_link(links[l], mods.ui.link_color)
        if (mods.ui.source == null)
            set_prompt('')
    }

    function output_mousedown(evt) {
        if (mods.ui.source == null) {
            // this is the first click, set the source
            mods.ui.source = evt.target
            set_prompt('input variable to link/unlink to? ESC to cancel')
            // draw a temporary link
            add_temp_link(mods.ui.source,evt.clientX,evt.clientY)
            window.addEventListener('mousemove', function(e) {
                if (mods.ui.source != null) {
                    // store the mouse position
                    mods.ui.xmouse = evt.clientX
                    mods.ui.ymouse = evt.clientY
                    redraw_temp_link(mods.ui.source,e.clientX,e.clientY)
                }
            })
        } else {
            // this is the second click
            // check that we are not clicking the same module
            if (JSON.parse(evt.target.dataset.id).id == JSON.parse(mods.ui.source.dataset.id).id) {
                // do not create the link
                set_prompt('choose a different module')
            }
            // check that the source and destination are of different type
            else if (JSON.parse(evt.target.dataset.id).type == JSON.parse(mods.ui.source.dataset.id).type) {
                // do not create the link
                set_prompt('choose an input')
            }
            else {
            // delete the temporary link and create the permanent one
            add_link(mods.ui.source, evt.target)
            delete_temp_link()
            // link created, clear prompt and source
            set_prompt('')
            mods.ui.source = null
        }
        }
    }

    function output_touchdown(evt) {
        if (mods.ui.source == null) {
            // this is the first click, set the source
            mods.ui.source = evt.target
            set_prompt('tap an input to link')
            // draw a dangling stub line from the source
            add_stub_link(mods.ui.source)
        } else {
            // this is the second click
            // check that we are not clicking the same module
            if (JSON.parse(evt.target.dataset.id).id == JSON.parse(mods.ui.source.dataset.id).id) {
                // do not create the link
                set_prompt('choose a different module')
            }
            // check that the source and destination are of different type
            else if (JSON.parse(evt.target.dataset.id).type == JSON.parse(mods.ui.source.dataset.id).type) {
                // do not create the link
                set_prompt('choose an input')
            }
            else {
            add_link(mods.ui.source, evt.target)
            delete_temp_link()
            // link created, clear prompt and source
            set_prompt('')
            mods.ui.source = null
        }
        }
    }

    ////////////////////////////////
    // module name event handlers //
    ////////////////////////////////
    function name_over(evt) {
        evt.target.style.fontWeight = 'bold'
        evt.target.style.backgroundColor = "rgb(255, 89, 191)"
        if (mods.ui.source == null)
            set_prompt('click and drag to move')
    }

    function name_out(evt) {
        evt.target.style.fontWeight = 'normal'
        evt.target.style.backgroundColor = "rgb(255, 89, 191)"
        if (mods.ui.source == null)
            set_prompt('')
    }

    function updateModuleOutlines() {
        // drop-shadow on container outlines the combined silhouette of all children
        var glow = 'drop-shadow(0 0 8px #e53e3e)'
        var modules = document.getElementById('modules')
        for (var i = 0; i < modules.childNodes.length; i++) {
            var container = modules.childNodes[i]
            if (!container.id) continue
            var selected = !!mods.ui.selected[container.id]
            container.style.filter = selected ? glow : 'none'
        }
    }
    function clearModuleSelection() {
        mods.ui.selected = {}
        updateModuleOutlines()
    }

    function name_mousedown(evt) {
        // unselect any selected link
        if (mods.ui.selected_link != null) {
            draw_link(mods.ui.selected_link, mods.ui.link_color)
            mods.ui.selected_link = null
        }
        evt.preventDefault()
        evt.stopPropagation()
        var id = evt.target.parentNode.id
        var div = document.getElementById(id)
        div.style.zIndex = 1
        mods.ui.xstart = evt.clientX
        mods.ui.ystart = evt.clientY
        mods.ui.dragged = false
        mods.ui._wasSelected = !!mods.ui.selected[id]
        mods.ui._dragId = id
        mods.ui._shiftKey = evt.shiftKey
        if (evt.shiftKey) {
            // shift+click: toggle this module in/out of selection
            if (mods.ui.selected[id]) {
                delete mods.ui.selected[id]
            } else {
                mods.ui.selected[id] = true
            }
            updateModuleOutlines()
        } else if (!mods.ui.selected[id]) {
            // clicking unselected: clear all, select only this
            mods.ui.selected = {}
            mods.ui.selected[id] = true
            updateModuleOutlines()
        }
        set_prompt('click and drag to move')
        window.addEventListener('mousemove', name_mousemove)
        window.addEventListener('mouseup', name_mouseup)
    }

    function name_mousemove(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        mods.ui.dragged = true
        var t = mods_transform()
        for (var id in mods.ui.selected) {
            var div = document.getElementById(id)
            var dx = (evt.clientX - mods.ui.xstart) / t.s
            var dy = (evt.clientY - mods.ui.ystart) / t.s
            var newleft = parseFloat(div.dataset.left) + dx
            var newtop = parseFloat(div.dataset.top) + dy
            div.style.left = newleft + 'px'
            div.style.top = newtop + 'px'
            draw_links(id, mods.ui.link_color)
        }
    }

    function name_mouseup(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        window.removeEventListener('mousemove', name_mousemove)
        window.removeEventListener('mouseup', name_mouseup)
        var id = mods.ui._dragId
        if (mods.ui.dragged) {
            // drag — finalize positions
            var t = mods_transform()
            for (var sid in mods.ui.selected) {
                var div = document.getElementById(sid)
                div.style.zIndex = 0
                var dx = (evt.clientX - mods.ui.xstart) / t.s
                var dy = (evt.clientY - mods.ui.ystart) / t.s
                div.dataset.left = parseFloat(div.dataset.left) + dx
                div.dataset.top = parseFloat(div.dataset.top) + dy
            }
        } else if (!mods.ui._shiftKey) {
            // click — select only this module
            var div = document.getElementById(id)
            div.style.zIndex = 0
            mods.ui.selected = {}
            mods.ui.selected[id] = true
        }
        updateModuleOutlines()
        set_prompt('')
    }

    var longPressTimer = null

    function name_touchdown(evt) {
        // unselect any selected link
        if (mods.ui.selected_link != null) {
            draw_link(mods.ui.selected_link, mods.ui.link_color)
            mods.ui.selected_link = null
        }
        evt.preventDefault()
        evt.stopPropagation()
        var id = evt.target.parentNode.id
        var div = document.getElementById(id)
        div.style.zIndex = 1
        mods.ui.xstart = evt.changedTouches[0].pageX
        mods.ui.ystart = evt.changedTouches[0].pageY
        mods.ui.dragged = false
        mods.ui._longPressed = false
        mods.ui._wasSelected = !!mods.ui.selected[id]
        mods.ui._dragId = id
        if (!mods.ui.selected[id]) {
            // tapping unselected: clear all, select only this
            mods.ui.selected = {}
            mods.ui.selected[id] = true
        }
        updateModuleOutlines()
        set_prompt('click and drag to move')
        // long-press: toggle selection (add/remove) after 500ms
        longPressTimer = setTimeout(function() {
            mods.ui._longPressed = true
            if (mods.ui._wasSelected) {
                delete mods.ui.selected[id]
            } else {
                mods.ui.selected[id] = true
            }
            updateModuleOutlines()
            set_prompt(Object.keys(mods.ui.selected).length + ' selected')
        }, 500)
        window.addEventListener('touchmove', name_touchmove)
        window.addEventListener('touchend', name_touchup)
    }

    function name_touchmove(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        // cancel long-press if finger moves
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
        mods.ui.dragged = true
        var t = mods_transform()
        for (var id in mods.ui.selected) {
            var div = document.getElementById(id)
            var dx = (evt.changedTouches[0].pageX - mods.ui.xstart) / t.s
            var dy = (evt.changedTouches[0].pageY - mods.ui.ystart) / t.s
            var newleft = parseFloat(div.dataset.left) + dx
            var newtop = parseFloat(div.dataset.top) + dy
            div.style.left = newleft + 'px'
            div.style.top = newtop + 'px'
            draw_links(id, mods.ui.link_color)
        }
    }

    function name_touchup(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
        window.removeEventListener('touchmove', name_touchmove)
        window.removeEventListener('touchend', name_touchup)
        var id = mods.ui._dragId
        if (mods.ui.dragged) {
            var t = mods_transform()
            for (var sid in mods.ui.selected) {
                var div = document.getElementById(sid)
                div.style.zIndex = 0
                var dx = (evt.changedTouches[0].pageX - mods.ui.xstart) / t.s
                var dy = (evt.changedTouches[0].pageY - mods.ui.ystart) / t.s
                div.dataset.left = parseFloat(div.dataset.left) + dx
                div.dataset.top = parseFloat(div.dataset.top) + dy
            }
        } else if (!mods.ui._longPressed) {
            // short tap — select only this module
            var div = document.getElementById(id)
            div.style.zIndex = 0
            mods.ui.selected = {}
            mods.ui.selected[id] = true
        }
        updateModuleOutlines()
        set_prompt('')
    }

    //////////////////////
    // Custom Functions //
    //////////////////////

    //
    // check version function
    //
    function check_version() {
        // is the online version?
            var thisUrl = window.location.href
            console.log(thisUrl.slice(0,23))
            if (thisUrl.slice(0, 23) == 'https://modsproject.org') {
                console.log('running mods online')
                set_version('')
            } else {
                console.log('running local mods')
                // we check the local version
            var localVersion
            var onlineVersion  
                fetch('./version', {
                cache: "no-store",
            })
                    .then(function(response) {
                        response.text().then(function(text) {
                            localVersion = text;
                            console.log('local version: ' + localVersion)
                // now we check the online version.
            fetch('https://modsproject.org/version', {
                cache: "no-store",
                                 })
                                 .then(function(response) {
                         response.text()
                         .then(function(text) {
                                            onlineVersion = text;
                                            console.log('online version: ' + onlineVersion)
                                            // now we compare both
                                            if (parseInt(localVersion) < parseInt(onlineVersion)) {
                                                set_version('outdated local mods, please git pull.')
                                            } else console.log('mods up to date')
                                        });
                                })
                                .catch(function() {
                                    console.log('error getting the online version')
                                })
                        });
                    });
    
            } // end else
        } // end check_version

        //
        // Oscillator for beeps
        //
        function beep(duration, frequency, volume, type) {
            mods.beep(duration, frequency, volume, type)
        }
    //
    // Select all modules function
    //
    function select_all() {
        var modules = document.getElementById('modules')
        mods.ui.selected = {}
        for (var module in modules.childNodes) {
            var container = modules.childNodes[module]
            var id = container.id
            if (id != undefined) {
                var name = container.firstChild
                name.style.fontWeight = "bold"
                mods.ui.selected[id] = true
            }
        }
    }

    //
    // Move to origin and zoom to extents function (overengineered?)
    //
    function zoom_extents() {
        canvasWrapper.style.transform = 'scale(1) translate(0px,-'+mods.ui.header+'px)'
        canvasWrapper.style.transformOrigin = '0px 0px'
        void canvasWrapper.offsetHeight // force reflow before measuring
        // reset selection
        mods.ui.selected = {}
        // reset bounding box coordinates
        var north = null
        var south = null
        var east = null
        var west = null
        // Get the modules
        var modules = document.getElementById('modules')
        // iterate through the modules to find the bounding box coordinates
        for (var module in modules.childNodes) {
            var container = modules.childNodes[module]
            var id = container.id
            if (id != undefined) {
                if (north == null) { north = parseFloat(container.childNodes[0].getBoundingClientRect().top)} // childnodes: divname, divctrl, divint, divin, divout
                else {north = Math.min(parseFloat(container.childNodes[0].getBoundingClientRect().top),north)}
                if (east == null) { east = parseFloat(container.childNodes[3].getBoundingClientRect().left)}
                else {east = Math.min(parseFloat(container.childNodes[3].getBoundingClientRect().left),east)}
                if (west == null) { west = parseFloat(container.childNodes[4].getBoundingClientRect().right)}
                else {west = Math.max(parseFloat(container.childNodes[4].getBoundingClientRect().right),west)}
                if (south == null) { south = parseFloat(container.childNodes[4].getBoundingClientRect().bottom)}
                else {south = Math.max(parseFloat(container.childNodes[4].getBoundingClientRect().bottom),south)}
                // mark the module as selected to move it later
                mods.ui.selected[id] = true
            }
        }
        //
        // calculate the transform
        //
        // get the size of the bounding box
        var w = west - east
        var h = south - north
        // get the available space (subtract top bar height)
        var page_w = window.innerWidth
        var page_h = window.innerHeight - mods.ui.header
        // calculate the scale that fits all the modules
        var scale_h = page_w / w
        var scale_v = page_h / h
        var scale = Math.min(scale_h,scale_v)
        // calculate dx, dy to move all modules to origin (offset for top bar)
        var t = mods_transform()
        var dx =  - east / t.s
        var dy =  - north / t.s + mods.ui.header / scale
        // move the modules to origin
        for (var id in mods.ui.selected) {  // move the modules marked as selected 
            var div = document.getElementById(id)
            var newleft = parseFloat(div.dataset.left) + dx
            var newtop = parseFloat(div.dataset.top) + dy
            // here is the actual move, setting the left and top of the div
            div.style.left = newleft + 'px'
            div.style.top = newtop + 'px'
            // set the changes in the div dataset //todo: why do we have to manually store the position?
            div.dataset.left = newleft
            div.dataset.top = newtop
            draw_links(id, mods.ui.link_color)
        }
        // scale to fit
        canvasWrapper.style.transform = 'scale(' + scale + ',' + scale + ') translate(0px,0px)'
        // deselect all
        mods.ui.selected = {}
    }

    function mods_transform() { // returns the current transform parameters, scale, translation, origin
        var transform = canvasWrapper.style.transform
        var m = new DOMMatrix(getComputedStyle(canvasWrapper).transform)
        var s = m.m11
        var tx = m.m41 / s
        var ty = m.m42 / s
        var origin = canvasWrapper.style.transformOrigin
        var pxx = origin.indexOf('px')
        var ox = parseFloat(origin.slice(0, pxx))
        var pxy = origin.indexOf('px', pxx + 2)
        var oy = parseFloat(origin.slice(pxx + 2, pxy))
        return ({
            s: s,
            tx: tx,
            ty: ty,
            ox: ox,
            oy: oy
        })
    }
    function home() {
        canvasWrapper.style.transform = 'scale(1) translate(0px,0px)'
        canvasWrapper.style.transformOrigin = '0px 0px'
    }
    /////////////////////
    // Event Listeners //
    /////////////////////
    //
    // Global key listeners
    //
    window.addEventListener('keydown', function(e) {
        //
        // Home 'Ctrl+h'
        //
        if (e.key == 'h' && e.ctrlKey) { 
            home()
        }
        //
        // Home 'Ctrl+a'
        //
        if (e.key == 'a' && e.ctrlKey) { 
            select_all()
        }
        //
        // Zoom Extents 'Ctrl+e'
        //
        if (e.key == 'e' && e.ctrlKey) { 
            zoom_extents()
        }
        //
        // Toggle Dark Mode 'Ctrl+d'
        //
        if (e.key == 'd' && e.ctrlKey) {
            toggle_dark_mode()
        }
        //
        // listen for ESC key to cancel link creation or unselect a selected link
        //
        if (e.key == 'Escape') {
            // close sidebars first
            if (mods.ui.leftSidebarOpen || mods.ui.rightSidebarOpen) {
                closeSidebars()
            }
            else if (mods.ui.source != null) { // we are creating a link
                // clear source and exit
                delete_temp_link()
                mods.ui.source = null
                set_prompt('add link canceled')
            }
            else if (mods.ui.selected_link != null) { // a link is selected
                draw_link(mods.ui.selected_link, mods.ui.link_color)
                mods.ui.selected_link = null
                set_prompt('')
            }
            else if (Object.keys(mods.ui.selected).length > 0) {
                clearModuleSelection()
                set_prompt('')
            }
        }
        //
        // listen for DEL key to delete a selected link or selected modules
        //
        if (e.key === "Backspace" || e.key === "Delete") {
            var ae = document.activeElement
            if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable))
                return
            if (mods.ui.selected_link != null) {
                var link = mods.ui.selected_link
                delete_link(link)
                set_prompt('link deleted')
            } else if (Object.keys(mods.ui.selected).length > 0) {
                var count = 0
                for (var id in mods.ui.selected) {
                    delete_module(id)
                    count++
                }
                mods.ui.selected = {}
                set_prompt(count + ' module(s) deleted')
            }
        }
    })
    //
    // scroll wheel event
    //
    window.addEventListener('wheel', function(evt) {
        /*
        (xw+tx-ox)*s+ox = xs
        xw = ox-tx+(xs-ox)/s
        (xw+tx0-ox0)*s+ox0  = (xw+tx1-ox1)*s+ox1
        (tx0-ox0)*s+ox0  = (tx1-ox1)*s+ox1
        tx0+(ox1-ox0)+(ox0-ox1)/s  = tx1
        tx0+(ox1-ox0)*(1-1/s)  = tx1
        */
        var elem = document.elementFromPoint(evt.pageX, evt.pageY) // store where you are using the wheel
        //if ((el.tagName == "HTML") || (el.tagName == "BODY")) { // scroll works in the white area
        var fixedUI = elem && (elem.closest('.mods-topbar') || elem.closest('.mods-sidebar') || elem.closest('.mods-scrim'))
        if (!fixedUI) { // scroll works unless in fixed UI
            set_prompt('scroll to zoom')
            //evt.preventDefault() //
            evt.stopPropagation() // prevents default scroll action
            var t = mods_transform()
            if (evt.deltaY > 0) {
                // scrolling down
                if (evt.deltaY > 100) {
                    // console.log("Scrolling down with mouse");
                    if (t.s < mods.ui.maxzoom)
                    var scale = t.s * 1.1 // sets how fast scales for mouse
                  } else {
                    // console.log("Scrolling down with trackpad");
                    if (t.s < mods.ui.maxzoom)
                    var scale = t.s * 1.02 // sets how fast scales for trackpad
                  }
            } else {
                // scrolling up
                if (evt.deltaY < -100) {
                    // console.log("Scrolling up with mouse");
                    if (t.s > mods.ui.minzoom)
                    var scale = t.s * 0.9 // sets how fast scales for mouse
                  } else {
                    // console.log("Scrolling with up trackpad");
                    if (t.s > mods.ui.minzoom)
                    var scale = t.s * 0.98 // sets how fast scales for trackpad
                  }
            }
            var tx = t.tx + (evt.pageX - t.ox) * (1 - 1 / t.s)
            var ty = t.ty + (evt.pageY - t.oy) * (1 - 1 / t.s)
            canvasWrapper.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`
            canvasWrapper.style.transformOrigin = `${evt.pageX}px ${evt.pageY}px`
        }
    })
    //
    // body mouse events
    //
    window.addEventListener('mousedown', function(evt) {
        //
        // get element mouse is over
        //
        var el = document.elementFromPoint(evt.pageX, evt.pageY)
        //
        // ignore if on fixed UI
        //
        if (el && (el.closest('.mods-topbar') || el.closest('.mods-sidebar') || el.closest('.mods-scrim'))) return
        //
        // check if on body
        //
        if ((el.tagName == "HTML") || (el.tagName == "BODY") || (el.id == "mods-canvas")) {
            //
            // deselect any selected link
            //
            if (mods.ui.selected_link != null) {
                draw_link(mods.ui.selected_link, mods.ui.link_color)
                mods.ui.selected_link = null
                set_prompt('')
            }
            //
            // deselect any selected modules
            //
            clearModuleSelection()
            //
            // remember button
            //
            mods.ui.mousedown = evt.button
            if (mods.ui.mousedown == 0) {
                set_prompt('drag to pan, scroll to zoom')
            }
            //
            // remember position
            //
            var t = mods_transform()
            mods.ui.xstart = evt.pageX
            mods.ui.ystart = evt.pageY
            mods.ui.xtrans = t.tx
            mods.ui.ytrans = t.ty
        }
    })
    window.addEventListener('mousemove', function(evt) {
        //
        // mouse move
        //
        if (mods.ui.mousedown != null) {
            evt.preventDefault()
            evt.stopPropagation()
            var t = mods_transform()
            if (mods.ui.mousedown == 0) {
                //
                // pan on left drag
                //
                xtrans = mods.ui.xtrans + (evt.pageX - mods.ui.xstart) / t.s
                ytrans = mods.ui.ytrans + (evt.pageY - mods.ui.ystart) / t.s
                canvasWrapper.style.transform = `scale(${t.s}) translate(${xtrans}px,${ytrans}px)`
            } else if (mods.ui.mousedown == 1) {
                //
                // select on middle drag
                //
                var rect = document.getElementById('svgrect')
                if (rect == undefined) {
                    //
                    // start dragging
                    //
                    set_prompt('middle-drag to select')
                    var t = mods_transform()
                    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                    rect.setAttribute('id', 'svgrect')
                    rect.setAttribute('x', t.ox - t.tx + (evt.pageX - t.ox) / t.s)
                    rect.setAttribute('y', t.oy - t.ty + (evt.pageY - t.oy) / t.s - mods.ui.header)
                    rect.setAttribute('width', 0)
                    rect.setAttribute('height', 0)
                    rect.setAttribute('fill', 'rgb(200,200,200)')
                    rect.setAttribute('stroke', 'none')
                    var svg = document.getElementById('svg')
                    svg.insertBefore(rect, svg.firstChild)
                } else {
                    //
                    // continue dragging
                    //
                    var rect = document.getElementById('svgrect')
                    var xp = t.ox - t.tx + (mods.ui.xstart - t.ox) / t.s
                    var yp = t.oy - t.ty + (mods.ui.ystart - t.oy) / t.s - mods.ui.header
                    var xw = t.ox - t.tx + (evt.pageX - t.ox) / t.s
                    var yw = t.oy - t.ty + (evt.pageY - t.oy) / t.s - mods.ui.header
                    if (xw < xp) {
                        rect.setAttribute('x', xw)
                        rect.setAttribute('width', xp - xw)
                    } else
                        rect.setAttribute('width', xw - xp)
                    if (yw < yp) {
                        rect.setAttribute('y', yw)
                        rect.setAttribute('height', yp - yw)
                    } else
                        rect.setAttribute('height', yw - yp)
                }
            }
        }
    })
    window.addEventListener('mouseup', function(evt) {
        //
        // mouse up
        //
        mods.ui.mousedown = null
        //
        // check for selection rectangle
        //
        var rect = document.getElementById('svgrect')
        if (rect != null) {
            //
            // rectangle exists, selecting modules
            //
            var x = parseFloat(rect.getAttribute('x'))
            var y = parseFloat(rect.getAttribute('y'))
            var width = parseFloat(rect.getAttribute('width'))
            var height = parseFloat(rect.getAttribute('height'))
            svg.removeChild(rect)
            var modules = document.getElementById('modules')
            //
            // loop to find selected modules
            //
            mods.ui.selected = {}
            for (var module in modules.childNodes) {
                var container = modules.childNodes[module]
                var id = container.id
                if (id != undefined) {
                    var name = container.firstChild // 5 childs divname,divctrl,divint,divin,divout
                    var left = parseFloat(container.dataset.left)
                    var top = parseFloat(container.dataset.top)
                    if ((x <= left) && (left <= x + width) && (y <= top) && (top <= y + height)) {
                        //
                        // module is in selection rectangle
                        //
                        name.style.fontWeight = "bold"
                        mods.ui.selected[id] = true
                    } else {
                        //
                        // module is not in selection rectangle
                        //
                        name.style.fontWeight = "normal"
                    }
                }
            }
            updateModuleOutlines()
        }
    })
    //
    // Prevent Safari native gesture zoom (belt-and-suspenders with touch-action:none)
    //
    var gestureState = {startScale: 1}
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault()
        var t = mods_transform()
        gestureState.startScale = t.s
        gestureState.ox = t.ox
        gestureState.oy = t.oy
        gestureState.tx = t.tx + (e.pageX - t.ox) * (1 - 1 / t.s)
        gestureState.ty = t.ty + (e.pageY - t.oy) * (1 - 1 / t.s)
    }, {passive:false})
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault()
        var scale = gestureState.startScale * e.scale
        scale = Math.max(mods.ui.minzoom, Math.min(mods.ui.maxzoom, scale))
        canvasWrapper.style.transform = 'scale('+scale+') translate('+gestureState.tx+'px,'+gestureState.ty+'px)'
        canvasWrapper.style.transformOrigin = e.pageX+'px '+e.pageY+'px'
        if (Object.keys(mods.ui.selected).length) updateModuleOutlines()
    }, {passive:false})
    document.addEventListener('gestureend', function(e) { e.preventDefault() }, {passive:false})
    //
    // Two-finger touch pan/zoom on canvas
    //
    var touchState = {active: false, dist: 0, cx: 0, cy: 0}
    function touchDist(t) {
        var dx = t[0].pageX - t[1].pageX
        var dy = t[0].pageY - t[1].pageY
        return Math.sqrt(dx*dx + dy*dy)
    }
    function touchCenter(t) {
        return {x: (t[0].pageX+t[1].pageX)/2, y: (t[0].pageY+t[1].pageY)/2}
    }
    window.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // second finger arrived — this is a pinch, not a tap
            touchState.pan = false
            touchState.moved = true // prevent deselection on touchend
            var el0 = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY)
            var el1 = document.elementFromPoint(e.touches[1].pageX, e.touches[1].pageY)
            if ((el0 && (el0.closest('.mods-topbar') || el0.closest('.mods-sidebar'))) ||
                (el1 && (el1.closest('.mods-topbar') || el1.closest('.mods-sidebar')))) return
            touchState.active = true
            touchState.dist = touchDist(e.touches)
            touchState.center = touchCenter(e.touches)
            var t = mods_transform()
            touchState.s = t.s
            touchState.ox = t.ox
            touchState.oy = t.oy
            // compensate for origin shift (same math as wheel handler)
            touchState.tx = t.tx + (touchState.center.x - t.ox) * (1 - 1 / t.s)
            touchState.ty = t.ty + (touchState.center.y - t.oy) * (1 - 1 / t.s)
            e.preventDefault()
        } else if (e.touches.length === 1) {
            var el = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY)
            if (el && (el.closest('.mods-topbar') || el.closest('.mods-sidebar') || el.closest('.mods-scrim'))) return
            if ((el.tagName == "HTML") || (el.tagName == "BODY") || (el.id == "mods-canvas") || (el.id == "mods-grid")) {
                // don't deselect yet — wait for touchend to distinguish tap vs pan
                touchState.pan = true
                touchState.moved = false
                touchState.panX = e.touches[0].pageX
                touchState.panY = e.touches[0].pageY
                var t = mods_transform()
                touchState.tx = t.tx
                touchState.ty = t.ty
                touchState.s = t.s
            }
        }
    }, {passive:false})
    window.addEventListener('touchmove', function(e) {
        if (touchState.active && e.touches.length === 2) {
            e.preventDefault()
            var newDist = touchDist(e.touches)
            var newCenter = touchCenter(e.touches)
            var scale = touchState.s * (newDist / touchState.dist)
            scale = Math.max(mods.ui.minzoom, Math.min(mods.ui.maxzoom, scale))
            var dx = newCenter.x - touchState.center.x
            var dy = newCenter.y - touchState.center.y
            var tx = touchState.tx + dx / scale
            var ty = touchState.ty + dy / scale
            canvasWrapper.style.transform = 'scale('+scale+') translate('+tx+'px,'+ty+'px)'
            canvasWrapper.style.transformOrigin = newCenter.x+'px '+newCenter.y+'px'
        } else if (touchState.pan && e.touches.length === 1) {
            e.preventDefault()
            touchState.moved = true
            var t = mods_transform()
            var tx = touchState.tx + (e.touches[0].pageX - touchState.panX) / t.s
            var ty = touchState.ty + (e.touches[0].pageY - touchState.panY) / t.s
            canvasWrapper.style.transform = 'scale('+t.s+') translate('+tx+'px,'+ty+'px)'
        }
    }, {passive:false})
    window.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) touchState.active = false
        if (e.touches.length === 0) {
            // only deselect if it was a tap on canvas (no movement)
            if (touchState.pan && !touchState.moved) {
                if (mods.ui.selected_link != null) {
                    draw_link(mods.ui.selected_link, mods.ui.link_color)
                    mods.ui.selected_link = null
                }
                clearModuleSelection()
                set_prompt('')
            }
            touchState.pan = false
        }
    }, {passive:false})
    //
    // prevent default context menu
    //
    window.addEventListener('contextmenu', function(e) { e.preventDefault() })


    })()
