/**
 * @file Test for cd command
 */
import { describe, it } from "mocha";
import { assert } from "chai";

import { runCommand } from "../../utils/run";

// Test the cd command
describe("cd command", () => {
    // Reset the computer after each test
    afterEach(() => {
        runCommand([], { resetComputer: true });
    });

    it("should change directory", async () => {
        const commandsToRun = ["mkdir test", "cd test"];

        await runCommand(commandsToRun).then((computer) => {
            // Check if the current working directory is /test
            assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, "/test");
        });
    });

    it("should not change directory if it does not exist", async () => {
        const commandsToRun = ["cd folderthatdoesnotexist"];

        await runCommand(commandsToRun).then((computer) => {
            // Check if the current working directory is still /
            assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, "/");
        });
    });

    it("should change directory to the root directory", async () => {
        const commandsToRun = ["mkdir test", "cd test", "cd /"];

        await runCommand(commandsToRun).then((computer) => {
            // Check if the current working directory is /
            assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, "/");
        });
    });
});
