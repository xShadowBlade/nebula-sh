/**
 * @file Declares the mkdir and touch commands.
 */
import type { CommandArgument, OnCommand } from "../commands";
import { Command } from "../commands";
import { Directory } from "../../../filesystem/directory";
import { File } from "../../../filesystem/file";

import { log, LogLevel } from "../../utils/log";
import { Filesystem } from "../../../filesystem/filesystem";

// const mkdirAndTouchOnCommandFactory: (type: "file" | "directory") => OnCommand<[CommandArgument<string>]> = (type) => {
//     return (options): void => {
//         const { args } = options;

//         const path = args[0];

//         // Get the path parts
//         const pathParts = Filesystem.getPathParts(path);
//         const parentPath = pathParts.slice(0, -1);
//         const directoryOrFileName = pathParts[pathParts.length - 1];

//         // Get the parent directory
//         const parent = options.currentWorkingDirectory.getDirectory(pathParts.slice(0, -1));

//         // Debug: log the parent directory
//         log("parent:", LogLevel.Debug, {
//             parent: parent?.name,
//             pathParts,
//             parentPath,
//             // parentPathString: parent?.path,
//         });

//         // If the parent directory is not found, log an error
//         // TODO: make automatic directory creation
//         if (!parent) {
//             log(`Directory "${pathParts.slice(0, -1).join("/")}" not found`, LogLevel.Error);
//             return;
//         }

//         // const newDirectory = new Directory({ name: directoryName, parent: options.currentWorkingDirectory });

//         const newContent =
//             type === "file"
//                 ? new File({ name: directoryOrFileName, content: "" })
//                 : new Directory({ name: directoryOrFileName, parent: options.currentWorkingDirectory });

//         parent.addContent(newContent);

//         log(`Created ${type} "${path}"`, LogLevel.Log);
//     };
// };

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
        } as CommandArgument<string>,
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
            names: "path",
            description: "The path of the file to create",
            defaultValue: "",
            required: true,
        },
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    // onCommand: mkdirAndTouchOnCommandFactory("file"),
    onCommand: (options): void => {
        const pathParts = Filesystem.getPathParts(options.args[0]);
        const parentDirectoryParts = pathParts.slice(0, -1);
        const fileName = pathParts[pathParts.length - 1];

        options.currentWorkingDirectory.makeFile(parentDirectoryParts, new File({ name: fileName, content: "" }));
    },
});

// export const catCommand = new Command({
//     name: "cat",
//     description: "Print the contents of a file",

//     // The arguments for the command
//     arguments: [
//         {
//             names: "path",
//             description: "The path of the file to read",
//             defaultValue: "",
//             required: true,
//         },
//     ],

//     // The flags for the command
//     flags: [],

//     // The function to run when the command is called
//     onCommand: (options): void => {
//         const pathParts = Filesystem.getPathParts(options.args[0]);
//         const fileName = pathParts[pathParts.length - 1];

//         const file = options.currentWorkingDirectory.getFile(fileName);

//         if (!file) {
//             log(`File "${fileName}" not found`, LogLevel.Error);
//             return;
//         }

//         log(file.content, LogLevel.Log);
//     },
// });
