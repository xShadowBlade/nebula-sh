/**
 * @file Declares the exit command.
 */
import { Command } from "./commands";

export const exitCommand = new Command({
    name: "exit",
    description: "Exits the terminal.",

    // The arguments for the command
    arguments: [],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (): void => {
        // TODO: Implement exit for document
        process.exit(0);
    },
});
