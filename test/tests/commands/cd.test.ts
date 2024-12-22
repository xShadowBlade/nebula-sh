/**
 * @file Test for cd command
 */
import { describe, it } from "mocha";
import { assert } from "chai";

import { runCommand } from "../../utils/run";

describe("cd command", () => {
    it("should change directory", async () => {
        const commandsToRun = ["mkdir test", "cd test"];
        await runCommand(commandsToRun).then((computer) => {
            assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, "/test");
        });
    });
});
