/**
 * @file Test for mkdir command
 */
import { LogLevel } from "nebula-sh";
import { assert } from "chai";

import { runCommand } from "../../../utils/run";
import { expectMessage } from "../../../utils/messages";
import type { BaseCommandTestCase } from "../../../utils/testCase";
import { createTestSuite } from "../../../utils/testCase";

/**
 * A test case for the mkdir command.
 */
interface MkdirCommandTestCase extends BaseCommandTestCase {
    /**
     * A list of the expected directories.
     * @example ["/test"] // The directory "test" should be created
     * @example ["/test", "/test2"] // The directories "test" and "test2" should be created
     * @example ["/test/subfolder"] // The directory "subfolder" should be created in the directory "test"
     */
    expectedDirectories: string[];

    /**
     * The expected error message or `true` if an error is expected.
     * @example "Directory 'folderthatdoesnotexist' not found"
     */
    expectedError?: string | boolean;
}

/**
 * Test cases for the mkdir command.
 */
const testCases: MkdirCommandTestCase[] = [
    {
        description: "should create a directory",
        commands: ["mkdir test"],
        expectedDirectories: ["/test"],
    },
    {
        description: "should create multiple directories",
        commands: ["mkdir test", "mkdir test2"],
        expectedDirectories: ["/test", "/test2"],
    },
    // TODO: Fix this
    // {
    //     description: "should create a directory with a space in the name",
    //     commands: [`mkdir "test folder"`],
    //     expectedDirectories: ["/test folder"],
    // },
    {
        description: "should not create a directory if it already exists",
        commands: ["mkdir test", "mkdir test"],
        expectedDirectories: ["/test"],
        expectedError: true,
    },
    {
        description: "should create subdirectories",
        commands: ["mkdir test", "mkdir test/subfolder"],
        expectedDirectories: ["/test", "/test/subfolder"],
    },
    {
        description: "should not create a subdirectory if the parent directory does not exist",
        commands: ["mkdir test/subfolder"],
        expectedDirectories: [],
        expectedError: true,
    },
    {
        description: "should not create a directory if the parent directory is a file",
        commands: ["mkdir test", "touch test/file", "mkdir test/file/subfolder"],
        expectedDirectories: ["/test"],
        expectedError: true,
    },
    {
        description: "should create a directory with a relative path",
        commands: ["mkdir test", "cd test", "mkdir subfolder"],
        expectedDirectories: ["/test", "/test/subfolder"],
    },
    {
        description: "should not create a directory if a file with the same name exists",
        commands: ["touch test", "mkdir test"],
        expectedDirectories: [],
        expectedError: true,
    },
];

createTestSuite<MkdirCommandTestCase>({
    name: "mkdir",
    testCases,
    runTestCase: async (testCase) => {
        const { commands, expectedDirectories, expectedError } = testCase;

        // Run the commands
        const computer = await runCommand(commands);

        // Check if an error is expected
        if (testCase.expectedError) {
            assert.isTrue(expectMessage(LogLevel.Error, expectedError));
        }

        // Check for the created directories
        for (const directory of expectedDirectories) {
            // assert.isTrue(logs.some((log) => log.message === `Created directory '${directory}'`));
            assert.isDefined(computer.filesystem.root.getDirectory(directory));
        }
    },
});
