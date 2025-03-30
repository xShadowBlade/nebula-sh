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

## Usage

Try it out in your terminal!

```bash
npx nebula-sh
```

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
