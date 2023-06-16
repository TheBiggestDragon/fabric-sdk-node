"use strict";
/*
 * Copyright 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.X509Provider = void 0;
var fabric_common_1 = require("fabric-common");
var X509Provider = /** @class */ (function () {
    function X509Provider() {
        this.type = 'X.509';
        this.cryptoSuite = fabric_common_1.User.newCryptoSuite();
    }
    X509Provider.prototype.getCryptoSuite = function () {
        return this.cryptoSuite;
    };
    X509Provider.prototype.fromJson = function (data) {
        if (data.type !== this.type) {
            throw new Error('Invalid identity type: ' + data.type);
        }
        if (data.version === 1) {
            var x509Data = data;
            return {
                credentials: {
                    certificate: x509Data.credentials.certificate,
                    privateKey: x509Data.credentials.privateKey,
                },
                mspId: x509Data.mspId,
                type: 'X.509',
            };
        }
        else {
            throw new Error("Unsupported identity version: ".concat(data.version));
        }
    };
    X509Provider.prototype.toJson = function (identity) {
        var data = {
            credentials: {
                certificate: identity.credentials.certificate,
                privateKey: identity.credentials.privateKey,
            },
            mspId: identity.mspId,
            type: 'X.509',
            version: 1,
        };
        return data;
    };
    X509Provider.prototype.getUserContext = function (identity, name) {
        return __awaiter(this, void 0, void 0, function () {
            var user, importedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!identity) {
                            throw Error('X.509 identity is missing');
                        }
                        else if (!identity.credentials) {
                            throw Error('X.509 identity is missing the credential data.');
                        }
                        else if (!identity.credentials.privateKey) {
                            throw Error('X.509 identity data is missing the private key.');
                        }
                        user = new fabric_common_1.User(name);
                        user.setCryptoSuite(this.cryptoSuite);
                        importedKey = this.cryptoSuite.createKeyFromRaw(identity.credentials.privateKey.toString());
                        return [4 /*yield*/, user.setEnrollment(importedKey, identity.credentials.certificate.toString(), identity.mspId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return X509Provider;
}());
exports.X509Provider = X509Provider;
//# sourceMappingURL=x509identity.js.map