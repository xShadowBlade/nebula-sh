/**
 * @file Declares the xterm addon.
 */
import type { Terminal, IDisposable, ITerminalAddon } from "@xterm/xterm";

import type { Computer } from "../computer/computer";

// TODO: Add commands to change themes / stuff specific to the terminal (ex. disable cursor blink)
import { defaultComputer } from "../computer/computer";

import { modifyLogXterm } from "../terminal/utils/log";

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
     * A function that generates event listeners for the terminal.
     * @param terminal - The terminal.
     * @param addon - The addon.
     * @returns An array of disposables.
     */
    private static generateEventListeners = (terminal: Terminal, addon: NebulaShAddon): IDisposable[] => [
        // When the terminal receives data, handle it.
        terminal.onData((data) => {
            // console.log(data.charCodeAt(0));

            // If the data is a backspace character, remove the last character from the current line.
            if (data === "\x7f") {
                // If the current line is empty, return (prevents user from deleting the prompt).
                if (addon.currentLine === "") {
                    return;
                }

                // Remove the last character from the current line.
                addon.currentLine = addon.currentLine.slice(0, -1);
                terminal.write("\b \b");
                return;
            }

            // If the data is an up arrow or down arrow, navigate the history.
            if (data === "\x1b[A" || data === "\x1b[B") {
                // If the history is empty, return.
                if (addon.computer.consoleHost.history.length === 0) {
                    return;
                }

                const oldHistoryPosition = addon.historyPosition;

                // Check if data is an up or down arrow and move the history position accordingly.
                if (data === "\x1b[A") {
                    // Up arrow
                    addon.historyPosition++;
                } else if (data === "\x1b[B") {
                    // Down arrow
                    addon.historyPosition--;
                }

                // Clamp the history position to the bounds of the history array.
                addon.historyPosition = Math.max(
                    0,
                    Math.min(addon.historyPosition, addon.computer.consoleHost.history.length),
                );

                // If the history position did not change, return.
                if (addon.historyPosition == oldHistoryPosition) {
                    return;
                }

                // Get the command from the history.
                const command =
                    addon.historyPosition === 0
                        ? ""
                        : addon.computer.consoleHost.history[
                              addon.computer.consoleHost.history.length - addon.historyPosition
                          ];

                // Clear the current line and write the command.
                terminal.write("\r\x1b[K" + addon.computer.consoleHost.getPrompt() + command);

                // Set the current line to the command.
                addon.currentLine = command;

                return;
            }

            // If the data is a left or right arrow, move the cursor but stop it from moving past the prompt (left) or the end of the line (right).

            /**
             * The length of the prompt.
             */
            const promptLength = addon.computer.consoleHost.getRawPrompt().length;

            if (data === "\x1b[C") {
                // Check if the cursor is at the end of the line by adding the prompt length to the current line length.
                if (terminal.buffer.active.cursorX >= promptLength + addon.currentLine.length) {
                    return;
                }

                terminal.write(data);
                return;
            }

            if (data === "\x1b[D") {
                // Check if the cursor is at the start of the line.
                if (terminal.buffer.active.cursorX <= promptLength) {
                    return;
                }

                terminal.write(data);
                return;
            }

            // TODO: Add support for ctrl+backspace, ctrl+left, ctrl+right, etc.

            // Write the data to the terminal.
            terminal.write(data);

            // If the data is a newline character, handle the command.
            if (data === "\r") {
                // Move the cursor to the next line.
                terminal.write("\n");

                // Handle the command.
                addon.computer.consoleHost.runCommand(addon.currentLine);

                // Clear the current line.
                addon.currentLine = "";

                // Display the prompt.
                addon.displayPrompt(terminal);

                // Reset the history position.
                addon.historyPosition = 0;

                return;
            }

            // If the data is a control character, ignore it.
            if (data.charCodeAt(0) < 32) {
                return;
            }

            // Add the data to the current line (if it's not a newline character).
            addon.currentLine += data;
        }),
        // terminal.onCursorMove((row, col) => {
        //     console.log("Cursor move", row, col);
        // }),
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
