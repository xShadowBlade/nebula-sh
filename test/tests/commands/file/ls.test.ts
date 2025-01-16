/**
 * @file Test for ls command
 */
import { LogLevel } from "nebula-sh";
import { describe, it, beforeEach } from "mocha";
import { assert } from "chai";

import { runCommand } from "../../../utils/run";
import { expectMessage, expectMultipleMessages, expectNoMessages } from "../../../utils/messages";
import type { BaseCommandTestCase } from "../../../utils/testCase";
import { createTestSuite } from "../../../utils/testCase";

/**
 * A test case for the ls command.
 */
interface LsCommandTestCase extends BaseCommandTestCase {
    /**
     * The expected output of the command.
     * @example [""]
     */
    expectedMessage: string[];
}

/**
 * Test cases for the ls command.
 */
const testCases: LsCommandTestCase[] = [
    {
        description: "should display nothing in an empty directory",
        commands: ["ls"],
        expectedMessage: [],
    },
    {
        description: "should list files in a directory",
        commands: ["mkdir test", "ls"],
        expectedMessage: ["test"],
    },
    {
        description: "should list files in a directory with multiple files",
        commands: ["mkdir test", "mkdir test2", "ls"],
        expectedMessage: ["test", "test2"],
    },
    {
        description: "should only list files in the current directory if -r is not specified",
        commands: ["mkdir test", "touch test/file.txt", "ls"],
        expectedMessage: ["test"],
    },
    {
        description: "should recursively list files in a directory if -r is specified",
        commands: ["mkdir test", "touch test/file.txt", "ls -r"],
        expectedMessage: ["test", "  └─ file.txt"],
    },
    {
        description: "should recursively list if an alias for -r is specified",
        commands: ["mkdir test", "touch test/file.txt", "ls --recursive"],
        expectedMessage: ["test", "  └─ file.txt"],
    },
    {
        description: "should recursively list complex directory structure",
        commands: ["mkdir test", "touch test/file.txt", "mkdir test/folder", "touch test/folder/file2.txt", "ls -r"],
        expectedMessage: ["test", "  └─ file.txt", "  └─ folder", "    └─ file2.txt"],
    },
];

createTestSuite<LsCommandTestCase>({
    name: "ls",
    testCases,
    runTestCase: async (testCase) => {
        const { commands, expectedMessage } = testCase;

        // Run the commands
        await runCommand(commands);

        // Expect the message
        if (expectedMessage.length === 0) {
            assert.isTrue(expectNoMessages());
            return;
        }

        const messagesToExpect = expectedMessage.map((message) => ({ level: LogLevel.Log, message }));

        assert.isTrue(expectMultipleMessages(messagesToExpect));
    },
});
