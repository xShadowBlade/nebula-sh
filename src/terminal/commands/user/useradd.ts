/**
 * @file Declares a template for a command.
 */
import type { CommandArgument } from ".././commands";
import { Command } from ".././commands";
import { log, LogLevel } from "../../utils/log";
import { checkPrivilege, Privileges } from "../../../computer/privileges";
import { User } from "../../../computer/user";

export const userAddCommand = new Command({
    name: "useradd",
    description: "Add a user to the system",

    // The arguments for the command
    arguments: [
        {
            names: "name",
            description: "The name of the user",
            defaultValue: "root",
            required: true,
        } as CommandArgument<string>,
        {
            names: "privileges",
            description: `The privileges of the user (${Object.keys(Privileges).join(", ")})`,
            defaultValue: "User",
            required: false,
        } as CommandArgument<string>,
    ],

    // The flags for the command
    flags: [],

    // The function to run when the command is called
    onCommand: (options): void => {
        const { args, consoleHost } = options;

        const name = args[0];
        const privileges = args[1];

        // Check if the user already exists
        if (consoleHost.users.find((user) => user.name === name)) {
            log(`User "${name}" already exists`, LogLevel.Error);
            return;
        }

        // If the privileges are invalid, log an error
        if (!Object.keys(Privileges).includes(privileges as keyof Privileges)) {
            log(`Invalid privileges "${privileges}"`, LogLevel.Error);
            log(`Valid privileges are: ${Object.keys(Privileges).join(", ")}`, LogLevel.Error);
            return;
        }

        const privilegeOfNewUser = Privileges[privileges as any] as unknown as Privileges;

        // If the current user's privileges are not high enough, log an error
        if (checkPrivilege(consoleHost.currentPrivilege, privilegeOfNewUser) === false) {
            log(`Insufficient privileges to add user with privileges "${privileges}"`, LogLevel.Error);
            return;
        }

        // Add the user
        consoleHost.users.push(
            new User({
                name,
                privileges: privilegeOfNewUser,
            }),
        );
    },
});
