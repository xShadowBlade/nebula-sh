/**
 * @file Declares the directory class.
 */

/**
 * The possible contents of a directory.
 */
export type DirectoryContent = Directory | File;

/**
 * Represents a directory.
 */
export class Directory {
    /**
     * The directory's name.
     * @example "folder"
     */
    public name: string;

    /**
     * The directory's contents
     */
    public contents: DirectoryContent[] = [];

    /**
     * Constructs a new directory.
     * @param name - The directory's name.
     */
    public constructor(name: string) {
        this.name = name;
    }
}
