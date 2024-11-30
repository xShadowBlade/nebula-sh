/**
 * @file Declares the directory class.
 */
import { Filesystem } from "./filesystem";
import { File } from "./file";
import { log, LogLevel } from "../terminal/utils/log";

/**
 * The possible contents of a directory.
 */
export type DirectoryContent = Directory | File;

/**
 * The options for the directory constructor.
 */
export interface DirectoryOptions {
    name: string;
    parent?: Directory | null;
    isRoot?: boolean;
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
     * Whether the directory is the root directory.
     */
    public isRoot: boolean;

    /**
     * @returns The directory's path
     */
    public get path(): string {
        // debug
        // log("parent:", LogLevel.Debug, {
        //     parentName: this.parent?.name,
        //     name: this.name,
        // });

        return this.parent ? `${this.parent.path}/${this.name}` : this.name;
    }

    /**
     * Constructs a new directory.
     * @param options - The directory options.
     */
    public constructor(options: DirectoryOptions) {
        const { name, parent, isRoot } = options;

        this.name = name;
        this.parent = parent ?? null;
        this.isRoot = isRoot ?? false;
    }

    /**
     * Adds a file or directory to the directory.
     * @param content - The content to add.
     */
    public addContent(content: DirectoryContent): void {
        this.contents.push(content);
    }

    /**
     * Gets a file (only if it is in the current directory).
     * @param name - The file name.
     * @returns The file, if found.
     * @example directory.getFileInDirectory("file.txt") // File { name: "file.txt", ... }
     */
    public getFileInDirectory(name: string): File | undefined {
        return this.contents.find((content): content is File => content instanceof File && content.name === name);
    }

    /**
     * Gets a directory or file by path.
     * @param pathOrParts - The path or path parts. (e.g. "./folder/file.txt" or [".", "folder", "file.txt"])
     * @returns The directory, if found.
     */
    public getDirectory(pathOrParts: string | string[]): Directory | undefined {
        const pathParts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;

        // If the path is absolute, throw an error
        if (!this.isRoot && pathParts[0] !== ".") {
            throw new Error(`Path "${pathOrParts as string}" must be relative`);
        }

        // If the path is just ".", return the current directory
        if (pathParts.length === 1) return this;

        /**
         * The current directory, used to traverse the path.
         */
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let currentDirectory: Directory | undefined = this;

        for (let i = 1; i < pathParts.length; i++) {
            const part = pathParts[i];

            // If the current directory is undefined, return undefined
            if (!currentDirectory) return undefined;

            // If the part is ".", go to the parent directory
            if (part === ".") {
                currentDirectory = currentDirectory.parent ?? undefined;
                continue;
            }

            // Find the directory in the current directory
            const directory = currentDirectory.contents.find(
                (content): content is Directory => content instanceof Directory && content.name === part,
            );

            if (!directory) return undefined;

            // Update the current directory
            currentDirectory = directory;
        }

        return currentDirectory;
    }
}
