#!/usr/bin/env node

var root = 'dist';
var remove = 'dist/';
var network = ['index.html'];
var fallbacks = '{"fallback":[{"file":"/","fallto":"index.html"}]}';
var exfile = '';

const fs = require('fs');
const crypto = require('crypto');
let strFile = [];

console.log('CACHE MANIFEST');
strFile.push('CACHE MANIFEST');



mknetwork = (files) => {
    console.log('NETWORK:')
    strFile.push('NETWORK:');
    files.forEach(file => {
        console.log(file);
        strFile.push(file);
    });

}

mkfallback = (file) => {
  var obj = JSON.parse(file);
  console.log('FALLBACK:');
  strFile.push('FALLBACK:');
  obj.fallback.forEach(key =>{
    console.log(key.file+' '+key.fallto);
    strFile.push(key.file+' '+key.fallto);
 });
}



readfiles = (folder) => {
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            var fullfile = folder + '/' + file;
            fs.stat(fullfile, (err, stats) => {
                if (!stats.isDirectory()) {
                    fs.readFile(fullfile, (err, buf) => {
                        var hash = crypto.createHash('md5');
                        hash.update(buf);
                        var strTmp1 = fullfile.replace(remove, '');
                        var strTmp2 = '# ' + hash.digest('hex');
                        console.log(strTmp1);
                        strFile.push(strTmp1);
                        console.log(strTmp2);
                        strFile.push(strTmp2);
                    });
                } else {
                    readfiles(folder + '/' + file);
                }
            });
        });
    });

}
let count=0;
readfiles(root);
let timer = setInterval(()=>{
  if(count===strFile.length){
    clearInterval(timer);
    mknetwork(network);
    mkfallback(fallbacks);
//    console.log(strFile);
  }else{
    count = strFile.length;
  }
},250);
