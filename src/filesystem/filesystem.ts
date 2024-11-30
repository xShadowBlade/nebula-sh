/**
 * @file Declares the filesystem class.
 */
import { Directory } from "./directory";
import { File } from "./file";
import { log, LogLevel } from "../terminal/utils/log";

/**
 * Manages the filesystem.
 */
class Filesystem {
    /**
     * The root directory.
     */
    public root = new Directory({ name: "" });

    /**
     * Separates a path into parts.
     * @param path - The path to separate.
     * @returns The path parts.
     * @example getPathParts("/folder/file.txt") // ["/", "folder", "file.txt"]
     * @example getPathParts("folder/file.txt") // ["folder", "file.txt"]
     * @example getPathParts("../folder/file.txt") // [".", ".", "folder", "file.txt"]
     * @example getPathParts("../../folder/file.txt") // [".", ".", ".", "folder", "file.txt"]
     */
    public static getPathParts(path: string): string[] {
        // Split the path into parts
        const parts = path.split("/").filter((part) => part !== "");

        // If the path is absolute, add a leading slash
        if (path.startsWith("/")) {
            parts.unshift("/");
        } else {
            // If the path is relative, add a leading dot
            parts.unshift(".");
        }

        return parts;
    }

    /**
     * Gets a directory by path.
     * @param path - The directory path.
     * @returns The directory, if found.
     */
    public getDirectory(path: string): Directory | undefined {
        // Special case: if the path is "/", return the root directory
        if (path === "/" || path === "") return this.root;

        // Split the path into parts
        const parts = Filesystem.getPathParts(path);

        let currentDirectory = this.root;

        // For each part, find the directory
        for (const part of parts) {
            // Check if the current directory has the part
            const directory = currentDirectory.contents.find(
                (content): content is Directory => content instanceof Directory && content.name === part,
            );

            // If the directory is not found, return undefined
            if (!directory) return undefined;

            // Set the current directory to the found directory
            currentDirectory = directory;
        }

        return currentDirectory;
    }

    /**
     * Creates a directory.
     * @param path - The directory path.
     * @example
     * makeDirectory("/folder") // Creates a directory named "folder" in the root directory
     * makeDirectory("/folder/subfolder") // Creates a directory named "subfolder" in the "folder" directory (note: "folder" must already exist)
     */
    public makeDirectory(path: string): void {
        // Split the path into parts
        const parts = Filesystem.getPathParts(path);

        // Get the parent directory
        const parentDirectory = this.getDirectory(parts.slice(0, -1).join("/"));

        // debug: log parent directory and parts
        // console.log({
        //     parentDirectory,
        //     parts,
        // });
        log("makeDirectory:", LogLevel.Debug, {
            parentDirectory,
            parts,
        });

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

// Test
const filesystem = new Filesystem();

// log("path parts:", LogLevel.Info, Filesystem.getPathParts("/folder/file.txt"));
// [
//     "/folder/file.txt",
//     "folder/file.txt",
//     "../folder/file.txt",
//     "../../folder/file.txt",
//     "/",
// ].forEach((path) => {
//     log(`path parts of "${path}":`, LogLevel.Info, Filesystem.getPathParts(path));
// });

// filesystem.makeDirectory("/folder");
// filesystem.makeDirectory("/folder/subfolder");
// console.log(filesystem.root.contents);
// console.log(filesystem.getDirectory("/folder"));

// log("fs contents:", LogLevel.Info, filesystem.root.contents);
// log("get directory:", LogLevel.Info, filesystem.getDirectory("/folder"));
