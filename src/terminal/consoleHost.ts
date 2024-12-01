/**
 * @file Declares the console host.
 */
import type { CommandDriver } from "./commands/commandDriver";
import type { Computer } from "../computer/computer";
// import { log, LogLevel } from "./utils/log";
// import { Command } from "./commands/commands";
import type { Directory } from "../filesystem/directory";
import { Privileges } from "../computer/privileges";
import { ConsoleColors, log, LogLevel } from "./utils/log";
import { User } from "../computer/user";

/**
 * The console host options.
 */
export interface ConsoleHostOptions {
    computer: Computer;
    commandDriver: CommandDriver;
    users?: User[];
    currentUser?: User;
}

/**
 * The console host.
 */
// TODO: Add users
export class ConsoleHost {
    /**
     * The command driver.
     */
    public commandDriver: CommandDriver;

    /**
     * The computer instance.
     */
    public computer: Computer;

    /**
     * The current working directory.
     */
    public currentWorkingDirectory: Directory;

    /**
     * The current privilege level.
     */
    public currentPrivilege: Privileges = Privileges.User;

    /**
     * A list of users.
     */
    public users: User[];

    /**
     * The current user.
     */
    public currentUser: User;

    /**
     * Constructs a new console host.
     * @param options - The console host options.
     */
    public constructor(options: ConsoleHostOptions) {
        this.computer = options.computer;
        this.commandDriver = options.commandDriver;

        this.users = options.users ?? [];
        this.currentUser = options.currentUser ?? new User({ name: "root", privileges: Privileges.Admin });

        // Set the current working directory to the root
        this.currentWorkingDirectory = this.computer.filesystem.root;
    }

    /**
     * Runs a command.
     * @param command - The command to run.
     * @param options - The command options.
     */
    public runCommand(command: string, options?: Parameters<CommandDriver["runCommandString"]>[2]): void {
        // TODO: Switch to xterm.js
        // log(this.currentWorkingDirectory.path || "/", LogLevel.Shell, command);
        console.log(
            `${ConsoleColors.fg.magenta}${ConsoleColors.dim}nebula-sh${ConsoleColors.reset} ` +
                `${ConsoleColors.fg.green}${this.currentUser.name}${ConsoleColors.reset}:` +
                `${ConsoleColors.fg.blue}${this.currentWorkingDirectory.path || "/"}${ConsoleColors.reset}$ ` +
                `${command}`,
        );

        // If the command is empty, return
        if (command === "") return;

        this.commandDriver.runCommandString(command, this, options);
    }
}
