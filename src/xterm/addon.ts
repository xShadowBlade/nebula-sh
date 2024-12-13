/**
 * @file Declares the xterm addon.
 */
import type { Terminal, IDisposable } from "@xterm/xterm";

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
export class NebulaShAddon {
    /**
     * A function that generates event listeners for the terminal.
     * @param terminal - The terminal.
     * @returns An array of disposables.
     */
    private static generateEventListeners = (terminal: Terminal): IDisposable[] => [
        terminal.onData((data) => {
            defaultComputer.consoleHost.runCommand(data, undefined, false);
        }),
    ];

    /**
     * An array of disposables.
     * A disposable is an object with a `dispose()` method that can be used to free resources.
     */
    private disposables: IDisposable[] = [];

    /**
     * Activates the addon.
     * @param terminal - The terminal.
     */
    public activate(terminal: Terminal): void {
        // this.disposables.push(terminal.onData((d) => console.log(d)));

        // Add the event listeners.
        this.disposables.push(...NebulaShAddon.generateEventListeners(terminal));
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
}
