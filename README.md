# autoresizer v1.1.1

A simple Node command-line tool to watch a folder and its subfolders for PNG file changes and create a 2x resolution version. 

![Normal resoution](https://raw.githubusercontent.com/boonzeet/autoresizer/master/example/example.png) ![After process](https://raw.githubusercontent.com/boonzeet/autoresizer/master/example/example_x.png)

## Why is this useful?

RPG Maker XP is restricted to 32x32 tilesets, which for many games are too large. Using this tool, it is easy to work with 16x16 tilesets and automatically create import versions for use within RPG Maker XP.

## How to use

Simply install the tool with npm ([details on how to install node and npm](https://blog.teamtreehouse.com/install-node-js-npm-windows)):
```
npm install autoresizer@latest -g
```

Alternatively, you can download the source code directly from here and install from where you downloaded:
```
npm install C:\[Path you saved file to]\autoresizer -g
```

The tool can then be used from the command line by navigating into the directory you would like to watch, and running the command `rmxp16to32`:
```
C:\Game Art> autoresizer
```
This will start the watcher on this folder and all folders within it. Files will be saved to the same folder as the folder of the original file. The program can be quit by closing the command window or using Ctrl+C.

The default: `add` the suffix `_x` on save, at a scale factor of `2.0` with the `nearest` interpolation, but you can customise it like so:

```
autoresizer --suffix @2x
```

This will now save files as `example@2x.png`.

```
autoresizer --mode sub --suffix _wip
```

This will look for files with the extension `_wip` and scale them up, saving them without the extension.

For more help, use:
```
autoresizer --help
```

## Command line flags

AutoResizer now supports command line flags, allowing fully custom settings. These are detailed below:

```
--mode [mode]: Save mode. Can be 'add' or 'sub', 'add' appends suffix on save, 'sub' watches for files with suffix and removes it. Default 'add'.
--suffix [suffix] : Suffix, the string that will either be added or removed on save. Default '_x'.
--scale [suffix] : Scale factor to resize the image by. Must be a floating point number. Default '2.0'.
--intp [interpolation] : Interpolation style. Can be either: 'nearest', 'bilinear', 'bezier', 'bicubic', 'hermite'. Default 'nearest'.
--help : Display this help content in the command line.
```

## Advanced features

You may customise the scale factor to any decimal amount, and the interpolation method used to scale up (or down) the images.

Supported interpolation arguments: nearest, bilinear, bicubic, hermite, bezier

Examples:
```
autoresizer --suffix @3x --scale 3.0 --intp bicubic
autoresizer --mode sub -suffix _og --scale 0.5 --intp bilinear
etc.
```

The first will create files with the extension @3x, scaled to 3 times their size using a smoother bicubic function.
The second will look for files with the extension _og, and scale to half their size using a smoother bilinear function, saving them without the extension.
