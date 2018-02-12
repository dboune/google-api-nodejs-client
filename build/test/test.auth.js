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
var googleapis = new src_1.GoogleApis();
describe('JWT client', function () {
    it('should expose the default auth module', function () {
        assert(googleapis.auth.getApplicationDefault);
    });
    it('should create a jwt through googleapis', function () {
        var jwt = new googleapis.auth.JWT('someone@somewhere.com', 'file1', 'key1', 'scope1', 'subject1');
        assert.equal(jwt.email, 'someone@somewhere.com');
        assert.equal(jwt.keyFile, 'file1');
        assert.equal(jwt.key, 'key1');
        assert.equal(jwt.scopes, 'scope1');
        assert.equal(jwt.subject, 'subject1');
    });
    it('should create scoped JWT', function () {
        var jwt = new googleapis.auth.JWT('someone@somewhere.com', 'file1', 'key1', undefined, 'subject1');
        assert.equal(jwt.scopes, null);
        assert.equal(jwt.createScopedRequired(), true);
        // Create a scoped version of the token now.
        var jwt2 = jwt.createScoped('scope1');
        // The original token should be unchanged.
        assert.equal(jwt.scopes, null);
        assert.equal(jwt.createScopedRequired(), true);
        // The new token should have scopes.
        assert.equal(jwt2.scopes, 'scope1');
        assert.equal(jwt2.createScopedRequired(), false);
    });
});
describe('Compute client', function () {
    it('should create a computeclient', function () {
        var compute = new googleapis.auth.Compute();
        assert.equal(compute.createScopedRequired(), false);
    });
});
function testNoTokens(urlshortener, oauth2client) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, pify(urlshortener.url.get)({ shortUrl: '123', auth: oauth2client })];
                case 1:
                    _a.sent();
                    assert.fail('expected to throw');
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    assert.equal(e_1.message, 'No access, refresh token or API key is set.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testNoBearer(urlshortener, oauth2client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pify(urlshortener.url.list)({ auth: oauth2client })];
                case 1:
                    _a.sent();
                    assert.equal(oauth2client.credentials.token_type, 'Bearer');
                    return [2 /*return*/];
            }
        });
    });
}
function testExpired(drive, oauth2client, now) {
    return __awaiter(this, void 0, void 0, function () {
        var expiryDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
                    return [4 /*yield*/, pify(drive.files.get)({ fileId: 'wat', auth: oauth2client })];
                case 1:
                    _a.sent();
                    expiryDate = oauth2client.credentials.expiry_date;
                    assert.notEqual(expiryDate, undefined);
                    if (!expiryDate)
                        return [2 /*return*/];
                    assert(expiryDate > now);
                    assert(expiryDate < now + 5000);
                    assert.equal(oauth2client.credentials.refresh_token, 'abc');
                    assert.equal(oauth2client.credentials.access_token, 'abc123');
                    return [2 /*return*/];
            }
        });
    });
}
function testNoAccessToken(drive, oauth2client, now) {
    return __awaiter(this, void 0, void 0, function () {
        var expiryDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
                    return [4 /*yield*/, pify(drive.files.get)({ fileId: 'wat', auth: oauth2client })];
                case 1:
                    _a.sent();
                    expiryDate = oauth2client.credentials.expiry_date;
                    assert.notEqual(expiryDate, undefined);
                    assert(expiryDate > now);
                    assert(expiryDate < now + 4000);
                    assert.equal(oauth2client.credentials.refresh_token, 'abc');
                    assert.equal(oauth2client.credentials.access_token, 'abc123');
                    return [2 /*return*/];
            }
        });
    });
}
describe('OAuth2 client', function () {
    var localDrive, remoteDrive;
    var localUrlshortener, remoteUrlshortener;
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
        localDrive = google.drive('v2');
        localUrlshortener = google.urlshortener('v1');
    });
    var CLIENT_ID = 'CLIENT_ID';
    var CLIENT_SECRET = 'CLIENT_SECRET';
    var REDIRECT_URI = 'REDIRECT';
    it('should return err if no access or refresh token is set', function () { return __awaiter(_this, void 0, void 0, function () {
        var oauth2client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    return [4 /*yield*/, testNoTokens(localUrlshortener, oauth2client)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testNoTokens(remoteUrlshortener, oauth2client)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not error if only refresh token is set', function () {
        var oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oauth2client.credentials = { refresh_token: 'refresh_token' };
        assert.doesNotThrow(function () {
            var options = { auth: oauth2client, shortUrl: '...' };
            localUrlshortener.url.get(options, utils_1.Utils.noop);
            remoteUrlshortener.url.get(options, utils_1.Utils.noop);
        });
    });
    it('should set access token type to Bearer if none is set', function () { return __awaiter(_this, void 0, void 0, function () {
        var oauth2client, scope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    oauth2client.credentials = { access_token: 'foo', refresh_token: '' };
                    scope = nock(utils_1.Utils.baseUrl)
                        .get('/urlshortener/v1/url/history')
                        .times(2)
                        .reply(200);
                    return [4 /*yield*/, testNoBearer(localUrlshortener, oauth2client)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testNoBearer(remoteUrlshortener, oauth2client)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should refresh if access token is expired', function () { return __awaiter(_this, void 0, void 0, function () {
        var scope, oauth2client, now, twoSecondsAgo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scope = nock('https://www.googleapis.com')
                        .post('/oauth2/v4/token')
                        .times(2)
                        .reply(200, { access_token: 'abc123', expires_in: 1 });
                    oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    now = new Date().getTime();
                    twoSecondsAgo = now - 2000;
                    oauth2client.credentials = {
                        refresh_token: 'abc',
                        expiry_date: twoSecondsAgo
                    };
                    return [4 /*yield*/, testExpired(localDrive, oauth2client, now)];
                case 1:
                    _a.sent();
                    oauth2client =
                        new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    now = new Date().getTime();
                    twoSecondsAgo = now - 2000;
                    oauth2client.credentials = {
                        refresh_token: 'abc',
                        expiry_date: twoSecondsAgo
                    };
                    return [4 /*yield*/, testExpired(remoteDrive, oauth2client, now)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should make request if access token not expired', function () { return __awaiter(_this, void 0, void 0, function () {
        var scope, oauth2client, now, tenMinutesFromNow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scope = nock('https://www.googleapis.com')
                        .post('/oauth2/v4/token')
                        .times(2)
                        .reply(200, { access_token: 'abc123', expires_in: 10000 });
                    oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    now = (new Date()).getTime();
                    tenMinutesFromNow = now + 1000 * 60 * 10;
                    oauth2client.credentials = {
                        access_token: 'abc123',
                        refresh_token: 'abc',
                        expiry_date: tenMinutesFromNow
                    };
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
                    return [4 /*yield*/, pify(localDrive.files.get)({ fileId: 'wat', auth: oauth2client })];
                case 1:
                    _a.sent();
                    console.log("Creds: " + JSON.stringify(oauth2client.credentials));
                    assert.equal(JSON.stringify(oauth2client.credentials), JSON.stringify({
                        access_token: 'abc123',
                        refresh_token: 'abc',
                        expiry_date: tenMinutesFromNow,
                        token_type: 'Bearer'
                    }));
                    assert.throws(function () {
                        scope.done();
                    }, 'AssertionError');
                    oauth2client =
                        new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    now = (new Date()).getTime();
                    tenMinutesFromNow = now + 1000 * 60 * 10;
                    oauth2client.credentials = {
                        access_token: 'abc123',
                        refresh_token: 'abc',
                        expiry_date: tenMinutesFromNow
                    };
                    nock(utils_1.Utils.baseUrl).get('/drive/v2/files/wat').reply(200);
                    return [4 /*yield*/, pify(remoteDrive.files.get)({ fileId: 'wat', auth: oauth2client })];
                case 2:
                    _a.sent();
                    assert.equal(JSON.stringify(oauth2client.credentials), JSON.stringify({
                        access_token: 'abc123',
                        refresh_token: 'abc',
                        expiry_date: tenMinutesFromNow,
                        token_type: 'Bearer'
                    }));
                    assert.throws(function () {
                        scope.done();
                    }, 'AssertionError');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should refresh if have refresh token but no access token', function () { return __awaiter(_this, void 0, void 0, function () {
        var scope, oauth2client, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scope = nock('https://www.googleapis.com')
                        .post('/oauth2/v4/token')
                        .times(2)
                        .reply(200, { access_token: 'abc123', expires_in: 1 });
                    oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                    now = (new Date()).getTime();
                    oauth2client.credentials = { refresh_token: 'abc' };
                    return [4 /*yield*/, testNoAccessToken(localDrive, oauth2client, now)];
                case 1:
                    _a.sent();
                    now = (new Date()).getTime();
                    oauth2client.credentials = { refresh_token: 'abc' };
                    return [4 /*yield*/, testNoAccessToken(remoteDrive, oauth2client, now)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('revokeCredentials()', function () {
        it('should revoke credentials if access token present', function () { return __awaiter(_this, void 0, void 0, function () {
            var scope, oauth2client, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scope = nock('https://accounts.google.com')
                            .get('/o/oauth2/revoke?token=abc')
                            .reply(200, { success: true });
                        oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                        oauth2client.credentials = { access_token: 'abc', refresh_token: 'abc' };
                        return [4 /*yield*/, oauth2client.revokeCredentials()];
                    case 1:
                        res = _a.sent();
                        assert.equal(res.data.success, true);
                        assert.equal(JSON.stringify(oauth2client.credentials), '{}');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear credentials and return error if no access token to revoke', function () { return __awaiter(_this, void 0, void 0, function () {
            var oauth2client, res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                        oauth2client.credentials = { refresh_token: 'abc' };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, oauth2client.revokeCredentials()];
                    case 2:
                        res = _a.sent();
                        assert.fail('Expected to throw');
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        assert.equal(e_2, 'Error: No access token to revoke.');
                        return [3 /*break*/, 4];
                    case 4:
                        assert.equal(JSON.stringify(oauth2client.credentials), '{}');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getToken()', function () {
        it('should return expiry_date', function () { return __awaiter(_this, void 0, void 0, function () {
            var now, scope, oauth2client, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = (new Date()).getTime();
                        scope = nock('https://www.googleapis.com')
                            .post('/oauth2/v4/token')
                            .reply(200, { access_token: 'abc', refresh_token: '123', expires_in: 10 });
                        oauth2client = new googleapis.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
                        return [4 /*yield*/, oauth2client.getToken('code here')];
                    case 1:
                        res = _a.sent();
                        assert(res.tokens.expiry_date >= now + (10 * 1000));
                        assert(res.tokens.expiry_date <= now + (15 * 1000));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    after(function () {
        nock.cleanAll();
        nock.enableNetConnect();
    });
});
//# sourceMappingURL=test.auth.js.map