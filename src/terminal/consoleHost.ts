/**
 * @file Declares the console host.
 */
import type { CommandDriver } from "./commandDriver";
import type { Computer } from "../computer/computer";
import type { Directory } from "../filesystem/directory";
import { Privileges } from "../computer/user/privileges";
import { ConsoleColors, log, LogLevel } from "./utils/log";
import { User } from "../computer/user/user";

/**
 * Possible modes for the console host to be in
 */
export enum ConsoleModes {
    /**
     * A standard repl loop.
     * The default mode.
     * @example
     * nebula-sh root:/$ mkdir test
     * nebula-sh root:/$ ls
     * test
     */
    Repl = "repl",

    /**
     * A blank console that can be typed in.
     */
    Editor = "editor",
}

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
 * This represents an instance of a console.
 * There can be multiple ConsoleHosts for a computer.
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
    public currentPrivilege: Privileges;

    /**
     * The history of commands.
     */
    public history: string[] = [];

    /**
     * A list of users.
     */
    public users: User[];

    private _currentUser: User;

    /**
     * @returns The current user.
     */
    public get currentUser(): User {
        return this._currentUser;
    }

    /**
     * Sets the current user.
     */
    public set currentUser(user: User) {
        this._currentUser = user;
        this.currentPrivilege = user.privileges;
    }

    /**
     * A private member for the mode the console instance is in.
     * @default ConsoleModes.Repl
     */
    private _currentMode: ConsoleModes = ConsoleModes.Repl;

    /**
     * @returns The current mode the console instance is in.
     */
    public get currentMode(): ConsoleModes {
        return this._currentMode;
    }

    public set currentMode(mode: ConsoleModes) {
        this._currentMode = mode;

        // Different behavior depending on which mode is being switched to
        switch (mode) {
            case ConsoleModes.Repl:
            default:
                // Re-log the prompt (it was probably cleared)
                // this.logPrompt();
                break;
            case ConsoleModes.Editor:
                // Clear the console
                // TODO: xterm.js support
                console.clear();
        }
    }

    /**
     * Constructs a new console host.
     * @param options - The console host options.
     */
    public constructor(options: ConsoleHostOptions) {
        this.computer = options.computer;
        this.commandDriver = options.commandDriver;

        this._currentUser = options.currentUser ?? new User({ name: "root", privileges: Privileges.Admin });
        this.users = options.users ?? [this.currentUser];
        this.currentPrivilege = this.currentUser.privileges;

        // Set the current working directory to the root
        this.currentWorkingDirectory = this.computer.filesystem.root;
    }

    /**
     * Gets a user by name.
     * @param name - The user's name.
     * @returns The user, if found.
     */
    public getUser(name: string): User | undefined {
        return this.users.find((user) => user.name === name);
    }

    /**
     * Gets the prompt for the console.
     * @returns The prompt.
     * @example "nebula-sh root:/home$ " // also with colors
     */
    public getPrompt(): string {
        return (
            // "nebula-sh "
            `${ConsoleColors.fg.magenta}${ConsoleColors.dim}nebula-sh${ConsoleColors.reset} ` +
            // "${user}:"
            `${ConsoleColors.fg.green}${this.currentUser.name}${ConsoleColors.reset}:` +
            // "${cwd}$ "
            `${ConsoleColors.fg.blue}${this.currentWorkingDirectory.path || "/"}${ConsoleColors.reset}$ `
        );
    }

    /**
     * Logs the prompt to the console (using `console.log`).
     * Use of this is discouraged.
     * @param command - An optional command to add to the end of the prompt
     */
    public logPrompt(command?: string): void {
        console.log(this.getPrompt() + command);
    }

    /**
     * Runs a command.
     * @param command - The command to run.
     * @param options - The command options.
     * @param logPrompt - Whether to log the prompt.
     */
    public runCommand(
        command: string,
        options?: Parameters<CommandDriver["runCommandString"]>[2],
        logPrompt = true,
    ): void {
        // Log the prompt if specified
        if (logPrompt) this.logPrompt();

        // Debug: log command
        // log(command, LogLevel.Debug);

        // If the command is empty, return
        if (command === "") return;

        // Run the command
        this.commandDriver.runCommandString(command, this, options);

        // Add the command to the history
        this.history.push(command);
    }
}
