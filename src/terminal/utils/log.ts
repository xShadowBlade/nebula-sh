/**
 * @file Declares the log utility.
 */

/**
 * Possible log levels.
 */
export enum LogLevel {
    /**
     * A debug log.
     * Displayed in green.
     */
    Debug = "DEBUG",

    /**
     * An info log.
     * Displayed in blue.
     */
    Info = "INFO",

    /**
     * A warning log.
     * Displayed in yellow.
     */
    Warn = "WARN",

    /**
     * An error log.
     * Displayed in red.
     */
    Error = "ERROR",

    /**
     * The default log level.
     * Displayed in white (no special color).
     */
    Log = "LOG",
}

/**
 * Logs a message to the console
 * @param message - The message to log
 * @param level - The log level
 * @param optionalParams - The optional parameters to log. (see {@link console.log})
 */
export function log(message: unknown, level: LogLevel = LogLevel.Log, ...optionalParams: unknown[]): void {
    /**
     * The prefix/color for the debug message.
     * See {@link https://stackoverflow.com/a/41407246/4808079} for more colors.
     * @example "[DEBUG] %s"
     */
    // const consoleColor = "\x1b[42m[DEBUG]\x1b[0m " + "\x1b[32m%s\x1b[0m";

    // console.log(consoleColor, message, ...optionalParams);

    switch (level) {
        case LogLevel.Debug:
            console.log("\x1b[42m[DEBUG]\x1b[0m " + "\x1b[32m%s\x1b[0m", message, ...optionalParams);
            break;
        case LogLevel.Info:
            console.log("\x1b[44m[INFO]\x1b[0m " + "\x1b[34m%s\x1b[0m", message, ...optionalParams);
            break;
        case LogLevel.Warn:
            console.warn("\x1b[43m[WARN]\x1b[0m " + "\x1b[33m%s\x1b[0m", message, ...optionalParams);
            break;
        case LogLevel.Error:
            console.error("\x1b[41m[ERROR]\x1b[0m " + "\x1b[31m%s\x1b[0m", message, ...optionalParams);
            break;
        default:
            console.log(message, ...optionalParams);
            break;
    }
}

// Test
// log("Hello, world!", LogLevel.DEBUG);
// log("Hello, world!", LogLevel.INFO);
// log("Hello, world!", LogLevel.WARN);
// log("Hello, world!", LogLevel.ERROR);
// log("Hello, world!");
