/**
 * @file Declares the error utility functions.
 */
import { defaultComputer, LogLevel } from "nebula-sh";
import type { StoredLog } from "nebula-sh";

/**
 * Checks if the last message is a specific level and message.
 * @param level - The level to check.
 * @param message - The message to check.
 * @returns `true` if the last log is of the level and message, otherwise the stored log.
 */
export function expectMessage(level: LogLevel, message?: string | boolean): true | StoredLog {
    const lastLog = defaultComputer.consoleHost.storedLogs[defaultComputer.consoleHost.storedLogs.length - 1];

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
