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

        // return this.parent ? `${this.parent.path}/${this.name}` : this.name;
        return this.isRoot ? "/" : 
            `${this.parent?.path ?? ""}${this.parent?.isRoot ? "" : "/"}${this.name}`;
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
     * @deprecated
     * @param name - The file name.
     * @returns The file, if found.
     * @example directory.getFileInDirectory("file.txt") // File { name: "file.txt", ... }
     */
    public getFileInDirectory(name: string): File | undefined {
        return this.contents.find((content): content is File => content instanceof File && content.name === name);
    }

    /**
     * Gets a directory (only if it is in the current directory).
     * @deprecated
     * @param name - The directory name.
     * @returns The directory, if found.
     * @example directory.getDirectoryInDirectory("folder") // Directory { name: "folder", ... }
     */
    public getDirectoryInDirectory(name: string): Directory | undefined {
        return this.contents.find((content): content is Directory => content instanceof Directory && content.name === name);
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

    /**
     * Gets the parent directory of a path.
     * @param pathOrParts - The path or path parts.
     * @returns The parent directory, if found.
     */
    public getParentDirectoryOfPath(pathOrParts: string | string[]): Directory | undefined {
        const pathParts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;

        // Get the file's parent directory
        const parentDirectoryPathParts = pathParts.slice(0, -1);
        const parentDirectory = this.getDirectory(parentDirectoryPathParts);

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(`Directory "${Filesystem.partsToPath(parentDirectoryPathParts)}" not found`, LogLevel.Error);
            return;
        }

        return parentDirectory;
    }

    /**
     * Gets a file by path.
     * @param pathOrParts - The file path or path parts.
     * @returns The file, if found.
     */
    public getFile(pathOrParts: string | string[]): File | undefined {
        const pathParts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;
        const fileName = pathParts[pathParts.length - 1];

        // Get the file's parent directory
        const parentDirectory = this.getParentDirectoryOfPath(pathParts);

        // Find the file in the parent directory
        return parentDirectory?.getFileInDirectory(fileName);
    }

    /**
     * Creates a directory.
     * @param pathOrParts - The directory path or path parts.
     * @example
     * makeDirectory("/folder") // Creates a directory named "folder" in the current directory
     * makeDirectory("/folder/subfolder") // Creates a directory named "subfolder" in the "folder" directory (note: "folder" must already exist)
     */
    // TODO: Move this to the directory class
    public makeDirectory(pathOrParts: string | string[]): void {
        // Split the path into parts
        const parts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;

        // Get the parent directory
        const parentDirectory = this.getParentDirectoryOfPath(parts);

        // debug: log parent directory and parts
        // log("makeDirectory:", LogLevel.Debug, {
        //     parentDirectory,
        //     parts,
        // });

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(`Directory "${Filesystem.partsToPath(parts.slice(0, -1))}" not found`, LogLevel.Error);
            return;
        }

        // Create the new directory
        const newDirectory = new Directory({
            // parts[parts.length - 1]
            name: parts[parts.length - 1],
            parent: parentDirectory,
        });

        // Add the new directory to the parent directory
        parentDirectory.contents.push(newDirectory);
    }

    /**
     * Adds a file.
     * @param pathOrParts - The file path (not including the file name).
     * @param fileToAdd - The file to add.
     * @example
     * addFile("/folder", new File({ name: "file.txt", content: "Hello, world" })) // Adds a file named "file.txt" to the "folder" directory
     */
    // TODO: Move this to the directory class
    public makeFile(pathOrParts: string | string[], fileToAdd: File): void {
        // Get the parent directory
        const parentDirectory = this.getDirectory(pathOrParts);

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(
                `Directory "${typeof pathOrParts === "string" ? pathOrParts : Filesystem.partsToPath(pathOrParts)}" not found`,
                LogLevel.Error,
            );
            return;
        }

        // Add the new file to the parent directory
        parentDirectory.addContent(fileToAdd);
    }

    /**
     * Removes a file.
     * @param pathOrParts - The file path.
     * @example
     * removeFile("/folder/file.txt") // Removes the file named "file.txt" from the "folder" directory
     */
    // TODO: garbage collect empty directories
    public removeFile(pathOrParts: string | string[]): void {
        // Get the file
        const file = this.getFile(pathOrParts);

        // If the file is not found, log an error
        if (!file) {
            log(
                `File "${typeof pathOrParts === "string" ? pathOrParts : Filesystem.partsToPath(pathOrParts)}" not found`,
                LogLevel.Error,
            );
            return;
        }

        // Get the file's parent directory
        const parentDirectory = this.getParentDirectoryOfPath(pathOrParts);

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(
                `Directory "${typeof pathOrParts === "string" ? pathOrParts : Filesystem.partsToPath(pathOrParts)}" not found`,
                LogLevel.Error,
            );
            return;
        }

        // Remove the file from the parent directory
        for (let i = 0; i < parentDirectory.contents.length; i++) {
            if (parentDirectory.contents[i] === file) {
                parentDirectory.contents.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Removes this directory.
     */
    public removeThisDirectory(): void {
        // Get the parent directory
        const parentDirectory = this.parent;

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(`Parent directory not found`, LogLevel.Error);
            return;
        }

        // Remove the directory from the parent directory
        for (let i = 0; i < parentDirectory.contents.length; i++) {
            if (parentDirectory.contents[i] === this) {
                parentDirectory.contents.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Removes a directory.
     * @param pathOrParts - The directory path.
     * @example
     * removeDirectory("/folder") // Removes the "folder" directory
     */
    public removeDirectory(pathOrParts: string | string[]): void {
        // Get the directory
        const directory = this.getDirectory(pathOrParts);

        // If the directory is not found, log an error
        if (!directory) {
            log(
                `Directory "${typeof pathOrParts === "string" ? pathOrParts : Filesystem.partsToPath(pathOrParts)}" not found`,
                LogLevel.Error,
            );
            return;
        }

        // Remove the directory
        directory.removeThisDirectory();
    }
}
