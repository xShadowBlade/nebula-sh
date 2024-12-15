/**
 * @file This file is the entry point for your project.
 */

import "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

import { Terminal } from "@xterm/xterm";
import { NebulaShAddon } from "nebula-sh";

// import * as NebulaSh from "nebula-sh";

// Test
// console.log(NebulaSh);

// Create a new terminal
const terminal = new Terminal();

// Load the addon
const addon = new NebulaShAddon();
terminal.loadAddon(addon);

// Debug
Object.assign(window, { terminal, addon });

// Attach the terminal to the DOM
terminal.open(document.getElementById("root") ?? document.body);
