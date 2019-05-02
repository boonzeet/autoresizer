// ./lib/index.js

const DEFAULT_EXTENSION = "_x";
const nodeWatch = require('node-watch');
const Jimp = require('jimp');

var watch = function (path, extension) {
    if (typeof path === "undefined" || path === null) {
        console.error("\u001b[31mNo filepath specified\u001b[0m");
        return;
    }
    if (typeof extension === "undefined" || extension === null){
        extension = DEFAULT_EXTENSION;
    }
    console.log(process.cwd());
    console.log(`\u001b[32mWatching for image file changes in ${path}\u001b[0m`);

    nodeWatch(path, { recursive: true, filter: filename => {
        return filename.indexOf(".png") === filename.length - 4 && filename.indexOf(`${extension}.png`) === -1;
     } }, function (evt, name) {
        console.log('%s changed', name);
        Jimp.read(name)
            .then(image => {
                image.scale(2.0, Jimp.RESIZE_NEAREST_NEIGHBOR);
                let match = /.+?(?=\.png)/.exec(name)[0];
                if (match.length) {
                    let newName = `${match}${extension}.png`
                    console.log(`Saving file to: ${newName}`);
                    image.write(newName);
                }
            })
            .catch(err => {
                console.error(`Error in file ${name}: ${err}`);
            });
    });
}

exports.watch = watch;