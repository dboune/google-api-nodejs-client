"use strict";
// Copyright 2013-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var nock = require("nock");
var path = require("path");
var pify = require("pify");
var src_1 = require("../src");
var utils_1 = require("./utils");
function testSingleRequest(urlshortener) {
    return __awaiter(this, void 0, void 0, function () {
        var obj, reqPath, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    obj = { longUrl: 'http://someurl...' };
                    reqPath = '/urlshortener/v1/url?longUrl=http%3A%2F%2Fsomeurl...';
                    nock(utils_1.Utils.baseUrl).post(reqPath).reply(200);
                    return [4 /*yield*/, pify(urlshortener.url.insert)(obj)];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'longUrl=http%3A%2F%2Fsomeurl...');
                    assert.equal(res.config.method.toLowerCase(), 'post');
                    return [2 /*return*/];
            }
        });
    });
}
function testParams(urlshortener) {
    return __awaiter(this, void 0, void 0, function () {
        var params, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = { shortUrl: 'a' };
                    nock(utils_1.Utils.baseUrl).get('/urlshortener/v1/url?shortUrl=a').reply(200);
                    return [4 /*yield*/, pify(urlshortener.url.get)(params)];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'shortUrl=a');
                    assert.equal(res.config.method.toLowerCase(), 'get');
                    return [2 /*return*/];
            }
        });
    });
}
function testInsert(urlshortener) {
    return __awaiter(this, void 0, void 0, function () {
        var obj, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    obj = { longUrl: 'http://google.com/' };
                    nock(utils_1.Utils.baseUrl).post('/resource').reply(200);
                    return [4 /*yield*/, pify(urlshortener.url.insert)({ resource: obj })];
                case 1:
                    res = _a.sent();
                    assert.notEqual(res.data, null);
                    assert.notEqual(res.data.kind, null);
                    assert.notEqual(res.data.id, null);
                    assert.equal(res.data.longUrl, 'http://google.com/');
                    return [2 /*return*/, res];
            }
        });
    });
}
describe('Urlshortener', function () {
    var localUrlshortener;
    var remoteUrlshortener;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, utils_1.Utils.loadApi(google, 'urlshortener', 'v1')];
                case 1:
                    remoteUrlshortener = _a.sent();
                    nock.disableNetConnect();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        nock.cleanAll();
        nock.disableNetConnect();
        var google = new src_1.GoogleApis();
        localUrlshortener = google.urlshortener('v1');
    });
    it('should generate a valid payload for single requests', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testSingleRequest(localUrlshortener)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testSingleRequest(remoteUrlshortener)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate valid payload if any params are given', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testParams(localUrlshortener)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testParams(remoteUrlshortener)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return a single response object for single requests', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl, { allowUnmocked: true })
                        .post('/urlshortener/v1/url')
                        .times(2)
                        .replyWithFile(200, path.join(__dirname, '../../test/fixtures/urlshort-insert-res.json'));
                    return [4 /*yield*/, testInsert(localUrlshortener)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testInsert(remoteUrlshortener)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.urlshortener.v1.js.map