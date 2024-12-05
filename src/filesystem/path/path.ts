/**
 * @file Declares the path utility functions.
 */

/**
 * Separates a path into parts.
 * @param path - The path to separate.
 * @returns The path parts.
 * @example getPathParts("/folder/file.txt") // ["/", "folder", "file.txt"]
 * @example getPathParts("folder/file.txt") // [".", "folder", "file.txt"]
 * @example getPathParts("../folder/file.txt") // [".", ".", "folder", "file.txt"]
 * @example getPathParts("../../folder/file.txt") // [".", ".", ".", "folder", "file.txt"]
 */
export function getPathParts(path: string): [start: "." | "/", ...parts: string[]] {
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

    // If the first part is "./", remove it
    if (parts[1] === ".") {
        parts.splice(1, 1);
    }

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
 * Converts path parts to a path.
 * @param parts - The path parts.
 * @returns The path.
 * @example partsToPath(["/", "folder", "file.txt"]) // "/folder/file.txt"
 */
export function partsToPath(parts: string[]): string {
    // If there are two "."s in a row, combine them
    for (let i = 1; i < parts.length; i++) {
        if (parts[i] === "." && parts[i - 1] === ".") {
            parts.splice(i - 1, 2, "..");
            i--;
        }
    }

    return parts.join("/");
}

/**
 * Checks if a path is absolute.
 * @param path - The path to check.
 * @returns `true` if the path is absolute, otherwise `false`.
 * @example isAbsolute("/folder/file.txt") // true
 * @example isAbsolute("folder/file.txt") // false
 * @example isAbsolute("../folder/file.txt") // false
 */
export function isAbsolute(path: string): boolean {
    return path.startsWith("/");
}
