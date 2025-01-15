/**
 * @file Declares the log utility.
 */
import type { Terminal } from "@xterm/xterm";
import type { ConsoleHost, StoredLog } from "../consoleHost";

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

    /**
     * A log for the shell.
     * Path is displayed in blue, and the command is displayed in green.
     */
    Shell = "SHELL",
}

/**
 * The console colors.
 * See {@link https://stackoverflow.com/a/41407246/4808079} for more colors.
 */
export const ConsoleColors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m", // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m",
    },
};

/**
 * Logs a message to the console
 * @param message - The message to log. If {@link LogLevel} is {@link LogLevel.Shell}, this should be the path.
 * @param level - The log level
 * @param optionalParams - The optional parameters to log. (see {@link console.log}). If {@link LogLevel} is {@link LogLevel.Shell}, this should be the command.
 * @returns The logged message and optional parameters.
 */
export let log = function log(
    message: unknown,
    level: LogLevel = LogLevel.Log,
    ...optionalParams: unknown[]
): unknown[] {
    /**
     * The prefix/color for the debug message.
     * See {@link https://stackoverflow.com/a/41407246/4808079} for more colors.
     * @example "[DEBUG] %s"
     */
    // const consoleColor = "\x1b[42m[DEBUG]\x1b[0m " + "\x1b[32m%s\x1b[0m";

    // console.log(consoleColor, message, ...optionalParams);

    let formatString = "";

    switch (level) {
        case LogLevel.Debug:
            formatString = `\x1b[42m[DEBUG]${ConsoleColors.reset} ` + `\x1b[32m%s${ConsoleColors.reset}`;
            break;
        case LogLevel.Info:
            formatString = `\x1b[44m[INFO]${ConsoleColors.reset} ` + `\x1b[34m%s${ConsoleColors.reset}`;
            break;
        case LogLevel.Warn:
            formatString = `\x1b[43m[WARN]${ConsoleColors.reset} ` + `\x1b[33m%s${ConsoleColors.reset}`;
            break;
        case LogLevel.Error:
            formatString = `\x1b[41m[ERROR]${ConsoleColors.reset} ` + `\x1b[31m%s${ConsoleColors.reset}`;
            break;
        case LogLevel.Shell:
            formatString =
                `${ConsoleColors.fg.magenta}${ConsoleColors.dim}nebula-sh${ConsoleColors.reset} ${ConsoleColors.fg.blue}%s${ConsoleColors.reset}$ ` +
                `${ConsoleColors.fg.green}%s${ConsoleColors.reset}`;
            break;
        case LogLevel.Log:
        default:
            console.log(message, ...optionalParams);
            // break;
            return [message, ...optionalParams];
    }

    const logParams: unknown[] = [formatString, message, ...optionalParams];

    console.log(...logParams);

    return logParams;
};

/**
 * Modifies the log utility for the console host so it adds the message to an internal list of messages.
 * @param consoleHost - The console host instance. See {@link ConsoleHost}.
 */
export function modifyLogConsoleHost(consoleHost: ConsoleHost) {
    const originalLog = log;

    log = function log(message: unknown, level: LogLevel = LogLevel.Log, ...optionalParams: unknown[]): unknown[] {
        const stringMessage = originalLog(message, level, ...optionalParams) as string[];

        // Add the message to the consoleHost stored logs
        consoleHost.storedLogs.push({
            message,
            level,
            optionalParams,
        });

        return stringMessage;
    };
}

/**
 * Modifies the log utility for xterm.js
 * @param consoleHost - The console host.
 * @param terminal - The terminal.
 */
export function modifyLogXterm(consoleHost: ConsoleHost, terminal: Terminal): void {
    const originalLog = log;

    log = function log(message: unknown, level: LogLevel = LogLevel.Log, ...optionalParams: unknown[]): unknown[] {
        const stringMessage = originalLog(message, level, ...optionalParams) as string[];

        // Add the message to the consoleHost stored logs
        consoleHost.storedLogs.push({
            message: stringMessage[0],
            level,
        });

        // Write the message to the terminal
        terminal.write(
            // Replace %s in stringMessage[0] with stringMessage[1]
            stringMessage[0]
                .replace(/%s/g, stringMessage[1]?.toString())
                // Replace \n with \r\n
                .replace(/\n/g, "\r\n") + "\r\n",
        );

        return stringMessage;
    };
}

// Test
// log("Hello, world!", LogLevel.Debug);
// log("Hello, world!", LogLevel.Info);
// log("Hello, world!", LogLevel.Warn);
// log("Hello, world!", LogLevel.Error);
// log("Hello, world!");

// Shell test
// log("path", LogLevel.Shell, "command");
