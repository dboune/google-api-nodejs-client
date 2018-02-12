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
describe('Query params', function () {
    var localCompute;
    var remoteCompute;
    var localDrive;
    var remoteDrive;
    var localGmail;
    var remoteGmail;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, Promise.all([
                            utils_1.Utils.loadApi(google, 'compute', 'v1'),
                            utils_1.Utils.loadApi(google, 'drive', 'v2'), utils_1.Utils.loadApi(google, 'gmail', 'v1')
                        ])];
                case 1:
                    _a = _b.sent(), remoteCompute = _a[0], remoteDrive = _a[1], remoteGmail = _a[2];
                    nock.disableNetConnect();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        nock.cleanAll();
        nock.disableNetConnect();
        var google = new src_1.GoogleApis();
        localCompute = google.compute('v1');
        localDrive = google.drive('v2');
        localGmail = google.gmail('v1');
    });
    it('should not append ? with no query parameters', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/ID').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: 'ID' })];
                case 1:
                    res = _a.sent();
                    assert.equal(-1, res.config.url.indexOf('?'));
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/ID').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: 'ID' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(-1, res2.config.url.indexOf('?'));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be null if no object passed', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.list)()];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), null);
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.list)()];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be null if params passed are in path', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), null);
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be set if params passed are optional query params', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .get('/drive/v2/files/123?updateViewedDate=true')
                        .reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123', updateViewedDate: true })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'updateViewedDate=true');
                    nock(utils_1.Utils.baseUrl)
                        .get('/drive/v2/files/123?updateViewedDate=true')
                        .reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123', updateViewedDate: true })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'updateViewedDate=true');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be set if params passed are unknown params', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?madeThisUp=hello').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123', madeThisUp: 'hello' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'madeThisUp=hello');
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?madeThisUp=hello').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123', madeThisUp: 'hello' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'madeThisUp=hello');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be set if params passed are aliased names', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?resource=hello').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123', resource_: 'hello' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'resource=hello');
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123?resource=hello').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123', resource_: 'hello' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'resource=hello');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be set if params passed are falsy', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2, res3, res4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/compute/v1/projects//zones//instances//setDiskAutoDelete?autoDelete=false&deviceName=')
                        .reply(200);
                    return [4 /*yield*/, pify(localCompute.instances.setDiskAutoDelete)({
                            project: '',
                            zone: '',
                            instance: '',
                            autoDelete: false,
                            deviceName: ''
                        })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'autoDelete=false&deviceName=');
                    nock(utils_1.Utils.baseUrl)
                        .post('/compute/v1/projects//zones//instances//setDiskAutoDelete?autoDelete=false&deviceName=')
                        .reply(200);
                    return [4 /*yield*/, pify(remoteCompute.instances.setDiskAutoDelete)({
                            project: '',
                            zone: '',
                            instance: '',
                            autoDelete: false,
                            deviceName: ''
                        })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'autoDelete=false&deviceName=');
                    nock(utils_1.Utils.baseUrl)
                        .post('/compute/v1/projects//zones//instanceGroupManagers//resize?size=0')
                        .reply(200);
                    return [4 /*yield*/, pify(localCompute.instanceGroupManagers.resize)({ project: '', zone: '', instanceGroupManager: '', size: 0 })];
                case 3:
                    res3 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res3), 'size=0');
                    nock(utils_1.Utils.baseUrl)
                        .post('/compute/v1/projects//zones//instanceGroupManagers//resize?size=0')
                        .reply(200);
                    return [4 /*yield*/, pify(remoteCompute.instanceGroupManagers.resize)({ project: '', zone: '', instanceGroupManager: '', size: 0 })];
                case 4:
                    res4 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res4), 'size=0');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should chain together with & in order', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .get('/drive/v2/files/123?madeThisUp=hello&thisToo=world')
                        .reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123', madeThisUp: 'hello', thisToo: 'world' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'madeThisUp=hello&thisToo=world');
                    nock(utils_1.Utils.baseUrl)
                        .get('/drive/v2/files/123?madeThisUp=hello&thisToo=world')
                        .reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123', madeThisUp: 'hello', thisToo: 'world' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'madeThisUp=hello&thisToo=world');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not include auth if auth is an OAuth2Client object', function () { return __awaiter(_this, void 0, void 0, function () {
        var oauth2client, res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauth2client = new src_1.google.auth.OAuth2('CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI');
                    oauth2client.credentials = { access_token: 'abc123' };
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: '123', auth: oauth2client })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), null);
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/123').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: '123', auth: oauth2client })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle multi-value query params properly', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .get('/gmail/v1/users/me/messages/abc123?metadataHeaders=To&metadataHeaders=Date')
                        .reply(200);
                    return [4 /*yield*/, pify(localGmail.users.messages.get)({ userId: 'me', id: 'abc123', metadataHeaders: ['To', 'Date'] })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'metadataHeaders=To&metadataHeaders=Date');
                    nock(utils_1.Utils.baseUrl)
                        .get('/gmail/v1/users/me/messages/abc123?metadataHeaders=To&metadataHeaders=Date')
                        .reply(200);
                    return [4 /*yield*/, pify(remoteGmail.users.messages.get)({ userId: 'me', id: 'abc123', metadataHeaders: ['To', 'Date'] })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'metadataHeaders=To&metadataHeaders=Date');
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.query.js.map