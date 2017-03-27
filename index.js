#!/usr/bin/env node

var chalk = require('chalk');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var S = require('string');
var argv = require('minimist')(process.argv.slice(2));
var link = require('./lib/link');

var usage = 'Usage: npm-link-shared <shared-modules-dir> <target-installation-dir> [--yarn] [--allow-no-dir] [--<npm-link-option> [--<npm-link-option>]] [<module1..> [, <module2..>]]';

if (argv._.length < 2) {
  console.log(usage);
  return;
}

var sharedDir = argv._[0];
var targetDir = argv._[1];

if (!sharedDir || !targetDir) {
  console.log(usage);
  return;
}

sharedDir = S(sharedDir).ensureRight('/').s;
targetDir = S(targetDir).ensureRight('/').s;

var moduleList = [];
if (argv._.length > 2) {
  for (var i = 2; i < argv._.length; i++) {
    moduleList.push(argv._[i]);
  }
}

var executable = argv['yarn'] ? 'yarn' : 'npm';
var allowNoDir = argv['allow-no-dir'] ? true : false;

delete(argv['_']);
delete(argv['yarn']);
delete(argv['allow-nodir']);

var optionList = Object.keys(argv).map(function (optionName) {
    return '--' + optionName + '=' + argv[optionName];
});

link(sharedDir, targetDir, moduleList, optionList, executable, allowNoDir);
