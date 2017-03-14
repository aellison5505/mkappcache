#!/usr/bin/env node

const root = 'dist';
var remove = 'dist/';
var network = ['index.html'];

const fs = require('fs');
const crypto = require('crypto');
const async = require('async');


console.log('CACHE MANIFEST');

mknetwork = (files) => {
    console.log('NETWORK:')
    files.forEach(file => {
        console.log(file);
    });

}



readfiles = (folder,callback) => {
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            var fullfile = folder + '/' + file;
            fs.stat(fullfile, (err, stats) => {
                if (!stats.isDirectory()) {
                    fs.readFile(fullfile, (err, buf) => {
                        var hash = crypto.createHash('md5');
                        hash.update(buf);
                        console.log(fullfile.replace(remove, '') + '/' + file);
                        console.log('# ' + hash.digest('hex'));
                    });
                } else {
                    callback(folder + '/' + file,readfiles);
                }
            });
        });
    });

}

readfiles(root, readfiles);
