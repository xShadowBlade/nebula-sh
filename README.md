![Header](https://raw.githubusercontent.com/xShadowBlade/nebula-sh/main/images/banner.png)


<div align="center">
nebula-sh is a JavaScript library for an easy-to-use terminal emulator with support for [xterm.js](https://xtermjs.org/).

<br>
<!-- <a href="https://github.com/xShadowBlade/nebula-sh/commits/main" alt=""><img src="https://img.shields.io/github/last-commit/xShadowBlade/nebula-sh?label=last%20update&style=for-the-badge"></a>
<a href="https://github.com/xShadowBlade/nebula-sh/commits/main" alt=""><img src="https://img.shields.io/github/commit-activity/w/xShadowBlade/nebula-sh?label=updates&style=for-the-badge"></a> -->
<br>
<img src="https://img.shields.io/github/stars/xShadowBlade/nebula-sh?color=yellow&style=for-the-badge">
<a href="https://github.com/xShadowBlade/nebula-sh/issues" alt=""><img src="https://img.shields.io/github/issues/xShadowBlade/nebula-sh?style=for-the-badge"></a>
<br><img src="https://img.shields.io/github/v/release/xShadowBlade/nebula-sh?color=green&style=for-the-badge">
<br><img src="https://img.shields.io/badge/Discord%3A-%40.xshadowblade-blue?style=social&logo=discord">
</div>

## Features

 - Commands with arguments and flags
 - Built-in commands (see [Commands](#default-commands))
 - Custom commands

## Usage

Try it out in your terminal!

```bash
npx nebula-sh
```

<!-- 
Test commands:
pwd
mkdir test
cd test
touch test.txt
mkdir test2
cd /
ls
ls -r
rm test/test2
ls -r

useradd john
su john
whoami
 -->

![PowerShell Demo](https://raw.githubusercontent.com/xShadowBlade/nebula-sh/main/images/nebula-sh-demo-ps.gif)

Use it as an xterm.js plugin:

```javascript
import "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

import { Terminal } from "@xterm/xterm";
import { NebulaShAddon } from "nebula-sh";

// Create a new terminal
const terminal = new Terminal();

// Load the addon
const addon = new NebulaShAddon();
terminal.loadAddon(addon);

// Attach the terminal to the DOM
terminal.open(document.body);
```

### Custom Commands

```javascript
import { Command, log, defaultComputer } from "nebula-sh";

const myCommand = new Command({
    // The name of the command, used to call it
    name: "my-command",

    // A description of the command, shown in the help text
    description: "A custom command",

    // The arguments the command takes
    arguments: [
        {
            // The name and description of the argument, shown in the help text
            name: "name",
            description: "The name of the user",
            // The type of the argument, used for validation
            type: "string",
            // Whether the argument is required
            required: true
        }
    ],

    // The flags the command takes
    flags: [
        {
            // The name of the flag and any aliases
            name: ["greet", "g"],
            description: "Whether to greet the user",
            // The type of the flag, used for validation
            type: "boolean",
            // The default value of the flag
            default: true
        }
    ],

    // The function to run when the command is called
    onCommand: (options) => {
        // Get the arguments and flags
        const { args, flags } = options;

        const name = args[0];
        const greet = flags.greet;

        // Log the output
        log(greet ? `Hello, ${name}!` : name);
    }
});

// Register the command
defaultComputer.commandDriver.addCommand(myCommand);
```

You can now use the command in the terminal:

```bash
nebula-sh root:/$ my-command John
Hello, John!
nebula-sh root:/$ my-command John --greet
Hello, John!
nebula-sh root:/$ my-command John -g
Hello, John!
nebula-sh root:/$ my-command John --greet:false
John
nebula-sh root:/$ my-command John --greet=false
John
```


## Installation

> [!NOTE]
> The npm package is not available yet.

```bash
npm install nebula-sh
```

### Building from source

```bash
npm install
npm run build
npm run build:types
```

## Default Commands

- `ls`
- `mkdir`
- `touch`
- `cd`
- `pwd`
- `whoami`
- `useradd`
- `listusers`
- `su`
- `history`
- `clear`
- `exit`
- `rm`
- `help`

For more information on the commands, run `help` in the terminal.
