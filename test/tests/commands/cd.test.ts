/**
 * @file Test for cd command
 */
import { LogLevel } from "nebula-sh";
import { describe, it, beforeEach } from "mocha";
import { assert } from "chai";

import { runCommand } from "../../utils/run";
import { expectMessage } from "../../utils/messages";

/**
 * A test case for the cd command.
 */
interface CdCommandTestCase {
    /**
     * The name/description of the test case.
     * @example "should change directory"
     */
    description: string;

    /**
     * The commands to run.
     * @example ["mkdir test", "cd test"]
     */
    commands: string[];

    /**
     * The expected path of the current working directory.
     * @example "/test"
     */
    expectedPath: string;

    /**
     * The expected error message or `true` if an error is expected.
     * @example "Directory 'folderthatdoesnotexist' not found"
     */
    expectedError?: string | boolean;
}

/**
 * Test cases for the cd command.
 */
const testCases: CdCommandTestCase[] = [
    {
        description: "should change directory",
        commands: ["mkdir test", "cd test"],
        expectedPath: "/test",
    },
    {
        description: "should not change directory if it does not exist",
        commands: ["cd folderthatdoesnotexist"],
        expectedPath: "/",
        expectedError: true,
    },
    {
        description: "should change directory to the root directory",
        commands: ["mkdir test", "cd test", "cd /"],
        expectedPath: "/",
    },
    {
        description: "should change directory to parent directory",
        commands: ["mkdir test", "cd test", "mkdir subfolder", "cd subfolder", "cd .."],
        expectedPath: "/test",
    },
    {
        description: "should handle complex paths",
        commands: ["mkdir test", "cd test", "mkdir subfolder", "cd subfolder", "cd ../.."],
        expectedPath: "/",
    },
];

// Test the cd command
describe("cd command", () => {
    // Reset the computer before each test
    beforeEach(() => {
        runCommand([], { resetComputer: true });
    });

    testCases.forEach((testCase) => {
        // Run the test case with the given description
        it(testCase.description, async () => {
            // Run the commands
            await runCommand(testCase.commands).then((computer) => {
                // Check if the current working directory is the expected path
                assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, testCase.expectedPath);

                // Check if an error is expected
                if (testCase.expectedError) {
                    assert.isTrue(expectMessage(LogLevel.Error, testCase.expectedError));
                }
            });
        });
    });
});
