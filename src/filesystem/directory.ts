/**
 * @file Declares the directory class.
 */

/**
 * The possible contents of a directory.
 */
export type DirectoryContent = Directory | File;

/**
 * The options for the directory constructor.
 */
interface DirectoryOptions {
    name: string;
    parent?: Directory | null;
}

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
     * The directory's parent.
     */
    public parent: Directory | null;

    /**
     * @returns The directory's path
     */
    public get path(): string {
        return this.parent ? `${this.parent.path}/${this.name}` : this.name;
    }

    /**
     * Constructs a new directory.
     * @param options - The directory options.
     */
    public constructor(options: DirectoryOptions) {
        const { name, parent } = options;

        this.name = name;
        this.parent = parent || null;
    }

    /**
     * Gets a directory or file by path.
     * @param path - The directory path.
     * @returns The directory, if found.
     */
    // public getDirectory(path: string): Directory | undefined {
    //     return this.getDirectoryContent(path, true);
    // }
}
