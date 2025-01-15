/**
 * @file Declares the test case utility functions.
 */
// import { LogLevel } from "nebula-sh";

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
