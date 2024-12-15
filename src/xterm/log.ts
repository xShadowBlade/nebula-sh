/**
 * @file Modifies the log utility for the xterm addon.
 */
import type { Terminal } from "@xterm/xterm";
import { LogLevel, log } from "../terminal/utils/log";

/**
 * Modifies the log utility.
 * @param terminal - The terminal.
 */
// export function modifyLog(terminal: Terminal): void {
//     const originalLog = log;

//     log = function log(message: unknown, level: LogLevel = LogLevel.Log, ...optionalParams: unknown[]): void {
//         const stringMessage = originalLog(message, level, ...optionalParams);

//         // Write the message to the terminal
//         terminal.write(stringMessage.join(" "));
//     };
// }
