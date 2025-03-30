/**
 * @file This file is the entry point for your project.
 */

import "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

import { Terminal } from "@xterm/xterm";
import { NebulaShAddon } from "nebula-sh";

// Create a new terminal
const terminal = new Terminal({
    // Font and letter
    fontFamily: "JetBrains Mono, monospace",
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 1.4,
    fontWeight: "400",
    fontWeightBold: "600",
    allowTransparency: true,

    // Cursor
    // Disabled because of custom blink css
    // cursorBlink: true,
    cursorStyle: "block",
    cursorInactiveStyle: "block",
    smoothScrollDuration: 100,

    theme: {
        background: "#151515",
        foreground: "#fff",
        cursor: "#fff",

        // ANSI colors (changed to be brighter)
        black: "#333333",
        red: "#ff6e73",
        green: "#98e06a",
        yellow: "#ffd74d",
        blue: "#64a5ff",
        magenta: "#d46dff",
        cyan: "#6ae0ff",
        white: "#eaeaea",
    },
});

// Load the addon
const addon = new NebulaShAddon();
terminal.loadAddon(addon);

// Debug
Object.assign(window, { terminal, addon });

// Attach the terminal to the DOM
terminal.open(document.getElementById("terminal") ?? document.body);
