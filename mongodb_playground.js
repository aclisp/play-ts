"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
// Connection URL
var url = 'mongodb://127.0.0.1:27017';
// Database Name
var dbName = 'myproject';
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var client, db, insertedCount, deletedCount, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new mongodb_1.MongoClient(url, { useUnifiedTopology: true });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, client.connect()];
                case 2:
                    _a.sent();
                    console.log('Connected successfully to server');
                    db = client.db(dbName);
                    return [4 /*yield*/, insertSampleDocuments(db)];
                case 3:
                    insertedCount = _a.sent();
                    console.log("insert samples: inserted " + insertedCount + " records");
                    return [4 /*yield*/, query(db)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, clean(db)];
                case 5:
                    deletedCount = _a.sent();
                    console.log("clean: deleted " + deletedCount + " records");
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 7];
                case 7:
                    client.close();
                    return [2 /*return*/];
            }
        });
    });
})();
function insertSampleDocuments(db) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('geo_records').insertMany([
                        { name: 'Apple', sex: 0, location: { coordinates: [-73.856077, 40.848447], type: 'Point' } },
                        { name: 'Bar', sex: 0, location: { coordinates: [-84.2040813, 9.9986585], type: 'Point' } },
                        { name: 'Cate', sex: 1, location: { coordinates: [-74.0259567, 40.6353674], type: 'Point' } },
                        { name: 'Danti', sex: 1, location: { coordinates: [-48.9424, -16.3550032], type: 'Point' } },
                        { name: 'Eric', sex: 0, location: { coordinates: [-91.5971285, 41.6823902], type: 'Point' } }
                    ])];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, db.collection('geo_records').createIndex({ location: '2dsphere' })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, result.insertedCount];
            }
        });
    });
}
function clean(db) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('geo_records').deleteMany({})];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.deletedCount];
            }
        });
    });
}
function query(db) {
    return __awaiter(this, void 0, void 0, function () {
        var docs, names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.collection('geo_records').find({
                        location: {
                            $nearSphere: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [-73.8786113, 40.8502883]
                                }
                            }
                        },
                        sex: 0
                    }).toArray()];
                case 1:
                    docs = _a.sent();
                    names = docs.map(function (x) { return x.name; });
                    console.log("query: " + names);
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=mongodb_playground.js.map