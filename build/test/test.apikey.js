"use strict";
// Copyright 2014-2016, Google, Inc.
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
var pify = require("pify");
var src_1 = require("../src");
var utils_1 = require("./utils");
function testGet(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=APIKEY').reply(200);
                    return [4 /*yield*/, pify(drive.files.get)({ fileId: '123', auth: 'APIKEY' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'key=APIKEY');
                    return [2 /*return*/];
            }
        });
    });
}
function testParams2(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=API%20KEY').reply(200);
                    return [4 /*yield*/, pify(drive.files.get)({ fileId: '123', auth: 'API KEY' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'key=API%20KEY');
                    return [2 /*return*/];
            }
        });
    });
}
function testKeyParam(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?key=abc123').reply(200);
                    return [4 /*yield*/, pify(drive.files.get)({ fileId: '123', auth: 'API KEY', key: 'abc123' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'key=abc123');
                    return [2 /*return*/];
            }
        });
    });
}
function testAuthKey(urlshortener) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .get('/urlshortener/v1/url/history?key=YOUR%20API%20KEY')
                        .reply(200);
                    return [4 /*yield*/, pify(urlshortener.url.list)({ auth: 'YOUR API KEY' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res).indexOf('key=YOUR%20API%20KEY') > -1, true);
                    return [2 /*return*/];
            }
        });
    });
}
describe('API key', function () {
    var localDrive;
    var remoteDrive;
    var localUrlshortener;
    var remoteUrlshortener;
    var authClient;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, Promise.all([
                            utils_1.Utils.loadApi(google, 'drive', 'v2'),
                            utils_1.Utils.loadApi(google, 'urlshortener', 'v1')
                        ])];
                case 1:
                    _a = _b.sent(), remoteDrive = _a[0], remoteUrlshortener = _a[1];
                    nock.disableNetConnect();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        nock.cleanAll();
        nock.disableNetConnect();
        var google = new src_1.GoogleApis();
        var OAuth2 = google.auth.OAuth2;
        authClient = new OAuth2('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URL');
        authClient.credentials = { access_token: 'abc123' };
        localDrive = google.drive('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    it('should include auth APIKEY as key=<APIKEY>', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testGet(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testGet(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should properly escape params E.g. API KEY to API%20KEY', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testParams2(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testParams2(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should use key param over auth apikey param if both provided', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testKeyParam(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testKeyParam(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should set API key parameter if it is present', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAuthKey(localUrlshortener)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testAuthKey(remoteUrlshortener)];
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
//# sourceMappingURL=test.apikey.js.map