/**
 * @file Declares the xterm addon.
 */
import type { Terminal, IDisposable, ITerminalAddon } from "@xterm/xterm";

import type { Computer } from "../computer/computer";
import { defaultComputer } from "../computer/computer";

// Example
// class DataLoggerAddon {
//     private _disposables: IDisposable[] = [];

//     activate(terminal: Terminal): void {
//         this._disposables.push(terminal.onData((d) => console.log(d)));
//     }

//     dispose(): void {
//         this._disposables.forEach((d) => d.dispose());
//         this._disposables.length = 0;
//     }
// }

/**
 * The xterm addon.
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
            // Write the data to the terminal.
            terminal.write(data);

            // If the data is a newline character, handle the command.
            if (data === "\r") {
                // Handle the command.
                addon.computer.consoleHost.runCommand(addon.currentLine);

                // debug
                console.log(addon.currentLine);

                // Clear the current line.
                addon.currentLine = "";

                // Display the prompt.
                addon.displayPrompt(terminal);

                return;
            }

            // Add the data to the current line (if it's not a newline character).
            addon.currentLine += data;
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
        // this.disposables.push(terminal.onData((d) => console.log(d)));

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
     */
    public displayPrompt(terminal: Terminal): void {
        const prompt = this.computer.consoleHost.getPrompt();

        terminal.write(prompt);
    }
}
