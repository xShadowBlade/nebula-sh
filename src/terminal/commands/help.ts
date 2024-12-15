/**
 * @file Declares the help command
 */
import type { CommandArgument, CommandFlag } from "../command";
import { Command } from "../command";
import { log, LogLevel } from "../utils/log";

export const helpCommand = new Command({
    name: "help",
    description: "Show help for a command",

    // The arguments for the command
    arguments: [
        {
            name: "command",
            description: "The command to show help for",
            type: "string",
            defaultValue: "",
            required: false,
        } as CommandArgument<"string">,
    ],

    // The flags for the command
    flags: [
        {
            name: ["all", "A", "a"],
            description: "Show help for all commands",
            type: "boolean",
            defaultValue: false,
            required: false,
        } as CommandFlag<"all", "boolean">,
    ],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, flags, consoleHost } = options;

        // Show help for all commands if the --all flag was provided
        if (flags.all) {
            consoleHost.commandDriver.commands.forEach((command) => {
                log(command.getHelpText() + "\n", LogLevel.Info);
            });

            return;
        }

        // If a command was provided, show help for that command
        if (args[0]) {
            const command = consoleHost.commandDriver.getCommand(args[0]);

            if (command) {
                log(command.getHelpText(), LogLevel.Info);
            } else {
                log(`Command not found: ${args[0]}`, LogLevel.Error);
            }

            return;
        }

        // TODO: Show general help
        log("nebula-sh is a terminal emulator. Type 'help -a' to see a list of commands.", LogLevel.Info);
    },
});
