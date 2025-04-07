/**
 * @file Declares the history and clear commands.
 */
import type { CommandArgument, CommandFlag } from "../command";
import { Command } from "../command";
import { log, LogLevel } from "../utils/log";

export const historyCommand = new Command({
    name: "history",
    description: "Show the command history",

    // The arguments for the command
    arguments: [],

    // The flags for the command
    flags: [
        {
            name: ["clear", "c", "C"],
            description: "Whether to clear the history without showing it",
            type: "boolean",
            defaultValue: false,
        } as CommandFlag<"clear", "boolean">,
    ],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { consoleHost, flags } = options;

        // If the clear flag is set, clear the history
        if (flags.clear) {
            consoleHost.clearHistory();
            log("History cleared", LogLevel.Log);
            return;
        }

        consoleHost.history.forEach((command, index) => {
            log(`${index + 1} ${command}`, LogLevel.Log);
        });
    },
});

export const clearCommand = new Command({
    name: "clear",
    description: "Clear the console",

    // The arguments for the command
    arguments: [],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        console.clear();
    },
});
