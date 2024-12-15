/**
 * @file Declares a template for a command.
 */
import { Command } from "../command";
import { log, LogLevel } from "../utils/log";

export const templateCommand = new Command({
    name: "template",
    description: "A template command (wow this has so much boilerplate)",

    // The arguments for the command
    arguments: [],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        log("Hello, World!", LogLevel.Log);
    },
});
