Cli command to create appcache files

Install:

npm install -g mkappcache

npm install -sav-dev mkappcache


Testing:

npm run test

Test should create file: test/dist/app.appcache

Usage:

Cli command to create appcache files

  Usage
    $ mkappcache [outFile] [options]
        default: outfile=app.appcache, uses CWD for all actions

  Options
    -c config, --config=./path
          default looks for config in CWD

    -m mkconfig, --mkconfig
          writes a config file to the current working directory
          edit config file to needs

    -h help, --help

  Examples
    $ mkappcache app.appcache -c ./mkappcache-config.js

Configuration File Format:

module.exports = {
    wk_dir : './dist',
    remove : './dist/',
    network : ['*'],
    prepend : '',
    fallbacks : [{get:'/',fallto:'index.html'}],
    exfile : ['app.appcache','mkappcache-config.js']
}

 
