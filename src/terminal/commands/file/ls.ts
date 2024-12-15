/**
 * @file Declares the ls command.
 */
import { Directory } from "../../../filesystem/directory";
import { log, LogLevel } from "../../utils/log";

import { Command } from "../../command";
import type { CommandFlag, CommandArgument } from "../../command";

/**
 * The options for {@link logDirectoryContents}.
 */
interface LogDirectoryContentsOptions {
    /**
     * The directory to log.
     */
    directory: Directory;

    /**
     * Whether to log subdirectories recursively.
     */
    recurse: boolean;

    /**
     * The current depth.
     */
    depth: number;
}

/**
 * Logs the contents of a directory.
 * @param options - The options for the function.
 */
function logDirectoryContents(options: LogDirectoryContentsOptions): void {
    const { directory, recurse, depth } = options;

    directory.contents.forEach((content) => {
        const prefix = "  ".repeat(depth) + (depth > 0 ? "└─ " : "");

        log(prefix + content.name, LogLevel.Log);

        // Recurse
        if (recurse && content instanceof Directory) {
            logDirectoryContents({
                ...options,
                directory: content,
                depth: depth + 1,
            });
        }
    });
}

// Command test
export const lsCommand = new Command({
    name: "ls",
    description: "List directory contents",

    // The arguments for the command
    arguments: [
        {
            name: "directory",
            description: "The directory to list",
            type: "path",
            defaultValue: ".",
            required: false,
        } as CommandArgument<"path">,
    ] as const satisfies CommandArgument[],

    // The flags for the command
    flags: [
        {
            name: ["recursive", "recurse", "R", "r"],
            description: "List subdirectories recursively",
            type: "boolean",
            defaultValue: false,
        } as CommandFlag<"recursive", "boolean">,
    ] satisfies CommandFlag[],

    // The command function
    onCommand: (options): void => {
        const { args, flags, currentWorkingDirectory } = options;
        // log("args:", LogLevel.Info, args);
        // log("flags:", LogLevel.Info, flags);

        // Get the directory
        const directory = args[0] ? currentWorkingDirectory.getDirectory(args[0]) : currentWorkingDirectory;

        // If the directory is not found, log an error
        if (!directory) {
            log(`Directory "${args[0]}" not found`, LogLevel.Error);
            log("currentWorkingDirectory:", LogLevel.Debug, currentWorkingDirectory);
            log("directory:", LogLevel.Debug, directory);
            return;
        }

        // Log the directory contents
        logDirectoryContents({
            directory,
            recurse: flags.recursive,
            depth: 0,
        });

        // TODO: Implement flags
    },
});
// computer.commandDriver.addCommand(lsCommand);

// computer.commandDriver.runCommandString("ls", { currentWorkingDirectory: computer.filesystem.getDirectory("/folder") });
