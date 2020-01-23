// ./lib/index.js
const nodeWatch = require('node-watch');
const Jimp = require('jimp');
const parseArgs = require('minimist')

const DEFAULT_MODE = 'add';
const EXTENSION = ".png";
const DEFAULT_SUFFIX = "_x";
const DEFAULT_SCALEFACTOR = 2.0;
const DEFAULT_INTERPOLATION = "nearest";

const INTERPOLATIONS = {
    "nearest": Jimp.RESIZE_NEAREST_NEIGHBOR,
    "bilinear": Jimp.RESIZE_BILINEAR,
    "bicubic": Jimp.RESIZE_BICUBIC,
    "hermite": Jimp.RESIZE_HERMITE,
    "bezier": Jimp.RESIZE_BEZIER
}

function replaceLast(find, replace, string) {
    let lastIndex = string.lastIndexOf(find);

    if (lastIndex === -1) {
        return string;
    }
    return `${string.substring(0, lastIndex)}${replace}${string.substring(lastIndex + find.length)}`
}

var watch = function (path, args) {
    let argv = parseArgs(args, opts = {});
    console.dir(argv);

    let mode = DEFAULT_MODE;
    let suffix = DEFAULT_SUFFIX;
    let scaleFactor = DEFAULT_SCALEFACTOR;
    let interpolation = DEFAULT_INTERPOLATION;


    if (argv.hasOwnProperty('help')) {
        console.log("\u001b[97m===========================================");
        console.log("\u001b[96mHelp for RMXP16to32\u001b[97m");
        console.log("===========================================");
        console.log("\u001b[96m--mode [mode]\u001b[37m : Save mode. Can be 'add' or 'sub', 'add' appends suffix on save, 'sub' watches for files with suffix and removes it. Default 'add'.");
        console.log("\u001b[96m--suffix [suffix]\u001b[37m : Suffix, the string that will either be added or removed on save. Default '_x'.");
        console.log("\u001b[96m--scale [suffix]\u001b[37m : Scale factor to resize the image by. Must be a floating point number. Default '2.0'.");
        console.log(`\u001b[96m--intp [interpolation]\u001b[37m : Interpolation style. Can be either: ${Object.keys(INTERPOLATIONS).join(", ")}. Default 'nearest'.\u001b[0m`);
        process.exitCode = 1;
        return;
    }

    if (typeof path === "undefined" || path === null) {
        console.error("\u001b[31mNo filepath specified\u001b[0m");
        process.exitCode = 1;
        return;
    }

    // If triggered, end the process. This allows all error messages to be shown.
    let failedFlag = false;

    // Append/remove mode process flag
    if (argv.hasOwnProperty('mode')) {
        let tempMode = String(argv.mode).toLowerCase();
        if (tempMode !== 'sub' && tempMode !== 'add') {
            console.error(`\u001b[31mMode supplied: ${argv.mode}. Must be 'sub' or 'add'. Please refer to README for more info.\u001b[0m`);
            failedFlag = true;
        } else {
            mode = tempMode;
        }
    }

    // File name suffix process flag
    if (argv.hasOwnProperty('suffix')) {
        let tempSuffix = String(argv.suffix);
        if (tempSuffix.includes(".")) {
            console.warn(`\u001b[33mThe suffix ${argv.intp} contains a period/full-stop. This may have unintended side effects.\u001b[0m`);
        }
        suffix = tempSuffix;
    }

    // Scale factor process flag
    if (argv.hasOwnProperty('scale')) {
        let tempScale = Number.parseFloat(argv.scale);
        if (Number.isNaN(tempScale) || tempScale <= 0) {
            console.error(`\u001b[31mScale supplied: ${argv.scale}. Must be positive floating-point value. Please refer to README for more info.\u001b[0m`);
            failedFlag = true;
        } else {
            scaleFactor = tempScale;
        }
    }

    // Interpolation style process flag
    if (argv.hasOwnProperty('intp')) {
        if (!INTERPOLATIONS.hasOwnProperty(argv.intp.toLowerCase())) {
            console.error(`\u001b[31mInterpolation supplied: ${argv.intp}. Can be either: ${Object.keys(INTERPOLATIONS).join(", ")}. Please refer to README for more info.\u001b[0m`);
            failedFlag = true;
        } else {
            interpolation = argv.intp.toLowerCase();
        }
    }

    if (failedFlag) {
        process.exitCode = 1;
        return;
    }

    console.log(process.cwd());

    if (mode === 'add') {
        console.log(`\u001b[32mWatching for image file changes in ${path}\u001b[0m. Files will be appended with \u001b[33m'${suffix}'\u001b[0m.`);
    } else {
        console.log(`\u001b[32mWatching for image file changes in ${path}\u001b[0m. Files with the suffix \u001b[33m'${suffix}'\u001b[0m will be saved without it.`);
    }
    if (scaleFactor !== DEFAULT_SCALEFACTOR || interpolation !== DEFAULT_INTERPOLATION) {
        console.log(`Custom scale factor: \u001b[36m${scaleFactor}\u001b[0m, \u001b[36m${interpolation}\u001b[0m interpolation.`);
    }

    nodeWatch(path, {
        recursive: true, filter: filename => {
            if (mode === 'add') {
                return filename.indexOf(EXTENSION) === filename.length - 4 && filename.indexOf(`${suffix}${EXTENSION}`) === -1;
            } else if (mode === 'sub') {
                return filename.indexOf(`${suffix}${EXTENSION}`) === (filename.length - (EXTENSION.length + suffix.length));
            }
        }
    }, function (evt, name) {
        if (evt === "update") {
            console.log('%s changed', name);
            Jimp.read(name)
                .then(image => {
                    image.scale(scaleFactor, INTERPOLATIONS[interpolation]);
                    let pngRegex = new RegExp(`.+?(?=\\${EXTENSION})`);
                    let result = pngRegex.exec(name.toLowerCase());
                    let match = result.length ? result[0] : '';
                    let newName = '';

                    if (match.length) {
                        if (mode === 'add') {
                            newName = `${match}${suffix}${EXTENSION}`
                        } else if (mode === 'sub') {
                            newName = `${replaceLast(suffix, '', match)}${EXTENSION}`;
                        }
                        console.log(`\u001b[32mSaving file to: ${newName}\u001b[0m`);
                        image.write(newName);
                    } else {
                        console.error(`\u001b[31mError in file ${name}: File does not match chosen file type (${EXTENSION})\u001b[0m`);
                    }
                })
                .catch(err => {
                    console.error(`\u001b[31mError in file ${name}: ${err}\u001b[0m`);
                });
        } else if (evt === "remove") {
            console.log('%s has been deleted', name);
        }
    });
}

exports.watch = watch;