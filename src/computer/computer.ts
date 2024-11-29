/**
 * @file Declares the computer class
 */
import { Command } from "../terminal/commands/commands";
import { CommandDriver } from "../terminal/commands/commandDriver";

/**
 * The computer class.
 */
class Computer {
    public commandDriver = new CommandDriver();
}
