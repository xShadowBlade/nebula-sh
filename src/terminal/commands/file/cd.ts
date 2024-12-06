/**
 * @file Declares the cd and pwd commands.
 */
import { Command } from "../../commands";

import { log, LogLevel } from "../../utils/log";
import { Filesystem } from "../../../filesystem/filesystem";

export const cdCommand = new Command({
    name: "cd",
    description: "Change directory",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path to change to",
            defaultValue: ".",
            required: true,
        },
    ],

    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args } = options;

        const path = args[0];

        // Get the directory
        const directory = options.currentWorkingDirectory.getDirectory(path);

        // If the directory is not found, log an error
        if (!directory) {
            log(`Directory "${path}" not found`, LogLevel.Error);
            return;
        }

        // Set the current working directory
        // options.currentWorkingDirectory = directory;
        options.consoleHost.currentWorkingDirectory = directory;

        // log(`Changed to directory "${path}"`, LogLevel.Log);
    },
});

export const pwdCommand = new Command({
    name: "pwd",
    description: "Print working directory",

    // The arguments for the command
    arguments: [],

    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        log(options.currentWorkingDirectory.path || "/", LogLevel.Log);
    },
});
