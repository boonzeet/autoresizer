#!/usr/bin/env node
var myLib = require('../lib/index.js');
var args = process.argv.slice(2);
myLib.watch(process.cwd(), args);