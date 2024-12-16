/**
 * @file Declares the command to edit a file.
 */
import type { CommandArgument } from "../../../command";
import { Command } from "../../../command";
import { log, LogLevel } from "../../../utils/log";

export const edit = new Command({
    name: "edit",
    description: "Edit a file",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path to the file to edit",
            type: "path",
            defaultValue: ".",
            required: true,
        } as CommandArgument<"path">,
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, currentWorkingDirectory, consoleHost } = options;
        // log("Hello, World!", LogLevel.Log);

        // Get the file
        const fileToEdit = currentWorkingDirectory.getFile(args[0]);

        // If the file is not found, log an error
        if (!fileToEdit) {
            log(`File "${args[0]}" not found`, LogLevel.Error);
            return;
        }
    },
});
