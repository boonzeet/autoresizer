# rmxp16to32

A simple Node command-line tool to watch a folder and its subfolders for PNG file changes and create a 2x resolution version. 

![Normal resoution](http://github.com/boonzeet/rmxp16to32/example/example.png) ![After process](http://github.com/rmxp16to32/example/example_x.png)

## Why is this useful?

RPG Maker XP is restricted to 32x32 tilesets, which for many games are too large. Using this tool, it is easy to work with 16x16 tilesets and automatically create import versions for use within RPG Maker XP.

## How to use

Simply install the tool with npm ([details on how to install node and npm](https://blog.teamtreehouse.com/install-node-js-npm-windows)):
```
npm install rmxp16to32@latest -g
```

Alternatively, you can download the source code directly from here and install from where you downloaded:
```
npm install C:\[Path you saved file to]\rmxp16to32 -g
```

The tool can then be used from the command line by navigating into the directory you would like to watch, and running the command `rmxp16to32`:
```
C:\Game Art> rmxp16to32
```
This will start the watcher on this folder and all folders within it. Files will be saved to the same folder as the origin folder. The program can be quit by closing the command window or using Ctrl+C.

The default extension appended to files is `_x`, but you can customise it like so:
```
rmxp16to32 @2x
```

This will now save files as `example@2x.png`.

## Advanced features

You may customise the scale factor to any decimal amount, and the interpolation method used to scale up (or down) the images.

Supported interpolation arguments: nearest, bilinear, bicubic, hermite, bezier

Examples:
```
rmxp16to32 @3x 3.0 bicubic
rmxp16to32 _halfsize 0.5 bilinear
etc.
```

The first will create files with the extension @3x, scaled to 3 times their size using a smoother bicubic function.
The second will create files with the extension _halfsize, scaled to half their size using a smoother bilinear function.