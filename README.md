# rmxp16to32

A simple Node command-line tool to watch a folder for PNG file changes and create a 2x resolution version. 

![Normal resoution](http://boonzeet.github.com/rmxp16to32/example/example.png) ![After process](http://boonzeet.github.com/rmxp16to32/example/example_x.png)

## Why is this useful?

RPG Maker XP is restricted to 32x32 tilesets, which for many games are too large. Using this tool, it is easy to work with 16x16 tilesets and automatically create import versions for use within RPG Maker XP.

## How to use

Simply install the tool with node - currently by cloning the package and using:
```
npm install [Where you saved the file]\rmxp16to32 -g
```

The tool can then be used from the command line by navigating into the directory you would like to watch, and running the tool:
```
rmxp16to32
```

The default extension appended to files is `_x`, but you can customise it like so:
```
rmxp16to32 @2x
```

This will now save files as `example@2x.png`.
