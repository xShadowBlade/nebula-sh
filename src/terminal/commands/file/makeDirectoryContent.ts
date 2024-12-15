/**
 * @file Declares the mkdir and touch commands.
 */
import type { CommandArgument, OnCommand } from "../../command";
import { Command } from "../../command";
import { Directory } from "../../../filesystem/directory";
import { File } from "../../../filesystem/file";

import { log, LogLevel } from "../../utils/log";
import { Filesystem } from "../../../filesystem/filesystem";

export const mkdirCommand = new Command({
    name: "mkdir",
    description: "Create a directory",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path to the directory to create",
            type: "path",
            defaultValue: "",
            required: true,
        } as CommandArgument<"path">,
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    // onCommand: mkdirAndTouchOnCommandFactory("directory"),
    onCommand: (options): void => {
        options.currentWorkingDirectory.makeDirectory(options.args[0]);
    },
});

export const touchCommand = new Command({
    name: "touch",
    description: "Create a file",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path of the file to create",
            type: "path",
            defaultValue: "",
            required: true,
        } as CommandArgument<"path">,
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    // onCommand: mkdirAndTouchOnCommandFactory("file"),
    onCommand: (options): void => {
        const { args, currentWorkingDirectory } = options;

        const pathParts = Filesystem.getPathParts(args[0]);
        const parentDirectoryParts = pathParts.slice(0, -1);
        const fileName = pathParts[pathParts.length - 1];

        currentWorkingDirectory.makeFile(parentDirectoryParts, new File({ name: fileName, content: "" }));
    },
});

export const catCommand = new Command({
    name: "cat",
    description: "Print the contents of a file",

    // The arguments for the command
    arguments: [
        {
            name: "path",
            description: "The path of the file to read",
            type: "path",
            defaultValue: "",
            required: true,
        } as CommandArgument<"path">,
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args } = options;

        // Get the file
        const pathParts = Filesystem.getPathParts(args[0]);
        const fileName = pathParts[pathParts.length - 1];

        const file = options.currentWorkingDirectory.getFile(args[0]);

        if (!file) {
            log(`File "${fileName}" not found`, LogLevel.Error);
            return;
        }

        log(file.content, LogLevel.Log);
    },
});
