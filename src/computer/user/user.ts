/**
 * @file Declares the user class.
 */
// import { Directory } from "../../filesystem/directory";
// import { Filesystem } from "../../filesystem/filesystem";
// import { log, LogLevel } from "../../terminal/utils/log";
import { Privileges } from "./privileges";

/**
 * The options for creating a user.
 */
export interface UserOptions {
    name: string;
    privileges?: Privileges;
}

/**
 * Represents a user.
 */
export class User {
    /**
     * The user's name.
     */
    public name: string;

    /**
     * The user's privileges.
     */
    public privileges: Privileges;

    /**
     * The user's home directory.
     */
    // public homeDirectory: Directory;

    /**
     * Creates a new instance of the User class.
     * @param options - The options for creating the user.
     */
    public constructor(options: UserOptions) {
        const { name, privileges } = options;

        this.name = name;
        this.privileges = privileges ?? Privileges.User;
    }
}
