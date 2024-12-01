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
import { cdCommand, pwdCommand } from "../terminal/commands/dir/cd";
import { helpCommand } from "../terminal/commands/help";
import { listUsersCommand, whoamiCommand } from "../terminal/commands/user/whoami";
import { userAddCommand } from "../terminal/commands/user/useradd";
import { suCommand } from "../terminal/commands/user/su";

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
    public consoleHost = new ConsoleHost({
        computer: this,
        commandDriver: this.commandDriver,
    });
}

// TODO: Move these tests to an actual test file
// Filesystem test
const computer = new Computer();

// Add the built-in commands
[
    lsCommand,
    mkdirCommand,
    touchCommand,
    cdCommand,
    pwdCommand,
    whoamiCommand,
    userAddCommand,
    listUsersCommand,
    suCommand,
    helpCommand,
].forEach((command) => {
    computer.commandDriver.addCommand(command);
});

// [
//     "file.txt",
//     "/folder/file.txt",
//     "folder/file.txt",
//     "./folder/file.txt",
//     "../folder/file.txt",
//     "../../folder/file.txt",
//     "/",
//     ".",
// ].forEach((path) => {
//     log(`path parts of "${path}":`, LogLevel.Info, Filesystem.getPathParts(path));
// });

// Run some commands
// computer.consoleHost.runCommand("help -a");
[
    "whoami",
    "useradd test",
    "listusers",
    "su test",
    "mkdir folder",
    // "touch /folder/file.txt",
    // "mkdir /folder/subfolder",
    // "touch /folder/subfolder/file2.txt",
    "cd ./folder",
    "pwd",
    "touch file.txt",
    "mkdir subfolder",
    "cd ./subfolder",
    "pwd",
    "touch file2.txt",
    "cd ../..",
    "pwd",

    "ls -r",
    "cd /folder",
    "ls -r",
].forEach((command) => {
    computer.consoleHost.runCommand(command);
});

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
