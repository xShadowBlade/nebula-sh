/**
 * @file Declares the console host.
 */
import type { CommandDriver } from "./commandDriver";
import type { Computer } from "../computer/computer";
import type { Directory } from "../filesystem/directory";
import { Privileges } from "../computer/user/privileges";
import { ConsoleColors, log, LogLevel, modifyLogConsoleHost } from "./utils/log";
import { User } from "../computer/user/user";

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
 * A stored log message produced by {@link log}.
 */
export interface StoredLog {
    message: unknown;
    level: LogLevel;
    optionalParams?: unknown[];
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
    public currentPrivilege: Privileges;

    /**
     * The history of commands.
     */
    public history: string[] = [];

    /**
     * Stored messages.
     */
    public storedLogs: StoredLog[] = [];

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
     * Gets a user by name.
     * @param name - The user's name.
     * @returns The user, if found.
     */
    public getUser(name: string): User | undefined {
        return this.users.find((user) => user.name === name);
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

        // Modify the log command
        modifyLogConsoleHost(this);
    }

    /**
     * Gets the prompt for the console.
     * @returns The prompt.
     * @example "nebula-sh root:/home$ " // also with colors
     */
    public getPrompt(): string {
        return (
            `${ConsoleColors.fg.magenta}${ConsoleColors.dim}nebula-sh${ConsoleColors.reset} ` +
            `${ConsoleColors.fg.green}${this.currentUser.name}${ConsoleColors.reset}:` +
            `${ConsoleColors.fg.blue}${this.currentWorkingDirectory.path || "/"}${ConsoleColors.reset}$ `
        );
    }

    /**
     * Gets the raw prompt for the console, without ANSI escape codes.
     * @returns The raw prompt.
     * @example "nebula-sh root:/home$ "
     */
    public getRawPrompt(): string {
        // eslint-disable-next-line no-control-regex
        return this.getPrompt().replace(/\u001b\[\d+m/gi, "");
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
        if (logPrompt) console.log(this.getPrompt() + command);

        // If the command is empty, return
        if (command === "") return;

        // Run the command
        this.commandDriver.runCommandString(command, this, options);

        // Add the command to the history
        this.history.push(command);
    }

    /**
     * Clears the command history.
     */
    public clearHistory(): void {
        this.history = [];
    }

    /**
     * Resets the console host by clearing the current working directory and history.
     */
    public reset(): void {
        this.currentWorkingDirectory = this.computer.filesystem.root;
        this.clearHistory();
        this.storedLogs = [];
    }
}
