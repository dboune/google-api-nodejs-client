"use strict";
// Copyright 2016, Google, Inc.
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
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var src_1 = require("../src");
describe('GoogleApis#discover', function () {
    it('should generate all apis', function (done) {
        var localApis = fs.readdirSync(path.join(__dirname, '../src/apis'));
        var google = new src_1.GoogleApis();
        // tslint:disable-next-line no-any
        var g2 = google;
        var localDrive = google.drive('v2');
        assert.equal(typeof google.drive, 'function');
        assert.equal(typeof localDrive, 'object');
        localApis.splice(localApis.indexOf('index.ts'), 1);
        localApis.splice(localApis.indexOf('index.d.ts'), 1);
        localApis.splice(localApis.indexOf('index.js'), 1);
        localApis.splice(localApis.indexOf('index.js.map'), 1);
        localApis.forEach(function (name) {
            assert(g2[name]);
            // Setting all APIs to null initially.
            g2[name] = null;
        });
        assert.equal(google.drive, null);
        google.discover('https://www.googleapis.com/discovery/v1/apis', function (err) {
            if (err) {
                console.warn(err);
                return done();
            }
            // APIs have all been re-added.
            localApis.forEach(function (name) {
                if (g2[name] === null) {
                    // Warn if an API remains null (was not found during the discovery
                    // process) to avoid failing the test.
                    console.warn(name + ' was not found.');
                }
                else {
                    assert(g2[name]);
                }
            });
            var remoteDrive = google.drive('v2');
            assert.equal(typeof google.drive, 'function');
            assert.equal(typeof remoteDrive, 'object');
            for (var key in localDrive) {
                if (localDrive.hasOwnProperty(key)) {
                    assert(remoteDrive[key], 'generated drive has same keys');
                }
            }
            done();
        });
    }).timeout(120000);
});
//# sourceMappingURL=test.discover.js.map