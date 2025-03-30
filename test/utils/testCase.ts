/**
 * @file Declares the test case utility functions.
 */
import { describe, it, beforeEach } from "mocha";
import { runCommand } from "./run";

/**
 * A test case for a command.
 */
export interface BaseCommandTestCase {
    /**
     * The name/description of the test case.
     * @example "should print the current working directory"
     */
    description: string;

    /**
     * The commands to run.
     * @example ["pwd"]
     */
    commands: string[];

    /**
     * The expected output of the command.
     * @example "The current time is: 12:00:00"
     */
    // expectedMessage: string;

    /**
     * The expected error message or `true` if an error is expected.
     * @example "Directory 'folderthatdoesnotexist' not found"
     */
    // expectedError?: string | boolean;
}

/**
 * A test suite for a command.
 * @template TTestCase - The type of the test cases. Must extend `BaseCommandTestCase`.
 */
export interface CommandTestSuite<TTestCase extends BaseCommandTestCase> {
    /**
     * The name of the command. Used as an argument for `describe`.
     * @example "ls"
     */
    name: string;

    /**
     * A list of test cases for the command.
     */
    testCases: TTestCase[];

    /**
     * Whether to reset the computer before each test case.
     * @default true
     */
    resetComputerBeforeEach?: boolean;

    /**
     * The function to run for each test case.
     * @param testCase - The test case to run.
     */
    runTestCase: (testCase: TTestCase) => void | Promise<void>;
}

/**
 * Creates a test suite for a command.
 * @param suite - The test suite.
 */
export function createTestSuite<TTestCase extends BaseCommandTestCase>(suite: CommandTestSuite<TTestCase>): void {
    // Describe the test suite with the name of the command
    describe(suite.name, () => {
        // Reset the computer before each test if not specified
        beforeEach(() => {
            if (suite.resetComputerBeforeEach ?? true) {
                runCommand([], { resetComputer: true });
            }
        });

        // For each test case, run the test case
        suite.testCases.forEach((testCase) => {
            it(testCase.description, async () => {
                await suite.runTestCase(testCase);
            });
        });
    });
}
