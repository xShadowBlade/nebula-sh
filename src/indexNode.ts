/**
 * @file The main entry point for the application (Node.js version).
 */
import { defaultComputer } from "./computer/computer";

// Node exclusive imports
import readline from "node:readline/promises";

/**
 * Runs the application in a node repl.
 */
export async function run(): Promise<void> {
    // Create a readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Handle SIGINT (Ctrl+C) gracefully
    process.on("SIGINT", () => {
        rl.close();
        process.exit(0);
    });

    // Start the loop
    console.clear();

    while (true) {
        await rl.question(defaultComputer.consoleHost.getPrompt()).then((input) => {
            defaultComputer.consoleHost.runCommand(input, undefined, false);
        });
    }
}
