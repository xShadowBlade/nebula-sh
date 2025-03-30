/**
 * @file Declares the xterm addon.
 */
import type { Terminal, IDisposable, ITerminalAddon } from "@xterm/xterm";

import type { Computer } from "../computer/computer";

// TODO: Add commands to change themes / stuff specific to the terminal (ex. disable cursor blink)
import { defaultComputer } from "../computer/computer";

import { modifyLogXterm } from "../terminal/utils/log";

enum ControlCharacters {
    Backspace = "\x7f",
    UpArrow = "\x1b[A",
    DownArrow = "\x1b[B",
    LeftArrow = "\x1b[D",
    RightArrow = "\x1b[C",
    NewLine = "\r",
}

/**
 * The xterm addon for nebula-sh.
 * @example
// Create a new terminal
const terminal = new Terminal()

// Load the addon
const addon = new NebulaShAddon();
terminal.loadAddon(addon);
 */
export class NebulaShAddon implements ITerminalAddon {
    /**
     * Handles the backspace key by removing the last character from the current line.
     * @param terminal - The terminal.
     * @param data - The data received from the terminal. Should be {@link ControlCharacters.Backspace}.
     */
    private handleBackspace(terminal: Terminal, data: string): void {
        // If the current line is empty, return (prevents user from deleting the prompt).
        if (this.currentLine === "") {
            return;
        }

        // Remove the last character from the current line.
        this.currentLine = this.currentLine.slice(0, -1);
        terminal.write("\b \b");
    }

    /**
     * Handles the up and down arrow keys by moving through the command history.
     * @param terminal - The terminal.
     * @param data - The data received from the terminal. Should be {@link ControlCharacters.UpArrow} or {@link ControlCharacters.DownArrow}.
     */
    private handleHistory(terminal: Terminal, data: string): void {
        // If the history is empty, return.
        if (this.computer.consoleHost.history.length === 0) {
            return;
        }

        const oldHistoryPosition = this.historyPosition;

        // Check if data is an up or down arrow and move the history position accordingly.
        if (data === ControlCharacters.UpArrow) {
            // Up arrow
            this.historyPosition++;
        } else if (data === ControlCharacters.DownArrow) {
            // Down arrow
            this.historyPosition--;
        }

        // Clamp the history position to the bounds of the history array.
        this.historyPosition = Math.max(0, Math.min(this.historyPosition, this.computer.consoleHost.history.length));

        // If the history position did not change, return.
        if (this.historyPosition == oldHistoryPosition) {
            return;
        }

        // If the history position changed from 0 to 1, cache the current line.
        if (oldHistoryPosition === 0 && this.historyPosition === 1) {
            this.cachedCurrentLine = this.currentLine;
        }

        // Get the command from the history.
        const command =
            this.historyPosition === 0
                ? this.cachedCurrentLine
                : this.computer.consoleHost.history[this.computer.consoleHost.history.length - this.historyPosition];

        // Clear the current line and write the command.
        terminal.write("\r\x1b[K" + this.computer.consoleHost.getPrompt() + command);

        // Set the current line to the command.
        this.currentLine = command;
        return;
    }

    // If the data is a left or right arrow, move the cursor but stop it from moving past the prompt (left) or the end of the line (right).
    private handleLeftOrRightArrow(terminal: Terminal, data: string): void {
        /**
         * The length of the prompt.
         */
        const promptLength = this.computer.consoleHost.getRawPrompt().length;

        if (data === ControlCharacters.RightArrow) {
            // Check if the cursor is at the end of the line by adding the prompt length to the current line length.
            if (terminal.buffer.active.cursorX >= promptLength + this.currentLine.length) {
                return;
            }

            terminal.write(data);
            return;
        }

        if (data === ControlCharacters.LeftArrow) {
            // Check if the cursor is at the start of the line.
            if (terminal.buffer.active.cursorX <= promptLength) {
                return;
            }

            terminal.write(data);
            return;
        }
    }

    private handleNewline(terminal: Terminal, data: string): void {
        // Move the cursor to the next line.
        terminal.write("\r\n");

        // Handle the command.
        this.computer.consoleHost.runCommand(this.currentLine);

        // Clear the current line.
        this.currentLine = "";

        // Display the prompt.
        this.displayPrompt(terminal);

        // Reset the history position.
        this.historyPosition = 0;

        return;
    }

    /**
     * Adds data to the current line in override mode.
     * @param data - The data to add.
     * @param terminal - The terminal.
     */
    private addDataToCurrentLineOverrideMode(data: string, terminal: Terminal): void {
        /**
         * The cursor position relative to actual current line (excludes prompt).
         */
        const actualCursorPosition =
            terminal.buffer.active.cursorX - this.computer.consoleHost.getRawPrompt().length - 1;

        // Add the data to the current line at the cursor position (override mode).
        this.currentLine =
            // Data before the cursor
            this.currentLine.slice(0, actualCursorPosition) +
            // Data at the cursor
            data +
            // Data after the cursor
            this.currentLine.slice(actualCursorPosition + 1);
    }

    /**
     * A function that generates event listeners for the terminal.
     * @param terminal - The terminal.
     * @param addon - The addon.
     * @returns An array of disposables.
     */
    private static generateEventListeners = (terminal: Terminal, addon: NebulaShAddon): IDisposable[] => [
        // When the terminal receives data, handle it.
        terminal.onData((data) => {
            // console.log(data.charCodeAt(0));

            switch (data) {
                case ControlCharacters.Backspace:
                    addon.handleBackspace(terminal, data);
                    return;
                case ControlCharacters.UpArrow:
                case ControlCharacters.DownArrow:
                    addon.handleHistory(terminal, data);
                    return;
                case ControlCharacters.LeftArrow:
                case ControlCharacters.RightArrow:
                    addon.handleLeftOrRightArrow(terminal, data);
                    return;
                case ControlCharacters.NewLine:
                    addon.handleNewline(terminal, data);
                    return;
            }
            // TODO: Add support for ctrl+backspace, ctrl+left, ctrl+right, etc.

            // Character is generic, write the data to the terminal.
            // TODO: This is override mode, add support for insert mode.
            terminal.write(data);

            // If the data is a control character, don't add it to the current line.
            if (data.charCodeAt(0) < 32) {
                return;
            }

            addon.addDataToCurrentLineOverrideMode(data, terminal);
        }),
    ];

    /**
     * An array of disposables.
     * A disposable is an object with a `dispose()` method that can be used to free resources.
     */
    private disposables: IDisposable[] = [];

    /**
     * The computer.
     */
    public computer: Computer;

    /**
     * The current position in the history.
     * Note: 0 is the current line, 1 is the previous line, 2 is the second previous line, etc.
     */
    private historyPosition = 0;

    /**
     * The current line (not including the prompt).
     * This is used to store the current line of input.
     * When the user presses enter, this line is sent to the computer.
     * @example "ls -a"
     */
    private currentLine = "";

    /**
     * The cached current line to restore when the user presses the down arrow.
     */
    private cachedCurrentLine = "";

    /**
     * Creates a new instance of the addon.
     * @param computer - The computer. See {@link Computer}
     */
    public constructor(computer: Computer = defaultComputer) {
        this.computer = computer;
    }

    /**
     * Activates the addon.
     * @param terminal - The terminal.
     */
    public activate(terminal: Terminal): void {
        // Modify the log utility.
        modifyLogXterm(this.computer.consoleHost, terminal);

        // Add the event listeners.
        this.disposables.push(...NebulaShAddon.generateEventListeners(terminal, this));

        // Display the prompt.
        this.displayPrompt(terminal);
    }

    /**
     * Disposes the addon.
     * This method should be called when the addon is no longer needed to free resources.
     */
    public dispose(): void {
        // For each disposable, call the `dispose()` method and clear the array.
        this.disposables.forEach((d) => d.dispose());
        this.disposables.length = 0;
    }

    /**
     * Displays the prompt in the terminal.
     * @param terminal - The terminal.
     * @param resetLine - Whether to clear the current line. Default is `true`.
     */
    public displayPrompt(terminal: Terminal, resetLine = true): void {
        const prompt = this.computer.consoleHost.getPrompt();

        // If the `resetLine` parameter is `true`, clear the current line.
        if (resetLine) {
            terminal.write("\r");
        }

        terminal.write(prompt);
    }
}
