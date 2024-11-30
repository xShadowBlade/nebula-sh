/**
 * @file Declares the file class.
 */
import { compressToBase64, decompressFromBase64 } from "lz-string";
import type { Directory } from "./directory";

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
 * Represents file options.
 */
interface FileOptions {
    name: string;
    content: string;
    parent?: Directory | null;
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
     * The file's parent directory.
     */
    public parent: Directory | null;

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
     * @returns The file's path.
     */
    public get path(): string {
        return this.parent ? `${this.parent.path}/${this.name}` : this.name;
    }

    /**
     * Constructs a new file.
     * @param options - The file options. See {@link FileOptions}.
     */
    public constructor(options: FileOptions) {
        const { name, content, parent } = options;

        this.name = name;
        this.content = content;
        this.parent = parent || null;
    }

    /**
     * Gets the file's parts. See {@link FileParts}.
     * @returns The file's parts.
     */
    public getParts(): FileParts {
        const parts = this.name.split(".");
        return {
            name: parts[0],
            extension: parts[1],
        };
    }

    /**
     * Compresses the file's content to a base64 string.
     * @returns The compressed content.
     */
    public toString(): string {
        return compressToBase64(JSON.stringify({
            name: this.name,
            content: this.content,
        }));
    }
}

// Test
// const file = new File("file.txt", "Hello, world!");
