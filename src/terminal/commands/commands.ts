/**
 * @file Handles the commands for the terminal.
 */
import type { ConsoleHost } from "../consoleHost";
import { Privileges } from "../../computer/privileges";
import type { Directory } from "../../filesystem/directory";

/**
 * The possible flag types.
 */
export type FlagTypes = boolean | string | number;

export type FlagTypeString = "boolean" | "string" | "number";

// eslint-disable-next-line prettier/prettier
export type StringToFlagType<T extends FlagTypeString> = 
    T extends "boolean" ? boolean :
    T extends "string" ? string :
    T extends "number" ? number :
    undefined;

/**
 * The command flag initializer.
 * @example
 * const helpFlag: CommandFlag<"help", boolean> = {
 *     names: ["help", "h", "?"], // "help" is the primary name, "h" is the 1st alias, and "?" is the 2nd alias
 *     description: "Display the help message", // The flag description
 *     defaultValue: false, // The flag default value. Also determines the flag type.
 * };
 */
export interface CommandFlag<
    TPrimaryFlagName extends string = string,
    TFlagTypeString extends FlagTypeString = FlagTypeString,
> {
    /**
     * Any names aliases for the flag, as a string array.
     * - The first index is the primary name.
     * - The rest are aliases.
     * Note: If there are multiple flags, the last flag takes precedence.
     * Ex: ls --my-flag=1 --my-flag=2 // my-flag will be 2
     * @example ["help", "h", "?"] // "help" is the primary name, "h" is the 1st alias, and "?" is the 2nd alias
     */
    name: TPrimaryFlagName | [TPrimaryFlagName, ...string[]];

    /**
     * The flag description.
     * @example "Display the help message"
     */
    description: string;

    /**
     * The flag type.
     * @default "string"
     * @example "boolean" // boolean
     * @example "string" // string
     * @example "number" // number
     */
    type: TFlagTypeString;

    /**
     * The flag default value.
     * @default undefined
     * @example false // boolean
     * @example "default" // string
     * @example 0 // number
     */
    defaultValue?: StringToFlagType<TFlagTypeString>;
}

/**
 * The command argument initializer.
 * @example
 * const directoryArgument: CommandArgument<string> = {
 *     names: ["directory"],
 *     description: "The directory to list",
 *     defaultValue: "",
 *     required: false,
 * };
 */
export interface CommandArgument<TFlagTypeString extends FlagTypeString = FlagTypeString>
    extends CommandFlag<string, TFlagTypeString> {
    /**
     * If the argument is required.
     * @default true
     */
    required: boolean;
}

/**
 * Gets the flag keys from an array of command flags.
 * @example
 * type MyFlags = [
 *    CommandFlag<"help", boolean>,
 *    CommandFlag<"version", string>,
 * ];
 * type MyFlagKeys = GetFlagKeys<MyFlags>; // { help: boolean, version: string }
 */
export type GetFlagRecord<TFlags extends CommandFlag[]> = ObjectFromEntries<{
    // Convert the flag to a tuple of [name, type].
    [K in keyof TFlags]: TFlags[K] extends CommandFlag<infer TPrimaryFlagName, infer TFlagType>
        ? [TPrimaryFlagName, TFlagType]
        : never;
}>;

/**
 * Object from entries.
 * @example
 * type Test = ObjectFromEntries<[["a", 1], ["b", 2]]>; // { a: 1, b: 2 }
 */
export type ObjectFromEntries<T extends [string, unknown][]> = {
    // Set `K` to each key entry in `T` by iterating over `T[number][0]`, which is a union of all keys in `T`.
    [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]; // Get the value type of the key `K` in `T`.
};

// test
// type MyFlags = [CommandFlag<"help", boolean>, CommandFlag<"version", string>];
// type MyFlagKeys = GetFlagRecord<MyFlags>; // { help: boolean, version: string }

/**
 * Gets the argument array type from an array of command flags.
 * @example
 * type MyArguments = [
 *   CommandFlag<string>,
 *   CommandFlag<number>,
 * ];
 * type MyArgs = GetArgsFromArray<MyArguments>; // [string, number]
 */
export type GetArgsFromArray<T extends CommandArgument[]> = {
    [K in keyof T]: T[K] extends CommandArgument<infer TFlagType> ? TFlagType : never;
};

// test
// type MyArguments = [CommandArgument<string>, CommandArgument<number>];
// type MyArgs = GetArgsFromArray<MyArguments>; // [string, number]

/**
 * The function called when a command is executed
 * @template TArgs - The command arguments.
 * @template TFlags - The command flags.
 * @param options - The command options.
 */
export type OnCommand<
    TArgs extends CommandArgument[] = CommandArgument[],
    TFlags extends CommandFlag[] = CommandFlag[],
> = (options: {
    /**
     * The command arguments.
     * @example ["arg1", "arg2"]
     */
    args: GetArgsFromArray<TArgs>;

    /**
     * The command flags.
     * @example { help: true, version: "1.0.0" }
     */
    flags: GetFlagRecord<TFlags>;

    /**
     * The current directory.
     */
    currentWorkingDirectory: Directory;

    /**
     * The console host
     */
    consoleHost: ConsoleHost;

    /**
     * The privilege level of the user.
     */
    privilege: Privileges;

    // TODO: Add support for async functions
    // TODO: Add support for return values
}) => void;

/**
 * The options for the command constructor.
 * See {@link Command}.
 */
export interface CommandConstructorOptions<TArgs extends CommandArgument[], TFlags extends CommandFlag[]> {
    name: string;
    description: string;

    onCommand: OnCommand<TArgs, TFlags>;
    privilege?: Privileges;

    // Special types for flags and arguments (for type inference)
    flags: TFlags;
    arguments: TArgs;
}

/**
 * A command.
 * @template TArgs - The command arguments. See {@link CommandArgument}.
 * @template TFlags - The command flags. See {@link CommandFlag}.
 */
export class Command<
    TArgs extends CommandArgument[] = CommandArgument[],
    TFlags extends CommandFlag[] = CommandFlag[],
> {
    /**
     * The command name.
     * @example "ls"
     */
    public name: string;

    /**
     * The command description.
     * @example "List directory contents"
     */
    public description: string;

    /**
     * The command arguments.
     */
    public arguments: TArgs;

    /**
     * The command flags.
     */
    public flags: TFlags;

    /**
     * The privileges required to run the command.
     */
    public privilege: Privileges;

    /**
     * The command function.
     * @param args - The command arguments.
     * @param flags - The command flags.
     */
    public onCommand: OnCommand<TArgs, TFlags>;

    /**
     * Constructs a new command.
     * @param options - The command options.
     */
    public constructor(options: CommandConstructorOptions<TArgs, TFlags>) {
        const { name, description, flags, onCommand, privilege } = options;

        this.name = name;
        this.description = description;
        this.onCommand = onCommand;

        this.flags = flags ?? ([] as unknown as TFlags);
        // Note: no destructuring assignment for arguments because it is a reserved word
        this.arguments = options.arguments ?? ([] as unknown as TArgs);

        this.privilege = privilege ?? Privileges.User;
    }

    /**
     * Gets the default flags.
     * @returns The default flags.
     */
    public getDefaultFlags(): GetFlagRecord<TFlags> {
        return Object.fromEntries(
            this.flags.map(({ name: names, defaultValue }) => {
                const primaryName = Array.isArray(names) ? names[0] : names;
                return [primaryName, defaultValue];
            }),
        ) as GetFlagRecord<TFlags>;
    }

    /**
     * Gets the help text for the command.
     * @returns The help text.
     */
    public getHelpText(): string {
        const flagsText = this.flags
            .map(({ name: names, description, defaultValue }) => {
                const primaryName = Array.isArray(names) ? names[0] : names;
                const aliasNames = Array.isArray(names) ? names.slice(1) : [];
                return (
                    `--${primaryName}` +
                    aliasNames.map((aliasName) => `, ${aliasName.length === 1 ? "-" : "--"}${aliasName}`).join("") +
                    (aliasNames.length !== 0 ? " " : "") +
                    `(${typeof defaultValue}) - ${description}`
                );
            })
            .join("\n");

        const argumentsText = this.arguments
            .map(({ name: names, description, defaultValue, required }, index) => {
                const primaryName = Array.isArray(names) ? names[0] : names;
                return `[${index}] ${primaryName} (${typeof defaultValue}) - ${description} ${
                    required ? "(required)" : "(optional)"
                }`;
            })
            .join("\n");

        return (
            `${this.name} - ${this.description}` +
            (flagsText ? `\n\nFlags:\n${flagsText}` : "") +
            (argumentsText ? `\n\nArguments:\n${argumentsText}` : "")
        );
    }
}
