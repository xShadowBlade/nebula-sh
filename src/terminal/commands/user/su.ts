/**
 * @file Declares the su command.
 */
import { Command } from "../commands";
import { log, LogLevel } from "../../utils/log";

export const suCommand = new Command({
    name: "su",
    description: "Switch user",

    // The arguments for the command
    arguments: [
        {
            name: "user",
            description: "The user to switch to",
            defaultValue: "root",
            required: false,
        },
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, consoleHost } = options;

        const userName = args[0];

        // Get the user
        const userToSwitchTo = consoleHost.getUser(userName);

        // If the user is not found, log an error
        if (!userToSwitchTo) {
            log(`User "${userName}" not found`, LogLevel.Error);
            return;
        }

        // Switch the user
        consoleHost.currentUser = userToSwitchTo;
    },
});
