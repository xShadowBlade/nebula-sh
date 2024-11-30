/**
 * @file Declares the console host.
 */
import { CommandDriver } from "./commands/commandDriver";
import { Computer } from "../computer/computer";
import { log, LogLevel } from "./utils/log";
import { Command } from "./commands/commands";
import { Directory } from "../filesystem/directory";
import { Privileges } from "../computer/privileges";

/**
 * The console host.
 */
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
        this.commandDriver.runCommandString(command, this, options);
    }
}