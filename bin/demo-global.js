#!/usr/bin/env node
var myLib = require('../lib/index.js');
var args = process.argv.slice(2);
// if custom extension supplied, call function with it
if (args.length > 0 && typeof args[0] === "string") {
    myLib.watch(process.cwd(), args[0])
} else {
    myLib.watch(process.cwd());
}