/**
 * @file Declares the filesystem class.
 */
import { Directory } from "./directory";
import { getPathParts, partsToPath } from "./path/path";
import type { File } from "./file";
import { log, LogLevel } from "../terminal/utils/log";

/**
 * Manages the filesystem.
 */
export class Filesystem {
    /**
     * Separates a path into parts.
     * @deprecated Use {@link getPathParts} instead.
     * @param path - The path to separate.
     * @returns The path parts.
     * @example getPathParts("/folder/file.txt") // ["/", "folder", "file.txt"]
     * @example getPathParts("folder/file.txt") // [".", "folder", "file.txt"]
     * @example getPathParts("../folder/file.txt") // [".", ".", "folder", "file.txt"]
     * @example getPathParts("../../folder/file.txt") // [".", ".", ".", "folder", "file.txt"]
     */
    public static getPathParts(path: string): [start: "." | "/", ...parts: string[]] {
        return getPathParts(path);
    }

    /**
     * Converts path parts to a path.
     * @deprecated Use {@link partsToPath} instead.
     * @param parts - The path parts.
     * @returns The path.
     * @example partsToPath(["/", "folder", "file.txt"]) // "/folder/file.txt"
     */
    public static partsToPath(parts: string[]): string {
        return partsToPath(parts);
    }

    /**
     * The root directory.
     */
    public root = new Directory({ name: "", isRoot: true });

    /**
     * Adds a file.
     * @deprecated Use {@link Directory.makeFile} instead.
     * @param pathOrParts - The file path (not including the file name).
     * @param fileToAdd - The file to add.
     * @param currentWorkingDirectory - The current working directory.
     * @example
     * addFile("/folder", new File({ name: "file.txt", content: "Hello, world" })) // Adds a file named "file.txt" to the "folder" directory
     */
    public makeFile(
        pathOrParts: string | string[],
        fileToAdd: File,
        currentWorkingDirectory: Directory = this.root,
    ): void {
        currentWorkingDirectory.makeFile(pathOrParts, fileToAdd);
    }

    /**
     * Gets a directory by path.
     * @deprecated Use {@link getDirectory} in {@link Filesystem.root} instead.
     * @param pathOrParts - The path or path parts.
     * @returns The directory, if found.
     */
    public getDirectory(pathOrParts: string | string[]): Directory | undefined {
        // Split the path into parts
        const parts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;

        // If the first part is not "/", log an error
        if (parts[0] !== "/") {
            log(`Path "${pathOrParts as string}" must be absolute`, LogLevel.Error);
            return;
        }

        // Change the first part to "." (root)
        parts[0] = ".";

        // Debug: log parts
        // log("getDirectory parts:", LogLevel.Debug, parts);

        // Get the directory
        return this.root.getDirectory(parts);
    }

    /**
     * Creates a directory.
     * @deprecated Use {@link Directory.makeDirectory} instead.
     * @param pathOrParts - The directory path or path parts.
     * @param currentWorkingDirectory - The current working directory.
     * @example
     * makeDirectory("/folder") // Creates a directory named "folder" in the root directory
     * makeDirectory("/folder/subfolder") // Creates a directory named "subfolder" in the "folder" directory (note: "folder" must already exist)
     */
    public makeDirectory(pathOrParts: string | string[], currentWorkingDirectory: Directory = this.root): void {
        currentWorkingDirectory.makeDirectory(pathOrParts);
    }

    /**
     * Resets the filesystem by clearing the root directory.
     */
    public reset(): void {
        // TODO: Optimize garbage collection
        // @ts-expect-error - temporarily allow deleting root
        delete this.root;

        this.root = new Directory({ name: "", isRoot: true });
    }
}
