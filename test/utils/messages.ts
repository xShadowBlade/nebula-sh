/**
 * @file Declares the error utility functions.
 */
import { defaultComputer, LogLevel } from "nebula-sh";
import type { StoredLog } from "nebula-sh";

export interface ExpectedMessage {
    level: LogLevel;
    message?: string | boolean;
}

/**
 * Checks if the last message is a specific level and message.
 * @param level - The level to check.
 * @param message - The message to check.
 * @param index - The index of the stored log to check. Ex. 0 is the last log, 1 is the second to last log, 2 is the third to last log, etc.
 * @returns `true` if the last log is of the level and message, the stored log if the message is not the same, or `undefined` if there are no logs.
 */
export function expectMessage(level: LogLevel, message?: string | boolean, index = 0): true | StoredLog | undefined {
    // If there are no logs, return undefined
    if (defaultComputer.consoleHost.storedLogs.length === 0) {
        return undefined;
    }

    const lastLog = defaultComputer.consoleHost.storedLogs[defaultComputer.consoleHost.storedLogs.length - 1 - index];

    if (lastLog.level === level) {
        // If the message is a string, check if the last log message is the same
        if (typeof message === "string") {
            if (lastLog.message === message) {
                return true;
            }

            return lastLog;
        }

        // No message provided, return true
        return true;
    }

    // It is not an error, return the stored log
    return lastLog;
}

/**
 * Checks if multiple messages are logged.
 * @param messagesToExpect - The messages to expect. The order of the messages is important.
 * Ex. [{ level: LogLevel.Error, message: "Error message" }, { level: LogLevel.Info, message: "Info message" }]
 * // The info message should be the last message logged, and the error message should be the second to last message logged.
 * @returns `true` if all messages are logged, the stored log if a message is not logged, or `undefined` if there are no logs.
 */
export function expectMultipleMessages(messagesToExpect: ExpectedMessage[]): true | StoredLog | undefined {
    // If there are no logs, return undefined
    if (defaultComputer.consoleHost.storedLogs.length === 0) {
        return undefined;
    }

    // For each message, check if it is logged
    for (let i = 0; i < messagesToExpect.length; i++) {
        const message = messagesToExpect[i];

        // Check if the message is logged
        const result = expectMessage(message.level, message.message, messagesToExpect.length - 1 - i);

        // If the message is not logged, return the stored log
        if (result !== true) {
            return result;
        }
    }

    // All messages are logged, return true
    return true;
}

/**
 * Checks if no messages are logged.
 * @returns `true` if no messages are logged, otherwise the stored logs.
 */
export function expectNoMessages(): boolean | StoredLog[] {
    if (defaultComputer.consoleHost.storedLogs.length === 0) {
        return true;
    }

    return defaultComputer.consoleHost.storedLogs;
}
