"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var tmp_1 = require("tmp");
exports.exec = function (command, options) {
    return new Promise(function (resolve, reject) {
        return child_process_1.exec(command, options, function (err, stdout, stderr) { return (err ? reject(err) : resolve({ stdout: stdout, stderr: stderr })); });
    });
};
exports.readFile = function (path) {
    return new Promise(function (resolve, reject) {
        return fs_1.readFile(path, function (err, data) { return (err ? reject(err) : resolve(data)); });
    });
};
exports.writeFile = function (path, data) {
    return new Promise(function (resolve, reject) {
        return fs_1.writeFile(path, data, function (err) { return (err ? reject(err) : resolve()); });
    });
};
exports.createTempDirectory = function () {
    return new Promise(function (resolve, reject) {
        return tmp_1.dir(function (err, path) { return (err ? reject(err) : resolve(path)); });
    });
};
//# sourceMappingURL=utils.js.map