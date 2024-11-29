/**
 * @file Declares the command driver class.
 */
import { Command } from "./commands";
import type { CommandFlag, FlagTypes } from "./commands";

/**
 * Wraps a set of commands and runs them.
 */
export class CommandDriver {
    /**
     * A regex to match flags.
     * - Match 1: The flag name.
     * - Match 2: The flag value.
     *
     * Supported formats:
     * @example "--flag"
     * @example "--flag=value"
     * @example "--flag:value"
     * @example "-f"
     */
    private static flagRegex = /^--?([a-zA-Z0-9-]+)(?:[=:](.*))?$/;

    /**
     * Parses a value
     * @param value - The value to parse. See {@link FlagTypes} (string, number, boolean).
     * @returns The parsed value.
     */
    private static parseValue(value: string): FlagTypes {
        // TODO: Add support for escaping quotes
        if (value.includes(`"`)) throw new Error(`Invalid value: ${value}`);

        if (value === "true") return true;
        if (value === "false") return false;
        if (!isNaN(Number(value))) return Number(value);
        return value;
    }

    /**
     * A list of commands.
     */
    private commands: Command[] = [];

    /**
     * Constructs a new command driver.
     */
    // public constructor() {
    //     this.commands = [];
    // }

    /**
     * Adds a command.
     * @param command - The command to add.
     */
    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    /**
     * Gets a command by name.
     * @param name - The command name.
     * @returns The command, if found.
     */
    public getCommand(name: string): Command | undefined {
        return this.commands.find((command) => command.name === name);
    }

    /**
     * Runs a command string.
     * @param commandString - The command string.
     */
    public runCommandString(commandString: string): void {
        // First, split the command string into parts
        const parts = commandString.split(" ");

        // The first part is the command name
        const name = parts[0];
        const commandToRun = this.getCommand(name);

        // If the command is not found, log an error
        if (!commandToRun) {
            console.error(`Command "${name}" not found`);
            return;
        }

        // For each part, check if it is a flag
        const args: string[] = [];
        const flagsBeforeProcessed = {} as Record<string, FlagTypes>;

        parts.forEach((part, index) => {
            // If `index` is 0, it is the command name (already handled, so skip)
            if (index === 0) return;

            // Check if the part is a flag
            const flagMatch = CommandDriver.flagRegex.exec(part);

            // If it is not a flag, it is an argument
            if (!flagMatch) {
                args.push(part);
                return;
            }

            // If it is a flag, parse the flag
            const flagName: string = flagMatch[1];
            const flagValue: FlagTypes = flagMatch[2] ? CommandDriver.parseValue(flagMatch[2]) : true;

            // Add the flag to the flags object
            flagsBeforeProcessed[flagName] = flagValue;
        });

        // Process the flags
        const flagsProcessed = {} as Record<string, FlagTypes>;
        (commandToRun.flags as CommandFlag[]).forEach((flag) => {
            // Get the primary flag name
            const primaryFlagName = typeof flag.names === "string" ? flag.names : flag.names[0];

            // For each flag name, check if it is in the flags object
            Object.entries(flagsBeforeProcessed).forEach(([flagName, flagValue]) => {
                // If the flag name is not in the flag names, skip
                if (!flag.names.includes(flagName)) return;

                // If the flag name is the primary flag name, add it to the flags object
                flagsProcessed[primaryFlagName] = flagValue;
            });
        });

        // Assign default values to flags
        const flagsWithDefaults = Object.assign({}, commandToRun.getDefaultFlags(), flagsProcessed);

        // Run the command
        try {
            commandToRun.onCommand(args, flagsWithDefaults);
        } catch (e) {
            console.error(e);
        }
    }
}

// Test
const commandDriver = new CommandDriver();

const lsCommand = new Command({
    name: "ls",
    description: "List directory contents",
    flags: [
        {
            names: ["all", "a"],
            description: "List all entries including those starting with a dot",
            defaultValue: false,
        } as CommandFlag<"all", boolean>,
    ] satisfies CommandFlag[],
    onCommand: (args, flags): void => {
        console.log("args", args);
        console.log("flags", flags);
    },
});
commandDriver.addCommand(lsCommand);

commandDriver.runCommandString("ls arg1 --all");
