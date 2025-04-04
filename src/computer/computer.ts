/**
 * @file Declares the computer class
 */
import { CommandDriver } from "../terminal/commandDriver";
import { Filesystem } from "../filesystem/filesystem";
import { ConsoleHost } from "../terminal/consoleHost";

import { lsCommand } from "../terminal/commands/file/ls";
import { mkdirCommand, touchCommand } from "../terminal/commands/file/makeDirectoryContent";
import { cdCommand, pwdCommand } from "../terminal/commands/file/cd";
import { helpCommand } from "../terminal/commands/help";
import { listUsersCommand, whoamiCommand } from "../terminal/commands/user/whoami";
import { userAddCommand } from "../terminal/commands/user/useradd";
import { suCommand } from "../terminal/commands/user/su";
import { clearCommand, historyCommand } from "../terminal/commands/history";
import { exitCommand } from "../terminal/commands/exit";
import { rmCommand } from "../terminal/commands/file/rm";
import { displayMessagesCommand } from "../terminal/commands/debug/displayMessages";

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

    /**
     * Resets the computer by resetting the filesystem and console host.
     * See {@link Filesystem.reset} and {@link ConsoleHost.reset}.
     */
    public reset(): void {
        this.filesystem.reset();
        this.consoleHost.reset();
    }
}

/**
 * The default computer with the built-in commands.
 */
const defaultComputer = new Computer();

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
    historyCommand,
    clearCommand,
    exitCommand,
    rmCommand,
    helpCommand,
    displayMessagesCommand,
].forEach((command) => {
    defaultComputer.commandDriver.addCommand(command);
});

// Export after adding the built-in commands
export { defaultComputer };
