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
import { ConsoleHost } from "../terminal/consoleHost";

import { lsCommand } from "../terminal/commands/file/ls";
import { mkdirCommand, touchCommand } from "../terminal/commands/file/makeDirectoryContent";

/**
 * The computer class.
 */
export class Computer {
    /**
     * The command driver.
     * See {@link CommandDriver}
     */
    public commandDriver = new CommandDriver();

    /**
     * The filesystem.
     * See {@link Filesystem}
     */
    public filesystem = new Filesystem();

    /**
     * The console host.
     * See {@link ConsoleHost}
     */
    public consoleHost = new ConsoleHost(this, this.commandDriver);
}

// TODO: Move these tests to an actual test file
// Filesystem test
const computer = new Computer();

// Add the built-in commands
computer.commandDriver.addCommand(lsCommand);
computer.commandDriver.addCommand(mkdirCommand);
computer.commandDriver.addCommand(touchCommand);

// ["file.txt", "/folder/file.txt", "folder/file.txt", "../folder/file.txt", "../../folder/file.txt", "/", "."].forEach(
//     (path) => {
//         log(`path parts of "${path}":`, LogLevel.Info, Filesystem.getPathParts(path));
//     },
// );

computer.consoleHost.runCommand("mkdir /folder");
computer.consoleHost.runCommand("touch /folder/file.txt");
computer.consoleHost.runCommand("mkdir /folder/subfolder");
computer.consoleHost.runCommand("touch /folder/subfolder/file2.txt");

// Test ls
// computer.commandDriver.runCommandString("ls / -r", { currentWorkingDirectory: computer.filesystem.root });
computer.consoleHost.runCommand("ls / -r");

// Privilege test
// const adminOnlyCommand = new Command({
//     name: "admin",
//     description: "Admin-only command",
//     flags: [] as CommandFlag[],

//     onCommand: (options): void => {
//         log("Admin command run with privilege:", LogLevel.Log, options.privilege);
//     },
//     privilege: Privileges.Admin,
// });
// computer.commandDriver.addCommand(adminOnlyCommand);

// Attempt to run the admin command as a user
// computer.commandDriver.runCommandString("admin", { privilege: Privileges.User });
