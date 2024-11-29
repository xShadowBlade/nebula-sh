/**
 * @file Handles the commands for the terminal.
 */

/**
 * The possible flag types.
 */
type FlagTypes = boolean | string | number;

/**
 * The command flag initializer.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CommandFlag<TPrimaryFlagName extends string = any, TFlagType extends FlagTypes = any> {
    /**
     * Any names aliases for the flag, as a string array.
     * - The first index is the primary name.
     * - The rest are aliases, with the 2nd index having the highest priority, etc.
     * @example ["help", "h", "?"] // "help" is the primary name, "h" is the 1st alias, and "?" is the 2nd alias (h has higher priority than ?)
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
type GetFlagRecord<TFlags extends CommandFlag[]> = ObjectFromEntries<{
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
type ObjectFromEntries<T extends [string, unknown][]> = {
    // Set `K` to each key entry in `T` by iterating over `T[number][0]`, which is a union of all keys in `T`.
    [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]; // Get the value type of the key `K` in `T`.
};

// test
// type MyFlags = [CommandFlag<"help", boolean>, CommandFlag<"version", string>];
// type MyFlagKeys = GetFlagRecord<MyFlags>; // { help: boolean, version: string }

/**
 * The options for the command constructor.
 * See {@link Command}.
 */
interface CommandConstructorOptions<TFlags extends CommandFlag[]> {
    name: string;
    description: string;
    flags: TFlags;
    onCommand: (args: string[], flags: GetFlagRecord<TFlags>) => void;
}

/**
 * A command.
 */
class Command<TFlags extends CommandFlag[] = []> {
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
     * The command function.
     * @param args - The command arguments.
     * @param flags - The command flags.
     */
    public onCommand: (args: string[], flags: GetFlagRecord<TFlags>) => void;

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
    }
}

// Test
new Command({
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

        // Intellisense test
        // flags
    },
});
