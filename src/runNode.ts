#!/usr/bin/env node

/**
 * @file This file imports the node package and runs it
 */
import { run } from "./indexNode";

(async (): Promise<void> => {
    await run();
})();
