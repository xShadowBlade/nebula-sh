/**
 * @file Test for cd command
 */
import { LogLevel } from "nebula-sh";
import { assert } from "chai";

import { runCommand } from "../../../utils/run";
import { expectMessage } from "../../../utils/messages";
import type { BaseCommandTestCase } from "../../../utils/testCase";
import { createTestSuite } from "../../../utils/testCase";

/**
 * A test case for the cd command.
 */
interface CdCommandTestCase extends BaseCommandTestCase {
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

createTestSuite<CdCommandTestCase>({
    name: "cd",
    testCases,
    runTestCase: async (testCase) => {
        const { commands, expectedPath, expectedError } = testCase;

        // Run the commands
        const computer = await runCommand(commands);

        // Check if the current working directory is the expected path
        assert.strictEqual(computer.consoleHost.currentWorkingDirectory.path, expectedPath);

        // Check if an error is expected
        if (testCase.expectedError) {
            assert.isTrue(expectMessage(LogLevel.Error, expectedError));
        }
    },
});
