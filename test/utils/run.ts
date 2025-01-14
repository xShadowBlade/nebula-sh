/**
 * @file Utils for running commands
 */
import { defaultComputer } from "nebula-sh";
import type { Computer, ConsoleHost } from "nebula-sh";

/**
 * The options for {@link runCommand}.
 */
interface RunCommandOptions {
    /**
     * Whether to reset the computer instance after running the commands.
     * Note: if this is set to `true`, the computer instance will be reset after running the commands. Therefore, the computer instance will be in the same state as it was before running the commands and the factory defaults will be returned.
     * @default false
     */
    resetComputer?: boolean;
}

/**
 * The default run command options.
 */
const defaultRunCommandOptions: RunCommandOptions = {
    resetComputer: false,
};

/**
 * Run a series of commands.
 * Note: normally, the computer instance is *not reset* after running the commands. To reset the computer instance, set `resetComputer` to `true` in the {@link RunCommandOptions}.
 * @param commands - The commands to run.
 * @param options - The options for this function. See {@link RunCommandOptions}.
 * @param runCommandOptions - The options for {@link ConsoleHost.runCommand}.
 * @returns The computer.
 * @example
 * it("should run a command", async () => {
 *     const commandsToRun = ["mdkir test", "cd test", "pwd"];
 *     await runCommand(commandsToRun).then((computer) => {
 *         expect(computer.consoleHost.currentWorkingDirectory.path).toBe("/test");
 *     });
 * });
 */
export async function runCommand(
    commands: string[],
    options?: RunCommandOptions,
    runCommandOptions?: Parameters<ConsoleHost["runCommand"]>[1],
): Promise<Computer> {
    // Get the options
    const { resetComputer } = { ...defaultRunCommandOptions, ...options };

    // For each command, run it
    for (const command of commands) {
        await defaultComputer.consoleHost.runCommand(command, runCommandOptions);
    }

    // Reset the computer if needed
    if (resetComputer) {
        defaultComputer.reset();
    }

    // Return the computer
    return defaultComputer;
}
