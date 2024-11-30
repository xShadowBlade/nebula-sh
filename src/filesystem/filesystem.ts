/**
 * @file Declares the filesystem class.
 */
import { Directory } from "./directory";
import type { File } from "./file";
import { log, LogLevel } from "../terminal/utils/log";

/**
 * Manages the filesystem.
 */
export class Filesystem {
    /**
     * The root directory.
     */
    public root = new Directory({ name: "", isRoot: true });

    /**
     * Separates a path into parts.
     * @param path - The path to separate.
     * @returns The path parts.
     * @example getPathParts("/folder/file.txt") // ["/", "folder", "file.txt"]
     * @example getPathParts("folder/file.txt") // [".", "folder", "file.txt"]
     * @example getPathParts("../folder/file.txt") // [".", ".", "folder", "file.txt"]
     * @example getPathParts("../../folder/file.txt") // [".", ".", ".", "folder", "file.txt"]
     */
    public static getPathParts(path: string): [start: "." | "/", ...parts: string[]] {
        // Split the path into parts
        const parts = path.split("/").filter((part) => part !== "");

        // If the path is empty, return "."
        if (parts.length === 1 && (parts[0] === "." || parts[0] === "/")) {
            return parts as ["." | "/"];
        }

        // If the path is absolute, add a leading slash
        if (path.startsWith("/")) {
            parts.unshift("/");
        } else {
            // If the path is relative, add a leading dot
            parts.unshift(".");
        }

        // Parse ".." and "."
        // if (parts.length === 1) return parts as ["." | "/"];

        // If the first ".." is found, make it ".", "."
        if (parts[1] === "..") {
            parts.splice(1, 1, ".");
        }

        // For each part, check if it is ".." or "."
        for (let i = 2; i < parts.length; i++) {
            // If the part is "..", make it "."
            if (parts[i] === "..") {
                parts[i] = ".";
            } else if (parts[i] === ".") {
                // If the part is ".", remove it
                parts.splice(i, 1);
                i--;
            }
        }

        return parts as ["." | "/", ...string[]];
    }

    /**
     * Adds a file.
     * @param pathOrParts - The file path (not including the file name).
     * @param fileToAdd - The file to add.
     * @param currentWorkingDirectory - The current working directory.
     * @example
     * addFile("/folder", new File({ name: "file.txt", content: "Hello, world" })) // Adds a file named "file.txt" to the "folder" directory
     */
    // TODO: Move this to the directory class
    public makeFile(pathOrParts: string | string[], fileToAdd: File, currentWorkingDirectory: Directory = this.root): void {
        // Get the parent directory
        const parentDirectory = currentWorkingDirectory.getDirectory(pathOrParts);

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(`Directory "${pathOrParts}" not found`, LogLevel.Error);
            return;
        }

        // Add the new file to the parent directory
        parentDirectory.addContent(fileToAdd);
    }

    /**
     * Gets a directory by path.
     * @deprecated Use {@link getDirectory} in {@link Filesystem.root} instead.
     * @param pathOrParts - The path or path parts.
     * @returns The directory, if found.
     */
    // TODO: Move this to the directory class
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
     * @param pathOrParts - The directory path or path parts.
     * @param currentWorkingDirectory - The current working directory.
     * @example
     * makeDirectory("/folder") // Creates a directory named "folder" in the root directory
     * makeDirectory("/folder/subfolder") // Creates a directory named "subfolder" in the "folder" directory (note: "folder" must already exist)
     */
    // TODO: Move this to the directory class
    public makeDirectory(pathOrParts: string | string[], currentWorkingDirectory: Directory = this.root): void {
        // Split the path into parts
        const parts = typeof pathOrParts === "string" ? Filesystem.getPathParts(pathOrParts) : pathOrParts;

        // Get the parent directory
        const parentDirectory = currentWorkingDirectory.getDirectory(parts.slice(0, -1));

        // debug: log parent directory and parts
        // log("makeDirectory:", LogLevel.Debug, {
        //     parentDirectory,
        //     parts,
        // });

        // If the parent directory is not found, log an error
        if (!parentDirectory) {
            log(`Directory "${parts.slice(0, -1).join("/")}" not found`, LogLevel.Error);
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
}
