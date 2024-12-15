/**
 * @file This file is the entry point for your project.
 */
// import React from "react";
// import { createRoot } from "react-dom/client";

import { Terminal } from "@xterm/xterm";
// import { NebulaShAddon } from "nebula-sh";

/**
 * @returns The root component of the application.
 */
// const App: React.FC = () => {
//     return (
//         <>
//             <p>Hello World!</p>
//         </>
//     );
// };

// const root = createRoot(document.getElementById("root") ?? document.body);
// root.render(<App />);

// Create a new terminal
const terminal = new Terminal();

// Load the addon

// Attach the terminal to the DOM
terminal.open(document.getElementById("root") ?? document.body);
