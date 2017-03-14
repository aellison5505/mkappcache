#!/usr/bin/env node

const testFolder = './dist/';
const fs = require('fs');
const crypto = require('crypto');

console.log('CACHE MANIFEST');

readfiles = (folder) => {
  subfolder = [];
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            fs.stat(folder + '/' + file, (err, stats) => {
                if (!stats.isDirectory()) {
                    fs.readFile(folder + '/' + file, (err, buf) => {
                        var hash = crypto.createHash('md5');
                        hash.update(buf);
                        console.log(file);
                        console.log('# ' + hash.digest('hex'));
                    });
                }else{
                  readfiles(folder+'/'+file);
                }
            });
        });
    });
    console.log(subfolder);
    subfolder.forEach((sub, index) => {
      readfiles(folder+'/'+sub);
    });
}


readfiles(testFolder);
