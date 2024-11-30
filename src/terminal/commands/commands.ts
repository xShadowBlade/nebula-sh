/**
 * @file Handles the commands for the terminal.
 */
import type { Computer } from "../../computer/computer";
import { Privileges } from "../../computer/privileges";
import type { Directory } from "../../filesystem/directory";

/**
 * The possible flag types.
 */
export type FlagTypes = boolean | string | number;

/**
 * The command flag initializer.
 * @example
 * const helpFlag: CommandFlag<"help", boolean> = {
 *     names: ["help", "h", "?"], // "help" is the primary name, "h" is the 1st alias, and "?" is the 2nd alias
 *     description: "Display the help message", // The flag description
 *     defaultValue: false, // The flag default value. Also determines the flag type.
 * };
 */
export interface CommandFlag<TPrimaryFlagName extends string = string, TFlagType extends FlagTypes = FlagTypes> {
    /**
     * Any names aliases for the flag, as a string array.
     * - The first index is the primary name.
     * - The rest are aliases.
     * Note: If there are multiple flags, the last flag takes precedence.
     * Ex: ls --my-flag=1 --my-flag=2 // my-flag will be 2
     * @example ["help", "h", "?"] // "help" is the primary name, "h" is the 1st alias, and "?" is the 2nd alias
     */
    names: TPrimaryFlagName | [TPrimaryFlagName, ...string[]];

    /**
     * The flag description.
     * @example "Display the help message"
     */
    description: string;

    /**
     * The flag default value.
     * Also determines the flag type.
     * @example false // boolean
     * @example "default" // string
     * @example 0 // number
     */
    defaultValue: TFlagType;
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
 * The function called when a command is executed
 * @param options - The command options.
 */
export type OnCommand<TFlags extends CommandFlag[] = CommandFlag[]> = (options: {
    /**
     * The command arguments.
     * @example ["arg1", "arg2"]
     */
    args: string[];

    /**
     * The command flags.
     * @example { help: true, version: "1.0.0" }
     */
    flags: GetFlagRecord<TFlags>;

    /**
     * The computer instance.
     */
    computer: Computer;

    /**
     * The current directory.
     */
    currentWorkingDirectory: Directory;

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
export interface CommandConstructorOptions<TFlags extends CommandFlag[]> {
    name: string;
    description: string;
    flags: TFlags;
    onCommand: OnCommand<TFlags>;
    privilege?: Privileges;
}

/**
 * A command.
 */
export class Command<TFlags extends CommandFlag[] = CommandFlag[]> {
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
    public arguments: string[] = [];

    /**
     * The command flags.
     */
    public flags: TFlags = [] as unknown as TFlags;

    /**
     * The privileges required to run the command.
     */
    public privilege: Privileges;

    /**
     * The command function.
     * @param args - The command arguments.
     * @param flags - The command flags.
     */
    public onCommand: OnCommand<TFlags>;

    /**
     * Gets the default flags.
     * @returns The default flags.
     */
    public getDefaultFlags(): GetFlagRecord<TFlags> {
        return Object.fromEntries(
            this.flags.map(({ names, defaultValue }) => {
                const primaryName = Array.isArray(names) ? names[0] : names;
                return [primaryName, defaultValue];
            }),
        ) as GetFlagRecord<TFlags>;
    }

    /**
     * Constructs a new command.
     * @param options - The command options.
     */
    public constructor(options: CommandConstructorOptions<TFlags>) {
        const { name, description, flags, onCommand } = options;

        this.name = name;
        this.description = description;
        this.flags = flags;
        this.onCommand = onCommand;

        this.privilege = options.privilege ?? Privileges.User;
    }
}
