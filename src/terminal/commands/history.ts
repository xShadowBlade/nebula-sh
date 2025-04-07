/**
 * @file Declares the history and clear commands.
 */
import { Command } from "../command";
import { log, LogLevel } from "../utils/log";

export const historyCommand = new Command({
    name: "history",
    description: "A template command (wow this has so much boilerplate)",

    // The arguments for the command
    arguments: [],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { consoleHost } = options;

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
