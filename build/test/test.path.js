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
var src_1 = require("../src");
var utils_1 = require("./utils");
describe('Path params', function () {
    var localDrive;
    var remoteDrive;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, utils_1.Utils.loadApi(google, 'drive', 'v2')];
                case 1:
                    remoteDrive = _a.sent();
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
    });
    it('should not throw error if not included and required', function (done) {
        assert.doesNotThrow(function () {
            localDrive.files.get({}, utils_1.Utils.noop);
            remoteDrive.files.get({}, utils_1.Utils.noop);
            done();
        });
    });
    it('should return an err object if not included and required', function (done) {
        localDrive.files.get({}, function (err) {
            assert.notEqual(err, null);
            remoteDrive.files.get({}, function (e) {
                assert.notEqual(e, null);
                done();
            });
        });
    });
    it('should be mentioned in err.message when missing', function (done) {
        localDrive.files.get({}, function (err) {
            assert.notEqual(err.message.indexOf('fileId'), -1, 'Missing param not mentioned in error');
            remoteDrive.files.get({}, function (e) {
                assert.notEqual(e.message.indexOf('fileId'), -1, 'Missing param not mentioned in error');
                done();
            });
        });
    });
    it('should return null response object if not included and required', function (done) {
        localDrive.files.get({}, function (err, resp) {
            assert(err);
            assert.equal(resp, null);
            remoteDrive.files.get({}, function (e, resp2) {
                assert(e);
                assert.equal(resp2, null);
                done();
            });
        });
    });
    it('should return null request object if not included and required', function () {
        var req = localDrive.files.get({}, utils_1.Utils.noop);
        assert.equal(req, null);
        req = remoteDrive.files.get({}, utils_1.Utils.noop);
        assert.equal(req, null);
    });
    it('should return null request object if not included and required and no callback', function () {
        var req = localDrive.files.get({}, utils_1.Utils.noop);
        assert.equal(req, null);
        req = remoteDrive.files.get({}, utils_1.Utils.noop);
        assert.equal(req, null);
    });
    it('should not be modifiable directly', function () {
        var options = { fileId: '123' };
        assert.doesNotThrow(function () {
            // should not modify options object
            localDrive.files.get(options, utils_1.Utils.noop);
            localDrive.files.get(options, utils_1.Utils.noop);
            remoteDrive.files.get(options, utils_1.Utils.noop);
            remoteDrive.files.get(options, utils_1.Utils.noop);
        });
    });
    it('should be put in URL of path', function (done) {
        var p = '/drive/v2/files/abc123';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: 'abc123' }, function (err, res) {
            if (err) {
                return done(err);
            }
            assert.equal(res.config.url, utils_1.Utils.baseUrl + p);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: 'abc123' }, function (err2, res2) {
                if (err2) {
                    return done(err2);
                }
                assert.equal(res2.config.url, utils_1.Utils.baseUrl + p);
                done();
            });
        });
    });
    it('should be put in URL of pathname', function (done) {
        var p = '/drive/v2/files/123abc';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc' }, function (err, res) {
            if (err) {
                return done(err);
            }
            assert.equal(utils_1.Utils.getPath(res), p);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc' }, function (err2, res2) {
                if (err2) {
                    return done(err2);
                }
                assert.equal(utils_1.Utils.getPath(res), p);
                done();
            });
        });
    });
    it('should not be urlencoded', function (done) {
        var p = '/drive/v2/files/p@ram';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: 'p@ram' }, function (err, res) {
            if (err) {
                return done(err);
            }
            var parm = utils_1.Utils.getPath(res).split('/').pop();
            assert.equal(parm, 'p@ram');
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: 'p@ram' }, function (err2, res2) {
                if (err2) {
                    return done(err2);
                }
                var parm = utils_1.Utils.getPath(res).split('/').pop();
                assert.equal(parm, 'p@ram');
                done();
            });
        });
    });
    it('should keep query params null if only path params', function (done) {
        var p = '/drive/v2/files/123abc';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc' }, function (err, res) {
            if (err) {
                return done(err);
            }
            assert.equal(utils_1.Utils.getQs(res), null);
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc' }, function (err2, res2) {
                if (err2) {
                    return done(err2);
                }
                assert.equal(utils_1.Utils.getQs(res2), null);
                done();
            });
        });
    });
    it('should keep query params as is', function (done) {
        var p = '/drive/v2/files/123abc?hello=world';
        nock(utils_1.Utils.baseUrl).get(p).reply(200);
        localDrive.files.get({ fileId: '123abc', hello: 'world' }, function (err, res) {
            if (err) {
                return done(err);
            }
            assert.equal(utils_1.Utils.getQs(res), 'hello=world');
            nock(utils_1.Utils.baseUrl).get(p).reply(200);
            remoteDrive.files.get({ fileId: '123abc', hello: 'world' }, function (err2, res2) {
                if (err2) {
                    return done(err2);
                }
                assert.equal(utils_1.Utils.getQs(res), 'hello=world');
                done();
            });
        });
    });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.path.js.map