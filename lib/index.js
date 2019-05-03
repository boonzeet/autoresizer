// ./lib/index.js
const nodeWatch = require('node-watch');
const Jimp = require('jimp');

const DEFAULT_EXTENSION = "_x";
const DEFAULT_SCALEFACTOR = 2.0;
const DEFAULT_INTERPOLATION = "nearest";

const INTERPOLATIONS = {
    "nearest": Jimp.RESIZE_NEAREST_NEIGHBOR,
    "bilinear": Jimp.RESIZE_BILINEAR,
    "bicubic": Jimp.RESIZE_BICUBIC,
    "hermite": Jimp.RESIZE_HERMITE,
    "bezier": Jimp.RESIZE_BEZIER
}

var watch = function (path, args) {
    var extension = DEFAULT_EXTENSION;
    var scaleFactor = DEFAULT_SCALEFACTOR;
    var interpolation = DEFAULT_INTERPOLATION;

    if (typeof path === "undefined" || path === null) {
        console.error("\u001b[31mNo filepath specified\u001b[0m");
        process.exitCode = 1;
        return;
    }

    // Read and parse the arguments
    if (Array.isArray(args) && args.length > 0) {
        // save extension
        if (!!args[0]) { 
            extension = args[0];
        }
        // scale factor
        if (args.length >= 1 && !!args[1]) {
            let s = parseFloat(args[1]);
            if (!Number.isNaN(s)) {
                scaleFactor = s;
            }
        }
        //interpolation method
        if (args.length >= 2 && !!args[2] && INTERPOLATIONS.hasOwnProperty(args[2])) {
            interpolation = args[2];
        }
    }

    console.log(process.cwd());
    console.log(`\u001b[32mWatching for image file changes in ${path}\u001b[0m. Files will be saved with \u001b[33m'${extension}'\u001b[0m suffix.`);
    if (scaleFactor !== DEFAULT_SCALEFACTOR || interpolation !== DEFAULT_INTERPOLATION) {
        console.log(`Custom scale factor: \u001b[36m${scaleFactor}\u001b[0m, \u001b[36m${interpolation}\u001b[0m interpolation.`);
    }

    nodeWatch(path, {
        recursive: true, filter: filename => {
            return filename.indexOf(".png") === filename.length - 4 && filename.indexOf(`${extension}.png`) === -1;
        }
    }, function (evt, name) {
        if (evt === "update") {
            console.log('%s changed', name);
            Jimp.read(name)
                .then(image => {
                    image.scale(scaleFactor, INTERPOLATIONS[interpolation]);
                    let match = /.+?(?=\.png)/.exec(name)[0];
                    if (match.length) {
                        let newName = `${match}${extension}.png`
                        console.log(`\u001b[32mSaving file to: ${newName}\u001b[0m`);
                        image.write(newName);
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