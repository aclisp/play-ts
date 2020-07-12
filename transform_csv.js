"use strict";
exports.__esModule = true;
var fs = require("fs");
var stream_1 = require("stream");
var csv = require("csv-parser");
var YEAR_MS = 365 * 24 * 60 * 60 * 1000;
fs.createReadStream('people.csv')
    .pipe(csv())
    .pipe(clean())
    .on('data', function (row) { return console.log(JSON.stringify(row)); });
function clean() {
    return new stream_1.Transform({
        objectMode: true,
        transform: function (row, encoding, callback) {
            var _a = row.name.split(' '), firstName = _a[0], lastName = _a[1];
            var age = Math.floor((Date.now() - new Date(row.dob).getTime()) / YEAR_MS);
            callback(null, {
                firstName: firstName,
                lastName: lastName,
                age: age
            });
        }
    });
}
//# sourceMappingURL=transform_csv.js.map