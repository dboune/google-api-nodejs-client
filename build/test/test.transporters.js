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
var pify = require("pify");
var src_1 = require("../src");
var utils_1 = require("./utils");
function testHeaders(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).post('/drive/v2/files/a/comments').reply(200);
                    return [4 /*yield*/, pify(drive.comments.insert)({ fileId: 'a', headers: { 'If-None-Match': '12345' } })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.headers['If-None-Match'], '12345');
                    return [2 /*return*/];
            }
        });
    });
}
function testContentType(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).post('/drive/v2/files/a/comments').reply(200);
                    return [4 /*yield*/, pify(drive.comments.insert)({ fileId: 'a', resource: { content: 'hello ' } })];
                case 1:
                    res = _a.sent();
                    assert(res.request.headers['content-type'].indexOf('application/json') === 0);
                    return [2 /*return*/];
            }
        });
    });
}
function testBody(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
                    return [4 /*yield*/, pify(drive.files.list)()];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.headers['content-type'], null);
                    assert.equal(res.request.body, null);
                    return [2 /*return*/];
            }
        });
    });
}
function testBodyDelete(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).delete('/drive/v2/files/test').reply(200);
                    return [4 /*yield*/, pify(drive.files.delete)({ fileId: 'test' })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.headers['content-type'], null);
                    assert.equal(res.request.body, null);
                    return [2 /*return*/];
            }
        });
    });
}
function testResponseError(drive, cb) {
    drive.files.list({ q: 'hello' }, function (err) {
        assert(err instanceof Error);
        assert.equal(err.message, 'Error!');
        assert.equal(err.code, 400);
        cb();
    });
}
function testNotObjectError(oauth2, cb) {
    oauth2.tokeninfo({ access_token: 'hello' }, function (err) {
        assert(err instanceof Error);
        assert.equal(err.message, 'invalid_grant');
        assert.equal(err.code, 400);
        cb();
    });
}
function testBackendError(urlshortener, cb) {
    var obj = { longUrl: 'http://google.com/' };
    urlshortener.url.insert({ resource: obj }, function (err, result) {
        assert(err instanceof Error);
        assert.equal(err.code, 500);
        assert.equal(err.message, 'There was an error!');
        assert.equal(result, null);
        cb();
    });
}
describe('Transporters', function () {
    var localDrive;
    var remoteDrive;
    var localOauth2;
    var remoteOauth2;
    var localUrlshortener;
    var remoteUrlshortener;
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
                            utils_1.Utils.loadApi(google, 'oauth2', 'v2'),
                            utils_1.Utils.loadApi(google, 'urlshortener', 'v1')
                        ])];
                case 1:
                    _a = _b.sent(), remoteDrive = _a[0], remoteOauth2 = _a[1], remoteUrlshortener = _a[2];
                    nock.disableNetConnect();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        nock.cleanAll();
        nock.disableNetConnect();
        var google = new src_1.GoogleApis();
        localDrive = google.drive('v2');
        localOauth2 = google.oauth2('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    it('should add headers to the request from params', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testHeaders(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testHeaders(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should automatically add content-type for POST requests', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testContentType(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testContentType(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not add body for GET requests', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testBody(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testBody(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not add body for DELETE requests', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testBodyDelete(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testBodyDelete(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return errors within response body as instances of Error', function (done) {
        var scope = nock(utils_1.Utils.baseUrl)
            .get('/drive/v2/files?q=hello')
            .times(2)
            .reply(400, { error: { code: 400, message: 'Error!' } });
        testResponseError(localDrive, function () {
            testResponseError(remoteDrive, function () {
                scope.done();
                done();
            });
        });
    });
    it('should return error message correctly when error is not an object', function (done) {
        var scope = nock(utils_1.Utils.baseUrl)
            .post('/oauth2/v2/tokeninfo?access_token=hello')
            .times(2)
            .reply(400, {
            error: 'invalid_grant',
            error_description: 'Code was already redeemed.'
        });
        testNotObjectError(localOauth2, function () {
            testNotObjectError(remoteOauth2, function () {
                scope.done();
                done();
            });
        });
    });
    it('should return 5xx responses as errors', function (done) {
        var scope = nock(utils_1.Utils.baseUrl)
            .post('/urlshortener/v1/url')
            .times(2)
            .reply(500, 'There was an error!');
        testBackendError(localUrlshortener, function () {
            testBackendError(remoteUrlshortener, function () {
                scope.done();
                done();
            });
        });
    });
    it('should handle 5xx responses that include errors', function (done) {
        var scope = nock(utils_1.Utils.baseUrl).post('/urlshortener/v1/url').times(2).reply(500, {
            error: { message: 'There was an error!' }
        });
        testBackendError(localUrlshortener, function () {
            testBackendError(remoteUrlshortener, function () {
                scope.done();
                done();
            });
        });
    });
    it('should handle a Backend Error', function (done) {
        var scope = nock(utils_1.Utils.baseUrl).post('/urlshortener/v1/url').times(2).reply(500, {
            error: {
                errors: [{
                        domain: 'global',
                        reason: 'backendError',
                        message: 'There was an error!'
                    }],
                code: 500,
                message: 'There was an error!'
            }
        });
        testBackendError(localUrlshortener, function () {
            testBackendError(remoteUrlshortener, function () {
                scope.done();
                done();
            });
        });
    });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.transporters.js.map