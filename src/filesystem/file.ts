/**
 * @file Declares the file class.
 */

/**
 * Represents the parts of a file.
 */
export interface FileParts {
    /**
     * The file's name.
     * @example "file"
     */
    name: string;

    /**
     * The file's extension.
     * @example "txt"
     */
    extension: string;
}

/**
 * Represents a file.
 */
export class File {
    // TODO: Add localStorage support

    /**
     * The file's name.
     * @example "file.txt"
     */
    public name: string;

    /**
     * The file's content.
     */
    public content: string;

    /**
     * @returns The file's size.
     */
    public get size(): number {
        return this.content.length;
    }

    /**
     * Gets the file's parts. See {@link FileParts}.
     * @returns The file's parts.
     */
    public getParts(): FileParts {
        const parts = this.name.split(".");
        return {
            name: parts[0],
            extension: parts[1]
        };
    }

    /**
     * Constructs a new file.
     * @param name - The file's name.
     * @param content - The file's content.
     */
    public constructor(name: string, content: string) {
        this.name = name;
        this.content = content;
    }
}

// Test
const file = new File("file.txt", "Hello, world!");
