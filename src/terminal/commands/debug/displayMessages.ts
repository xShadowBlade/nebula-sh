/**
 * @file Declares the displayMessages command.
 */
import { Command } from "../../command";
import { log } from "../../utils/log";

export const displayMessagesCommand = new Command({
    name: "displaymessages",
    description: "Display stored messages",

    // The arguments for the command
    arguments: [],

    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { consoleHost } = options;

        consoleHost.storedLogs.forEach((message) => {
            if (message.optionalParams) {
                log(message.message, message.level, ...message.optionalParams);
            } else {
                log(message.message, message.level);
            }
        });
    },
});
