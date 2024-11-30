/**
 * @file Declares the console host.
 */
import type { CommandDriver } from "./commands/commandDriver";
import type { Computer } from "../computer/computer";
// import { log, LogLevel } from "./utils/log";
// import { Command } from "./commands/commands";
import type { Directory } from "../filesystem/directory";
import { Privileges } from "../computer/privileges";
import { log, LogLevel } from "./utils/log";

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
     * Constructs a new console host.
     * @param computer - The computer instance.
     * @param commandDriver - The command driver.
     */
    public constructor(computer: Computer, commandDriver: CommandDriver) {
        this.computer = computer;
        this.commandDriver = commandDriver;

        // Set the current working directory to the root
        this.currentWorkingDirectory = computer.filesystem.root;
    }

    /**
     * Runs a command.
     * @param command - The command to run.
     * @param options - The command options.
     */
    public runCommand(command: string, options?: Parameters<CommandDriver["runCommandString"]>[2]): void {
        // TODO: Switch to xterm.js
        log(this.currentWorkingDirectory.path || "/", LogLevel.Shell, command);

        // If the command is empty, return
        if (command === "") return;

        this.commandDriver.runCommandString(command, this, options);
    }
}
