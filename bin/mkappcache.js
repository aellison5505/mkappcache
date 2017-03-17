#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const dir = process.cwd();

//defaults
let config = {
    wk_dir: '.',
    remove: './',
    network: ['*'],
    prepend: '',
    fallbacks: [{
        get: '/',
        fallto: 'index.html'
    }],
    exfile: ['app.appcache','mkappcache-config.js']
}

let fileOut = 'app.appcache';
updateNotifier({pkg, updateCheckInterval: 1000 * 60 * 60}).notify();

//start string
let strFile = [];
strFile.push('CACHE MANIFEST');
//console.log(dir);

//get cli
const cli = meow(`


    Usage
      $ mkappcache [outFile] [options]
          default: outfile=app.appcache, uses CWD fir all actions

    Options
      -c config, --config=./path
            default looks for config in CWD

      -m mkconfig, --mkconfig
            writes a config file to the current working directory
            edit config file to needs

      -h help, --help

    Examples
      $ mkappcache app.appcache -c ./mkappcache-config.js
`, {
    alias: {
        c: 'config',
        m: 'mkconfig',
        h: 'help',
        v: 'version'
    }
});

main = () => {
    //start program
    pharseCli();
    //return;

    let count = 0;
    readfiles(config.wk_dir);
    let timer = setInterval(() => {
        if (count === strFile.length) {
            clearInterval(timer);
            mknetwork(config.network);
            mkfallback(config.fallbacks);
            outFile(strFile);
        } else {
            count = strFile.length;
        }
    }, 500);

}

pharseCli = () => {
    var flags = cli.flags;

    if (flags.mkconfig) {
        mkconfig();
        process.exit(0);
    }

    if (cli.input[0]) {
        fileOut = cli.input[0];
    }
    if (flags.config) {
        try {
            //console.log(flags.config);
            config = require(flags.config);
        } catch (e) {
            console.log(`${e}:
              Exiting program`);
            process.exit(1);
        }
    } else {
        try {
            config = require(`${dir}/mkappcache-config.js`);
        } catch (e) {
            console.log(`Using Default Config
`);
        }
    }

    if (config) {
        if (config.wk_dir) {

        }


    }



}

mkconfig = () => {
    let strConFig = `module.exports = {
    wk_dir : '.',
    remove : './',
    network : ['*'],
    prepend : '',
    fallbacks : [{get:'/',fallto:'index.html'}],
    exfile : ['app.appcache','mkappcache-config.js']
}`;
    fs.writeFileSync('mkappcache-config.js', strConFig);
    console.log(`File Created: mkappcache-config.js
${strConFig}`);

}

mknetwork = (files) => {
    //console.log('NETWORK:')
    strFile.push('NETWORK:');
    files.forEach(file => {
        //console.log(file);
        strFile.push(file);
    });

}

mkfallback = (file) => {
    //console.log('FALLBACK:');
    strFile.push('FALLBACK:');
    file.forEach(key => {
        //console.log(key.file + ' ' + key.fallto);
        strFile.push(key.get + ' ' + key.fallto);
    });
}



readfiles = (folder) => {
    fs.readdir(folder, (err, files) => {
        sortEx(files, (ret) => {
            ret.forEach(file => {
                var fullfile = folder + '/' + file;
                fs.stat(fullfile, (err, stats) => {
                    if (!stats.isDirectory()) {
                        fs.readFile(fullfile, (err, buf) => {
                            var hash = crypto.createHash('md5');
                            hash.update(buf);
                            var strTmp1 = fullfile.replace(config.remove, '');
                            strTmp1 = config.prepend + strTmp1;
                            var strTmp2 = '# ' + hash.digest('hex');
                            //console.log(strTmp1);
                            strFile.push(strTmp1);
                            //console.log(strTmp2);
                            strFile.push(strTmp2);
                        });
                    } else {
                        readfiles(folder + '/' + file);
                    }
                });
            });
        });
    });
}

outFile = (fileArray) => {
    var strOut = fileArray.join('\n');

    fs.writeFile(config.wk_dir + '/' + fileOut, strOut, function(err) {
        if (err) {
            return console.log("Error writing file: " + err);
            process.exit(1);
        }
    console.log(strOut);
    });
}

sortEx = (inArray, callback) => {
    var tmpArray = [];
    inArray.forEach(file => {
        //exfile.forEach(ex => {
        for (i = 0; i < config.exfile.length; i++) {
            if (file == config.exfile[i]) {
                //console.log('found' + config.exfile[i]);
                file = '';
            }
        }
        if (file != '') {
            tmpArray.push(file);
        }
    });
    callback(tmpArray.sort());
}

main();
