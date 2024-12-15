/**
 * @file Declares the command driver class.
 */
import { log, LogLevel } from "./utils/log";
import type { Command } from "./command";
import type { CommandFlag, FlagTypes, OnCommand } from "./command";
import type { ConsoleHost } from "./consoleHost";
import { checkPrivilege } from "../computer/user/privileges";

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
     * @example "--flag" // ["flag", undefined]
     * @example "--flag=value" // ["flag", "value"]
     * @example "--flag:value" // ["flag", "value"]
     * @example "-f" // ["f", undefined]
     */
    private static flagRegex = /^--?([a-zA-Z0-9-]+)(?:[=:](.*))?$/;

    /**
     * A regex to match quotes.
     * - Match 1: The quoted string.
     * @example `"quoted string"` // [`"quoted string"`]
     * @example `filler "quoted string" "another quoted string"` // [`"quoted string"`, `"another quoted string"`]
     */
    // TODO: Make quotes actually match (ex. "asd' matches when it shouldn't)
    private static quoteRegex = /("|'[^"]*"|')/g;

    /**
     * A list of temporary characters that are replaced in the command string BEFORE parsing.
     * @example " " -> "\\SPACE"
     */
    private static temporaryCharacterToReplaced = {
        " ": "\\SPACE",
    };

    /**
     * A list of temporary characters that are replaced in the command string AFTER parsing.
     * @example "\\SPACE" -> " "
     */
    private static temporaryReplacedToCharacter = Object.fromEntries(
        Object.entries(CommandDriver.temporaryCharacterToReplaced).map(([key, value]) => [value, key]),
    );

    /**
     * Parses a value
     * @param value - The value to parse. See {@link FlagTypes} (string, number, boolean).
     * @returns The parsed value.
     */
    private static parseValue(value: string): FlagTypes {
        // TODO: Add support for escaping quotes
        if (value.includes(`"`) || value.includes(`'`)) {
            log(`Quotes are not supported in flags: ${value}`, LogLevel.Error);
        }

        if (value === "true") return true;
        if (value === "false") return false;
        if (!isNaN(Number(value))) return Number(value);
        return value;
    }

    /**
     * A list of commands.
     */
    public commands: Command[] = [];

    /**
     * Constructs a new command driver.
     * @param computer - The computer instance.
     * @param consoleHost - The console host.
     */
    // public constructor(computer: Computer, consoleHost: ConsoleHost) {
    //     this.computerReference = computer;
    //     this.consoleHostReference = consoleHost;
    // }

    /**
     * Adds a command.
     * @param command - The command to add.
     */
    public addCommand(command: Command<any>): void {
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
     * Runs a command.
     * @param nameOrCommand - The command name or command.
     * @param consoleHost - The console host. See {@link ConsoleHost}.
     * @param options - The command options. See {@link OnCommand}.
     */
    public runCommand(
        nameOrCommand: string | Command,
        consoleHost: ConsoleHost,
        options: Partial<Omit<Parameters<OnCommand>[0], "consoleHost" | "currentWorkingDirectory">> = {},
    ): void {
        // If the command is a string, get the command by name
        const commandToRun = typeof nameOrCommand === "string" ? this.getCommand(nameOrCommand) : nameOrCommand;

        // If the command is not found, log an error
        if (!commandToRun) {
            log(`Command "${nameOrCommand as string}" not found`, LogLevel.Error);
            return;
        }

        const commandOptions: Parameters<OnCommand>[0] = {
            // Default options
            args: [],
            flags: {},
            consoleHost: consoleHost,
            currentWorkingDirectory: consoleHost.currentWorkingDirectory,
            privilege: consoleHost.currentPrivilege,

            ...options,
        };

        // If the privilege level is not high enough, log an error
        if (commandToRun.privilege && checkPrivilege(commandOptions.privilege, commandToRun.privilege) === false) {
            log(`Insufficient privileges to run command "${commandToRun.name}"`, LogLevel.Error);
            return;
        }

        try {
            commandToRun.onCommand(commandOptions);
        } catch (e) {
            log(e, LogLevel.Error);
        }
    }

    /**
     * Runs a command string.
     * @param commandString - The command string.
     * @param consoleHost - The console host. See {@link ConsoleHost}.
     * @param options - The command options. See {@link OnCommand}.
     */
    public runCommandString(
        commandString: string,
        consoleHost: ConsoleHost,
        options?: Parameters<CommandDriver["runCommand"]>[1],
    ): void {
        // Debug: log the command string
        // log(`Command string: ${commandString}`, LogLevel.Debug);

        // Match quotes
        const originalQuotes = commandString.match(CommandDriver.quoteRegex);

        // For each quote, replace it with a temporary character
        const transformedQuotes = originalQuotes?.map((quote) => {
            // Remove the quotes (1st and last character)
            quote = quote.slice(1, -1);

            // commandString = commandString.replace(quote, CommandDriver.temporaryReplacedCharacters[" "]);

            // Replace temporary characters
            // for (const [original, replacement] of Object.entries(CommandDriver.temporaryReplacedCharacters)) {
            //     commandString = commandString.replaceAll(original, replacement);
            // }

            // Replace temporary characters
            for (const [original, replacement] of Object.entries(CommandDriver.temporaryCharacterToReplaced)) {
                // commandString = commandString.replaceAll(original, replacement);
                quote = quote.replaceAll(original, replacement);
            }

            return quote;
        });

        // Replace the quotes in the original command string
        transformedQuotes?.forEach((quote, index) => {
            commandString = commandString.replace(originalQuotes?.[index] as string, quote);
        });

        // Debug: log the transformed command string
        // log(`Transformed command string: ${commandString}`, LogLevel.Debug);

        const parts = commandString
            // Split the command string into parts
            .split(" ")
            // Filter out empty parts
            .filter((part) => part.length > 0);

        // Replace temporary characters
        parts.forEach((part, index) => {
            // Debug: log the part
            // log(`Part: ${part}`, LogLevel.Log);

            for (const [original, replacement] of Object.entries(CommandDriver.temporaryReplacedToCharacter)) {
                parts[index] = part.replaceAll(original, replacement);
            }
        });

        // Debug: log the parts
        // log(`Parts:`, LogLevel.Debug, parts);

        // The first part is the command name
        const name = parts[0];
        const commandToRun = this.getCommand(name);

        // If the command is not found, log an error
        if (!commandToRun) {
            log(`Command "${name}" not found`, LogLevel.Error);
            return;
        }

        // For each part, check if it is a flag
        const args: FlagTypes[] = [];
        const flagsBeforeProcessed = {} as Record<string, FlagTypes>;

        // For each part, check if it is a flag
        parts.forEach((part, index) => {
            // If `index` is 0, it is the command name (already handled, so skip)
            if (index === 0) return;

            // Check if the part is a flag
            const flagMatch = CommandDriver.flagRegex.exec(part);

            // If it is not a flag, it is an argument
            if (!flagMatch) {
                args.push(CommandDriver.parseValue(part));
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
            const primaryFlagName = typeof flag.name === "string" ? flag.name : flag.name[0];

            // For each flag name, check if it is in the flags object
            Object.entries(flagsBeforeProcessed).forEach(([flagName, flagValue]) => {
                // If the flag name is not in the flag names, skip
                if (!flag.name.includes(flagName)) return;

                // If the flag name is the primary flag name, add it to the flags object
                flagsProcessed[primaryFlagName] = flagValue;
            });
        });

        // Assign default values to flags
        const flagsWithDefaults = Object.assign({}, commandToRun.getDefaultFlags(), flagsProcessed);

        // Process the arguments
        // commandToRun.arguments.forEach((argument, index) => {
        for (let index = 0; index < commandToRun.arguments.length; index++) {
            const argument = commandToRun.arguments[index];

            // If the argument is required and not provided, log an error
            if (argument.required && !args[index]) {
                log(
                    `Argument "${typeof argument.name === "string" ? argument.name : argument.name[0]}" is required`,
                    LogLevel.Error,
                );
                return;
            }

            // If the argument is not provided, assign the default value
            if (!args[index]) {
                // TODO: Fix this
                // @ts-expect-error - Default value can sometimes be undefined
                args[index] = argument.defaultValue;
            }
        }

        // Run the command
        this.runCommand(commandToRun, consoleHost, {
            // @ts-expect-error - Default values are assigned
            args,
            flags: flagsWithDefaults,
            ...options,
        });
    }
}
