/**
 * @file Test for pwd command
 */
import { LogLevel } from "nebula-sh";
import { describe, it, beforeEach } from "mocha";
import { assert } from "chai";

import { runCommand } from "../../../utils/run";
import { expectMessage } from "../../../utils/messages";
import { BaseCommandTestCase } from "../../../utils/testCase";

/**
 * A test case for the pwd command.
 */
interface PwdCommandTestCase extends BaseCommandTestCase {
    /**
     * The expected output of the command.
     * @example "/test"
     */
    expectedMessage: string;
}

/**
 * Test cases for the pwd command.
 */
const testCases: PwdCommandTestCase[] = [
    {
        description: "should print working directory",
        commands: ["pwd"],
        expectedMessage: "/",
    },
    {
        description: "should print working directory after changing",
        commands: ["mkdir test", "cd test", "pwd"],
        expectedMessage: "/test",
    },
    {
        description: "should print working directory after changing to root",
        commands: ["mkdir test", "cd test", "cd /", "pwd"],
        expectedMessage: "/",
    },
    {
        description: "should print working directory for a complex path",
        commands: ["mkdir test", "cd test", "mkdir folder", "cd folder", "pwd"],
        expectedMessage: "/test/folder",
    },
];

describe("pwd command", () => {
    // Reset the computer before each test
    beforeEach(() => {
        runCommand([], { resetComputer: true });
    });

    testCases.forEach((testCase) => {
        it(testCase.description, async () => {
            const { commands, expectedMessage } = testCase;

            // Run the commands
            await runCommand(commands);

            // Expect the message
            assert.isTrue(expectMessage(LogLevel.Log, expectedMessage));
        });
    });
});
