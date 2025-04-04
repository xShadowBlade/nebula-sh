/**
 * @file Declares the whoami command.
 */
import { Command } from "../../command";
import { log, LogLevel } from "../../utils/log";

export const whoamiCommand = new Command({
    name: "whoami",
    description: "Print the current user",

    arguments: [],

    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        log(options.consoleHost.currentUser.name, LogLevel.Log);
    },
});

export const listUsersCommand = new Command({
    name: "listusers",
    description: "List all users",

    arguments: [],

    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        options.consoleHost.users.forEach((user) => {
            log(user.name, LogLevel.Log);
        });
    },
});
