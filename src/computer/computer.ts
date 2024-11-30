/**
 * @file Declares the computer class
 */
import { Command } from "../terminal/commands/commands";
import { CommandDriver } from "../terminal/commands/commandDriver";
import { Filesystem } from "../filesystem/filesystem";

import { log, LogLevel } from "../terminal/utils/log";

/**
 * The computer class.
 */
class Computer {
    /**
     * The command driver.
     * See {@link CommandDriver}
     */
    public commandDriver = new CommandDriver();

    /**
     * The filesystem.
     * See {@link Filesystem}
     */
    public filesystem = new Filesystem();
}

// Test
const computer = new Computer();

// log("path parts:", LogLevel.Info, Filesystem.getPathParts("/folder/file.txt"));
[
    "file.txt",
    "/folder/file.txt",
    "folder/file.txt",
    "../folder/file.txt",
    "../../folder/file.txt",
    "/",
].forEach((path) => {
    log(`path parts of "${path}":`, LogLevel.Info, Filesystem.getPathParts(path));
});

computer.filesystem.makeDirectory("/folder");
computer.filesystem.makeDirectory("/folder/subfolder");

log("fs contents:", LogLevel.Info, computer.filesystem.root.contents);
log("get directory:", LogLevel.Info, computer.filesystem.getDirectory("/folder"));
