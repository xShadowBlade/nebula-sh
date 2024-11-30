/**
 * @file Declares the mkdir and touch commands.
 */
import { Command } from "../commands";
import { Directory } from "../../../filesystem/directory";
import { File } from "../../../filesystem/file";

import { log, LogLevel } from "../../utils/log";

export const mkdirCommand = new Command({
    name: "mkdir",
    description: "Create a directory",

    // The arguments for the command
    arguments: [
        {
            names: "path",
            description: "The path to the directory to create",
            defaultValue: "",
            required: true,
        },
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args } = options;

        const path = args[0];

        const directory = new Directory({ name: path, parent: options.currentWorkingDirectory });

        options.currentWorkingDirectory.contents.push(directory);

        log(`Created directory "${path}"`, LogLevel.Log);
    },
});

export const touchCommand = new Command({
    name: "touch",
    description: "Create a file",

    // The arguments for the command
    arguments: [
        {
            names: "name",
            description: "The name of the file to create",
            defaultValue: "",
            required: true,
        },
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args } = options;

        const name = args[0];

        const file = new File({ name: name, content: "" });

        options.currentWorkingDirectory.addContent(file);

        log(`Created file "${name}"`, LogLevel.Log);
    },
});
