/**
 * @file Declares commands specific to the xterm addon.
 */
import { Terminal } from "@xterm/xterm";
import type { CommandArgument, CommandFlag } from "../terminal/command";
import { Command } from "../terminal/command";
import { log, LogLevel } from "../terminal/utils/log";

export const settingsCommand = new Command({
    name: "theme",
    description: "Change the cosmetic settings of the terminal",

    // The arguments for the command
    arguments: [
        {
            name: "setting",
            description: "The setting to change",
            type: "string",
            defaultValue: "",
            required: true,
        } as CommandArgument<"string">,
        {
            name: "value",
            description: "The value to set the setting to",
            type: "string",
            defaultValue: "",
            required: false,
        } as CommandArgument<"string">,
    ],

    // The flags for the command
    flags: [
        {
            name: ["list", "l"],
            description: "List all available settings",
            type: "boolean",
            defaultValue: false,
        } as CommandFlag<"list", "boolean">,
    ],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, consoleHost } = options;

        const setting = args[0];
        const value = args[1];

        // switch (setting) {
        //     case "theme":
        //         if (value === "") {
        //             log("No theme specified", LogLevel.Error);
        //             return;
        //         }

        //         consoleHost.terminal.setOption("theme", value);
        //         break;
        //     default:
        //         log(`Unknown setting "${setting}"`, LogLevel.Error);
        //         break;
        // }
    },
});

export const xtermClearCommandFactory = (terminal: Terminal): Command => {
    return new Command({
        name: "clear",
        description: "Clear the console",

        // The arguments for the command
        arguments: [],

        // The flags for the command
        flags: [],

        // The function to run when the command is called
        onCommand: (): void => {
            terminal.clear();
        },
    });
};
