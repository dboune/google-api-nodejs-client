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
var fs = require("fs");
var nock = require("nock");
var path = require("path");
var pify = require("pify");
var src_1 = require("../src");
var utils_1 = require("./utils");
var boundaryPrefix = 'multipart/related; boundary=';
function testMultpart(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var resource, media, expectedResp, res, boundary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = { title: 'title', mimeType: 'text/plain' };
                    media = { body: 'hey' };
                    expectedResp = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
                    return [4 /*yield*/, pify(drive.files.insert)({ resource: resource, media: media })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.method.toLowerCase(), 'post');
                    assert.equal(res.request.path, '/upload/drive/v2/files?uploadType=multipart');
                    assert.equal(res.request.headers['content-type'].indexOf('multipart/related;'), 0);
                    boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
                    expectedResp = expectedResp.replace(/\n/g, '\r\n')
                        .replace(/\$boundary/g, boundary)
                        .replace('$media', media.body)
                        .replace('$resource', JSON.stringify(resource))
                        .replace('$mimeType', 'text/plain')
                        .trim();
                    assert.strictEqual(expectedResp, res.data);
                    return [2 /*return*/];
            }
        });
    });
}
function testMediaBody(drive) {
    return __awaiter(this, void 0, void 0, function () {
        var resource, media, expectedResp, res, boundary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = { title: 'title' };
                    media = { body: 'hey' };
                    expectedResp = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
                    return [4 /*yield*/, pify(drive.files.insert)({ resource: resource, media: media })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.method.toLowerCase(), 'post');
                    assert.equal(res.request.path, '/upload/drive/v2/files?uploadType=multipart');
                    assert.equal(res.request.headers['content-type'].indexOf('multipart/related;'), 0);
                    boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
                    expectedResp = expectedResp.replace(/\n/g, '\r\n')
                        .replace(/\$boundary/g, boundary)
                        .replace('$media', media.body)
                        .replace('$resource', JSON.stringify(resource))
                        .replace('$mimeType', 'text/plain')
                        .trim();
                    assert.strictEqual(expectedResp, res.data);
                    return [2 /*return*/];
            }
        });
    });
}
describe('Media', function () {
    var localDrive, remoteDrive;
    var localGmail, remoteGmail;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, Promise.all([
                            utils_1.Utils.loadApi(google, 'drive', 'v2'), utils_1.Utils.loadApi(google, 'gmail', 'v1')
                        ])];
                case 1:
                    _a = _b.sent(), remoteDrive = _a[0], remoteGmail = _a[1];
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
        localGmail = google.gmail('v1');
    });
    it('should post with uploadType=multipart if resource and media set', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?uploadType=multipart')
                        .times(2)
                        .reply(200, { fileId: 'abc123' });
                    return [4 /*yield*/, pify(localDrive.files.insert)({ resource: {}, media: { body: 'hello' } })];
                case 1:
                    res = _a.sent();
                    assert.equal(JSON.stringify(res.data), JSON.stringify({ fileId: 'abc123' }));
                    return [4 /*yield*/, pify(remoteDrive.files.insert)({ resource: {}, media: { body: 'hello' } })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(JSON.stringify(res2.data), JSON.stringify({ fileId: 'abc123' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should post with uploadType=media media set but not resource', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?uploadType=media')
                        .times(2)
                        .reply(200, { fileId: 'abc123' });
                    return [4 /*yield*/, pify(localDrive.files.insert)({ media: { body: 'hello' } })];
                case 1:
                    res = _a.sent();
                    assert.equal(JSON.stringify(res.data), JSON.stringify({ fileId: 'abc123' }));
                    return [4 /*yield*/, pify(remoteDrive.files.insert)({ media: { body: 'hello' } })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(JSON.stringify(res2.data), JSON.stringify({ fileId: 'abc123' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate a valid media upload if media is set, metadata is not set', function () { return __awaiter(_this, void 0, void 0, function () {
        var media, res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?uploadType=media')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response
                        // for testing purposes
                    });
                    media = { body: 'hey' };
                    return [4 /*yield*/, pify(localDrive.files.insert)({ media: media })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.config.method.toLowerCase(), 'post');
                    assert.equal(res.request.path, '/upload/drive/v2/files?uploadType=media');
                    assert.strictEqual(media.body, res.data);
                    return [4 /*yield*/, pify(remoteDrive.files.insert)({ media: media })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(res.config.method.toLowerCase(), 'post');
                    assert.equal(res.request.path, '/upload/drive/v2/files?uploadType=media');
                    assert.strictEqual(media.body, res2.data);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate valid multipart upload if media and metadata are both set', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?uploadType=multipart')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response
                        // for testing purposes
                    });
                    return [4 /*yield*/, testMultpart(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testMultpart(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not require parameters for insertion requests', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?someAttr=someValue&uploadType=media')
                        .twice()
                        .reply(200);
                    return [4 /*yield*/, pify(localDrive.files.insert)({ someAttr: 'someValue', media: { body: 'wat' } })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'someAttr=someValue&uploadType=media');
                    return [4 /*yield*/, pify(remoteDrive.files.insert)({ someAttr: 'someValue', media: { body: 'wat' } })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'someAttr=someValue&uploadType=media');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not multipart upload if no media body given', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/drive/v2/files?someAttr=someValue')
                        .twice()
                        .reply(200);
                    return [4 /*yield*/, pify(localDrive.files.insert)({ someAttr: 'someValue' })];
                case 1:
                    res = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res), 'someAttr=someValue');
                    return [4 /*yield*/, pify(remoteDrive.files.insert)({ someAttr: 'someValue' })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(utils_1.Utils.getQs(res2), 'someAttr=someValue');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should set text/plain when passed a string as media body', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/drive/v2/files?uploadType=multipart')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response for
                        // testing purposes
                    });
                    return [4 /*yield*/, testMediaBody(localDrive)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testMediaBody(remoteDrive)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle metadata-only media requests properly', function () { return __awaiter(_this, void 0, void 0, function () {
        var resource, res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/gmail/v1/users/me/drafts')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response for
                        // testing purposes
                    });
                    resource = {
                        message: { raw: (new Buffer('hello', 'binary')).toString('base64') }
                    };
                    return [4 /*yield*/, pify(localGmail.users.drafts.create)({ userId: 'me', resource: resource, media: { mimeType: 'message/rfc822' } })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.request.headers['content-type'].indexOf('application/json'), 0);
                    assert.equal(JSON.stringify(res.data), JSON.stringify(resource));
                    return [4 /*yield*/, pify(remoteGmail.users.drafts.create)({ userId: 'me', resource: resource, media: { mimeType: 'message/rfc822' } })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(res2.request.headers['content-type'].indexOf('application/json'), 0);
                    assert.equal(JSON.stringify(res2.data), JSON.stringify(resource));
                    return [2 /*return*/];
            }
        });
    }); });
    it('should accept readable stream as media body without metadata', function () { return __awaiter(_this, void 0, void 0, function () {
        var body, expectedBody, res, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/gmail/v1/users/me/drafts?uploadType=media')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response for
                        // testing purposes
                    });
                    body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    return [4 /*yield*/, pify(localGmail.users.drafts.create)({ userId: 'me', media: { mimeType: 'message/rfc822', body: body } })];
                case 1:
                    res = _a.sent();
                    assert.equal(res.data, expectedBody);
                    body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    return [4 /*yield*/, pify(remoteGmail.users.drafts.create)({ userId: 'me', media: { mimeType: 'message/rfc822', body: body } })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(res2.data, expectedBody);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should accept readable stream as media body with metadata', function () { return __awaiter(_this, void 0, void 0, function () {
        var resource, body, bodyString, media, expectedBody, res, boundary, res2, boundary2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/gmail/v1/users/me/drafts?uploadType=multipart')
                        .times(2)
                        .reply(201, function (uri, reqBody) {
                        return reqBody; // return request body as response for testing
                        // purposes
                    });
                    resource = {
                        message: { raw: (new Buffer('hello', 'binary')).toString('base64') }
                    };
                    body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    bodyString = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), { encoding: 'utf8' });
                    media = { mimeType: 'message/rfc822', body: body };
                    expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
                    return [4 /*yield*/, pify(localGmail.users.drafts.create)({ userId: 'me', resource: resource, media: media })];
                case 1:
                    res = _a.sent();
                    boundary = res.request.headers['content-type'].replace(boundaryPrefix, '');
                    expectedBody = expectedBody.replace(/\n/g, '\r\n')
                        .replace(/\$boundary/g, boundary)
                        .replace('$media', bodyString)
                        .replace('$resource', JSON.stringify(resource))
                        .replace('$mimeType', 'message/rfc822')
                        .trim();
                    assert.strictEqual(expectedBody, res.data);
                    resource = {
                        message: { raw: (new Buffer('hello', 'binary')).toString('base64') }
                    };
                    body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    bodyString = fs.readFileSync(path.join(__dirname, '../../test/fixtures/mediabody.txt'), { encoding: 'utf8' });
                    media = { mimeType: 'message/rfc822', body: body };
                    expectedBody = fs.readFileSync(path.join(__dirname, '../../test/fixtures/media-response.txt'), { encoding: 'utf8' });
                    return [4 /*yield*/, pify(remoteGmail.users.drafts.create)({ userId: 'me', resource: resource, media: media })];
                case 2:
                    res2 = _a.sent();
                    boundary2 = res2.request.headers['content-type'].replace(boundaryPrefix, '');
                    expectedBody = expectedBody.replace(/\n/g, '\r\n')
                        .replace(/\$boundary/g, boundary2)
                        .replace('$media', bodyString)
                        .replace('$resource', JSON.stringify(resource))
                        .replace('$mimeType', 'message/rfc822')
                        .trim();
                    assert.strictEqual(expectedBody, res2.data);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return err, {object}body, resp for streaming media requests', function () { return __awaiter(_this, void 0, void 0, function () {
        var resource, body, media, res, body2, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl)
                        .post('/upload/gmail/v1/users/me/drafts?uploadType=multipart')
                        .times(2)
                        .reply(201, function () {
                        return JSON.stringify({ hello: 'world' });
                    });
                    resource = {
                        message: { raw: (new Buffer('hello', 'binary')).toString('base64') }
                    };
                    body = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    media = { mimeType: 'message/rfc822', body: body };
                    return [4 /*yield*/, pify(localGmail.users.drafts.create)({ userId: 'me', resource: resource, media: media })];
                case 1:
                    res = _a.sent();
                    assert.equal(typeof res.data, 'object');
                    assert.equal(res.data.hello, 'world');
                    assert.equal(typeof res, 'object');
                    resource = {
                        message: { raw: (new Buffer('hello', 'binary')).toString('base64') }
                    };
                    body2 = fs.createReadStream(path.join(__dirname, '../../test/fixtures/mediabody.txt'));
                    media = { mimeType: 'message/rfc822', body: body2 };
                    return [4 /*yield*/, pify(remoteGmail.users.drafts.create)({ userId: 'me', resource: resource, media: media })];
                case 2:
                    res2 = _a.sent();
                    assert.equal(typeof res2.data, 'object');
                    assert.equal(res2.data.hello, 'world');
                    assert.equal(typeof res2, 'object');
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.media.js.map