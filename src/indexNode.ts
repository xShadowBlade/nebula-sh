/**
 * @file The main entry point for the application (Node.js version).
 */
import { defaultComputer } from "./computer/computer";

// Node exclusive imports
import readline from "node:readline/promises";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Handle SIGINT
process.on("SIGINT", () => {
    rl.close();
    process.exit(0);
});

// Start the loop
(async (): Promise<void> => {
    console.clear();

    while (true) {
        await rl.question(defaultComputer.consoleHost.getPrompt()).then((input) => {
            defaultComputer.consoleHost.runCommand(input, undefined, false);
        });
    }
})();
