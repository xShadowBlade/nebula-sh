/**
 * @file Declares the computer class
 */
import { Command } from "../terminal/commands/commands";
import { CommandDriver } from "../terminal/commands/commandDriver";
import { Filesystem } from "../filesystem/filesystem";
import { File } from "../filesystem/file";

import { log, LogLevel } from "../terminal/utils/log";

import type { CommandFlag } from "../terminal/commands/commands";
import { Privileges } from "./privileges";

/**
 * The computer class.
 */
export class Computer {
    /**
     * The command driver.
     * See {@link CommandDriver}
     */
    public commandDriver = new CommandDriver(this);

    /**
     * The filesystem.
     * See {@link Filesystem}
     */
    public filesystem = new Filesystem();
}

// TODO: Move these tests to an actual test file
// Filesystem test
const computer = new Computer();

// log("path parts:", LogLevel.Info, Filesystem.getPathParts("/folder/file.txt"));
// [
//     "file.txt",
//     "/folder/file.txt",
//     "folder/file.txt",
//     "../folder/file.txt",
//     "../../folder/file.txt",
//     "/",
// ].forEach((path) => {
//     log(`path parts of "${path}":`, LogLevel.Info, Filesystem.getPathParts(path));
// });

computer.filesystem.makeDirectory("/folder");
computer.filesystem.makeFile("/folder", new File({ name: "file.txt", content: "Hello, world!" }));
computer.filesystem.makeDirectory("/folder/subfolder");

// log("fs contents:", LogLevel.Info, computer.filesystem.root.contents);
// log("get directory:", LogLevel.Info, computer.filesystem.getDirectory("/folder"));

// Command test
const lsCommand = new Command({
    name: "ls",
    description: "List directory contents",
    flags: [
        {
            names: ["all", "a"],
            description: "List all entries including those starting with a dot",
            defaultValue: false,
        } as CommandFlag<"all", boolean>,
        {
            names: ["recursive", "recurse", "r"],
            description: "List subdirectories recursively",
            defaultValue: false,
        } as CommandFlag<"recursive", boolean>,
    ] satisfies CommandFlag[],

    onCommand: (options): void => {
        const { args, flags, currentWorkingDirectory } = options;
        // log("args:", LogLevel.Info, args);
        // log("flags:", LogLevel.Info, flags);

        // Get the directory
        const directory = args[0] ? currentWorkingDirectory.getDirectory(args[0]) : currentWorkingDirectory;

        // If the directory is not found, log an error
        if (!directory) {
            log(`Directory "${args[0]}" not found`, LogLevel.Error);
            return;
        }

        // Log the directory contents
        directory.contents.forEach((content) => {
            log(content.name, LogLevel.Log);
        });

        // TODO: Implement flags
    },
});
computer.commandDriver.addCommand(lsCommand);

computer.commandDriver.runCommandString("ls", { currentWorkingDirectory: computer.filesystem.getDirectory("/folder") });

// Privilege test
const adminOnlyCommand = new Command({
    name: "admin",
    description: "Admin-only command",
    flags: [] as CommandFlag[],

    onCommand: (options): void => {
        log("Admin command run", LogLevel.Log);
    },
    privilege: Privileges.Admin,
});
computer.commandDriver.addCommand(adminOnlyCommand);

// Attempt to run the admin command as a user
computer.commandDriver.runCommandString("admin", { privilege: Privileges.User });
