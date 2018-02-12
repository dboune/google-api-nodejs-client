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
var fs = require("fs");
var nock = require("nock");
var path = require("path");
var pify = require("pify");
var src_1 = require("../src");
var utils_1 = require("./utils");
function createNock(qs) {
    var query = qs ? "?" + qs : '';
    nock('https://datastore.googleapis.com')
        .post("/v1beta3/projects/test-project-id:lookup" + query)
        .reply(200);
}
describe('Clients', function () {
    var localPlus, remotePlus;
    var localOauth2, remoteOauth2;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var google, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nock.cleanAll();
                    google = new src_1.GoogleApis();
                    nock.enableNetConnect();
                    return [4 /*yield*/, Promise.all([
                            utils_1.Utils.loadApi(google, 'plus', 'v1'), utils_1.Utils.loadApi(google, 'oauth2', 'v2')
                        ])];
                case 1:
                    _a = _b.sent(), remotePlus = _a[0], remoteOauth2 = _a[1];
                    nock.disableNetConnect();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        nock.cleanAll();
        nock.disableNetConnect();
        var google = new src_1.GoogleApis();
        localPlus = google.plus('v1');
        localOauth2 = google.oauth2('v2');
    });
    it('should create request helpers according to resource on discovery API response', function () {
        var plus = localPlus;
        assert.equal(typeof plus.people.get, 'function');
        assert.equal(typeof plus.activities.search, 'function');
        assert.equal(typeof plus.comments.list, 'function');
        plus = remotePlus;
        assert.equal(typeof plus.people.get, 'function');
        assert.equal(typeof plus.activities.search, 'function');
        assert.equal(typeof plus.comments.list, 'function');
    });
    it('should be able to gen top level methods', function () {
        assert.equal(typeof localOauth2.tokeninfo, 'function');
        assert.equal(typeof remoteOauth2.tokeninfo, 'function');
    });
    it('should be able to gen top level methods and resources', function () {
        var oauth2 = localOauth2;
        assert.equal(typeof oauth2.tokeninfo, 'function');
        assert.equal(typeof oauth2.userinfo, 'object');
        oauth2 = remoteOauth2;
        assert.equal(typeof oauth2.tokeninfo, 'function');
        assert.equal(typeof oauth2.userinfo, 'object');
    });
    it('should be able to gen nested resources and methods', function () {
        var oauth2 = localOauth2;
        assert.equal(typeof oauth2.userinfo, 'object');
        assert.equal(typeof oauth2.userinfo.v2, 'object');
        assert.equal(typeof oauth2.userinfo.v2.me, 'object');
        assert.equal(typeof oauth2.userinfo.v2.me.get, 'function');
        oauth2 = remoteOauth2;
        assert.equal(typeof oauth2.userinfo, 'object');
        assert.equal(typeof oauth2.userinfo.v2, 'object');
        assert.equal(typeof oauth2.userinfo.v2.me, 'object');
        assert.equal(typeof oauth2.userinfo.v2.me.get, 'function');
    });
    it('should be able to require all api files without error', function () {
        function getFiles(dir, files) {
            files = files || [];
            if (typeof files === 'undefined') {
                files = [];
            }
            var files2 = fs.readdirSync(dir);
            for (var i in files2) {
                if (!files2.hasOwnProperty(i)) {
                    continue;
                }
                var name = dir + '/' + files2[i];
                if (fs.statSync(name).isDirectory()) {
                    getFiles(name, files);
                }
                else {
                    if (path.extname(name) === '.js') {
                        files.push(name);
                    }
                }
            }
            return files;
        }
        var apiFiles = getFiles(path.join(__dirname, '/../src/apis'));
        assert.doesNotThrow(function () {
            for (var i in apiFiles) {
                if (apiFiles.hasOwnProperty(i)) {
                    try {
                        require(apiFiles[i]);
                    }
                    catch (err) {
                        console.error(err);
                        throw err;
                    }
                }
            }
        });
    });
    it('should support default params', function () { return __awaiter(_this, void 0, void 0, function () {
        var google, datastore, res, query, datastore2, res2, query2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    google = new src_1.GoogleApis();
                    datastore = google.datastore({ version: 'v1beta3', params: { myParam: '123' } });
                    createNock('myParam=123');
                    return [4 /*yield*/, pify(datastore.projects.lookup)({ projectId: 'test-project-id' })];
                case 1:
                    res = _a.sent();
                    query = utils_1.Utils.getQs(res) || '';
                    assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param in query');
                    nock.enableNetConnect();
                    return [4 /*yield*/, utils_1.Utils.loadApi(google, 'datastore', 'v1beta3', { params: { myParam: '123' } })];
                case 2:
                    datastore2 = _a.sent();
                    nock.disableNetConnect();
                    createNock('myParam=123');
                    // tslint:disable-next-line no-any
                    return [4 /*yield*/, pify(datastore2.projects.lookup)({ projectId: 'test-project-id' })];
                case 3:
                    res2 = 
                    // tslint:disable-next-line no-any
                    _a.sent();
                    query2 = utils_1.Utils.getQs(res2) || '';
                    assert.notEqual(query2.indexOf('myParam=123'), -1, 'Default param in query');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow default params to be overriden per-request', function () { return __awaiter(_this, void 0, void 0, function () {
        var google, datastore, res, query, datastore2, res2, query2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    google = new src_1.GoogleApis();
                    datastore = google.datastore({ version: 'v1beta3', params: { myParam: '123' } });
                    // Override the default datasetId param for this particular API call
                    createNock('myParam=456');
                    return [4 /*yield*/, pify(datastore.projects.lookup)({ projectId: 'test-project-id', myParam: '456' })];
                case 1:
                    res = _a.sent();
                    query = utils_1.Utils.getQs(res) || '';
                    assert.notEqual(query.indexOf('myParam=456'), -1, 'Default param not found in query');
                    nock.enableNetConnect();
                    return [4 /*yield*/, utils_1.Utils.loadApi(google, 'datastore', 'v1beta3', { params: { myParam: '123' } })];
                case 2:
                    datastore2 = _a.sent();
                    nock.disableNetConnect();
                    // Override the default datasetId param for this particular API call
                    createNock('myParam=456');
                    return [4 /*yield*/, pify(datastore2.projects.lookup)({ projectId: 'test-project-id', myParam: '456' })];
                case 3:
                    res2 = _a.sent();
                    query2 = utils_1.Utils.getQs(res2) || '';
                    assert.notEqual(query2.indexOf('myParam=456'), -1, 'Default param not found in query');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should include default params when only callback is provided to API call', function () { return __awaiter(_this, void 0, void 0, function () {
        var google, datastore, res, query, datastore2, res3, query2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    google = new src_1.GoogleApis();
                    datastore = google.datastore({
                        version: 'v1beta3',
                        params: {
                            projectId: 'test-project-id',
                            // required param
                            myParam: '123'
                        }
                    });
                    // No params given - only callback
                    createNock('myParam=123');
                    return [4 /*yield*/, pify(datastore.projects.lookup)()];
                case 1:
                    res = _a.sent();
                    query = utils_1.Utils.getQs(res) || '';
                    assert.notEqual(query.indexOf('myParam=123'), -1, 'Default param not found in query');
                    nock.enableNetConnect();
                    return [4 /*yield*/, utils_1.Utils.loadApi(google, 'datastore', 'v1beta3', {
                            params: {
                                projectId: 'test-project-id',
                                // required param
                                myParam: '123'
                            }
                        })];
                case 2:
                    datastore2 = _a.sent();
                    nock.disableNetConnect();
                    // No params given - only callback
                    createNock('myParam=123');
                    return [4 /*yield*/, pify(datastore2.projects.lookup)()];
                case 3:
                    res3 = _a.sent();
                    query2 = utils_1.Utils.getQs(res3) || '';
                    assert.notEqual(query2.indexOf('myParam=123'), -1, 'Default param not found in query');
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.clients.js.map