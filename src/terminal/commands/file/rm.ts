/**
 * @file Declares the rm command.
 */
import type { CommandArgument, CommandFlag } from "../../commands";
import { Command } from "../../commands";
import { log, LogLevel } from "../../utils/log";
import { Filesystem } from "../../../filesystem/filesystem";

export const rmCommand = new Command({
    name: "rm",
    description: "Removes a file or directory.",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path to the file or directory to remove.",
            defaultValue: "",
            required: true,
        } as CommandArgument<string>,
    ],

    // The flags for the command
    flags: [
        {
            name: ["recursive", "r", "R"],
            description: "Recursively remove the file or directory.",
            defaultValue: false,
        } as CommandFlag<"recursive", boolean>,
        {
            name: ["force", "f"],
            description: "Force the removal of the file or directory.",
            defaultValue: false,
        } as CommandFlag<"force", boolean>,
        // (not because I am too lazy to implement multiple flags in a single space)
        {
            name: "rf",
            description: "Recursively and forcefully remove the file or directory.",
            defaultValue: false,
        } as CommandFlag<"rf", boolean>,
    ] as const,

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, flags, currentWorkingDirectory } = options;

        // TODO: add recursive and force flags
        const recursive = flags.recursive || flags.rf;
        const force = flags.force || flags.rf;

        // Get the path to the file or directory to remove
        const pathParts = Filesystem.getPathParts(args[0]);
        const parentDirectory = currentWorkingDirectory.getParentDirectoryOfPath(pathParts);
        const fileOrDirectoryName = pathParts[pathParts.length - 1];

        // If the directory does not exist, log an error
        if (!parentDirectory) {
            log(`Directory "${args[0]}" not found`, LogLevel.Error);
            return;
        }

        // If the path is a file, remove the file
        const fileToDelete = parentDirectory.getFileInDirectory(fileOrDirectoryName);
        if (fileToDelete) {
            parentDirectory.removeFile(fileOrDirectoryName);
            return;
        }

        // If the path is a directory, remove the directory
        const directoryToDelete = parentDirectory.getDirectoryInDirectory(fileOrDirectoryName);
        if (directoryToDelete) {
            parentDirectory.removeDirectory(fileOrDirectoryName);
            return;
        }
    },
});
