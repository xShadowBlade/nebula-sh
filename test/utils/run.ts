/**
 * @file Utils for running commands
 */
import { defaultComputer } from "nebula-sh";
import type { Computer, ConsoleHost } from "nebula-sh";

/**
 * Run a series of commands.
 * @param commands - The commands to run.
 * @param options - The options. See {@link ConsoleHost.runCommand}.
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
    options?: Parameters<ConsoleHost["runCommand"]>[1],
): Promise<Computer> {
    // For each command, run it
    for (const command of commands) {
        await defaultComputer.consoleHost.runCommand(command, options);
    }

    // Return the computer
    return defaultComputer;
}
