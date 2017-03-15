#!/usr/bin/env node

var root = 'dist';
var remove = 'dist/';
var network = ['*'];
var fallbacks = '{"fallback":[{"file":"/","fallto":"index.html"}]}';
var exfile = ['app.appcache','service-worker.js'];
var fileOut = 'app.appcache';

const fs = require('fs');
const crypto = require('crypto');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({pkg: pkg}).notify();

let strFile = [];
//console.log('CACHE MANIFEST');
strFile.push('CACHE MANIFEST');

const cli = meow(`
    Usage
      $ mkappcache outFile
          default: app.appcache
    Options
      -c config, --config=path to config file
            default config same directory from call
      -h, --help

    Examples
      $ mkappcache app.appcache -c=.appcache-config
`, {
    alias: {
        c: 'config',
        h: 'help',
        v:'version'
    }
});

phraseCli = () => {
  var flags = cli.flags;
  if(cli.input[0]){
    fileOut=cli.input[0];
  }
  if(flags.config){
    console.log(flags.config);
  }

  //console.log(cli);

}

phraseCli();
//return;

mknetwork = (files) => {
    //console.log('NETWORK:')
    strFile.push('NETWORK:');
    files.forEach(file => {
        //console.log(file);
        strFile.push(file);
    });

}

mkfallback = (file) => {
    var obj = JSON.parse(file);
    //console.log('FALLBACK:');
    strFile.push('FALLBACK:');
    obj.fallback.forEach(key => {
        //console.log(key.file + ' ' + key.fallto);
        strFile.push(key.file + ' ' + key.fallto);
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
                            var strTmp1 = fullfile.replace(remove, '');
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
    console.log(strOut);
    fs.writeFile(root + '/' + fileOut, strOut, function(err) {
        if (err) {
            return console.log("Error writing file: " + err);
        }
    });
}

sortEx = (inArray, callback) => {
    var tmpArray = [];
    inArray.forEach(file => {
        //exfile.forEach(ex => {
          for(i=0;i<exfile.length;i++){
            if (file == exfile[i]) {
              console.log('found'+exfile[i]);
              file='';
            }
          }
            if(file!=''){
                tmpArray.push(file);
            }
    });
    callback(tmpArray.sort());
}

let count = 0;
readfiles(root);
let timer = setInterval(() => {
    if (count === strFile.length) {
        clearInterval(timer);
        mknetwork(network);
        mkfallback(fallbacks);
        outFile(strFile);
    } else {
        count = strFile.length;
    }
}, 250);
