"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var core_1 = require("@angular-devkit/core");
var dateFormat = require("dateformat");
// import { writeFile } from 'fs';
var fs = require('fs');
var VersionBuilder = /** @class */ (function () {
    function VersionBuilder(context) {
        this.context = context;
    }
    VersionBuilder.prototype.run = function (builderConfig) {
        var root = this.context.workspace.root;
        var _a = builderConfig.options, destPath = _a.destPath, format = _a.format, version = _a.version;
        var filename = core_1.getSystemPath(root) + "/" + destPath;
        var filenames = [
            filename + ".json",
            filename + ".development.json",
            filename + ".production.json",
            filename + ".test.json"
        ];
        filenames.forEach(function (name, index) {
            if (fs.existsSync(name)) {
                var rowData = fs.readFileSync(name);
                var data = JSON.parse(rowData.toString());
                var versionArray = data.version.split('.');
                var minorIncrement = Number(versionArray[versionArray.length - 1]) + 1;
                versionArray[versionArray.length - 1] = minorIncrement.toString();
                var newVersion = versionArray.join('.');
                data.version = newVersion;
                data.date = dateFormat(new Date(), format);
                console.info(dateFormat(new Date(), format), data, data.version, newVersion);
                fs.writeFileSync(name, JSON.stringify(data));
            }
        });
        return rxjs_1.of({ success: false });
    };
    return VersionBuilder;
}());
exports["default"] = VersionBuilder;
