/**
 * @file Declares the filesystem class.
 */
import { Directory } from "./directory";
import { File } from "./file";

/**
 * Manages the filesystem.
 */
class Filesystem {
    /**
     * The root directory.
     */
    public root = new Directory("root");

    // public constructor() {

    // }

    /**
     * Separates a path into parts.
     * @param path - The path to separate.
     * @returns The path parts.
     * @example
     * getPathParts("/folder/file.txt") // ["folder", "file.txt"]
     */
    public getPathParts(path: string): string[] {
        return path.split("/");
    }
}
