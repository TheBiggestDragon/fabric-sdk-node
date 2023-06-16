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
exports.Wallet = void 0;
var identityproviderregistry_1 = require("./identityproviderregistry");
var encoding = 'utf8';
/**
 * Stores identity information for use when connecting a Gateway. The wallet is backed by a store that handles
 * persistence of identity information. Default implementations using various stores can be obtained using static
 * factory functions on [Wallets]{@link module:fabric-network.Wallets}.
 * @memberof module:fabric-network
 */
var Wallet = /** @class */ (function () {
    /**
     * Create a wallet instance backed by a given store. This can be used to create a wallet using your own
     * custom store implementation.
     * @param {module:fabric-network.WalletStore} store Backing store implementation.
     */
    function Wallet(store) {
        this.providerRegistry = (0, identityproviderregistry_1.newDefaultProviderRegistry)();
        this.store = store;
    }
    /**
     * Put an identity in the wallet.
     * @param {string} label Label used to identify the identity within the wallet.
     * @param {module:fabric-network.Identity} identity Identity to store in the wallet.
     * @returns {Promise<void>}
     */
    Wallet.prototype.put = function (label, identity) {
        return __awaiter(this, void 0, void 0, function () {
            var json, jsonString, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = this.providerRegistry.getProvider(identity.type).toJson(identity);
                        jsonString = JSON.stringify(json);
                        buffer = Buffer.from(jsonString, encoding);
                        return [4 /*yield*/, this.store.put(label, buffer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an identity from the wallet. The actual properties of this identity object will vary depending on its type.
     * @param label Label used to identify the identity within the wallet.
     * @returns {Promise<module:fabric-network.Identity|undefined>} An identity if it exists; otherwise undefined.
     */
    Wallet.prototype.get = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, jsonString, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.get(label)];
                    case 1:
                        buffer = _a.sent();
                        if (!buffer) {
                            return [2 /*return*/, undefined];
                        }
                        jsonString = buffer.toString(encoding);
                        json = JSON.parse(jsonString);
                        return [2 /*return*/, this.providerRegistry.getProvider(json.type).fromJson(json)];
                }
            });
        });
    };
    /**
     * Get the labels of all identities in the wallet.
     * @returns {Promise<string[]>} Identity labels.
     */
    Wallet.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.list()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Remove an identity from the wallet.
     * @param label Label used to identify the identity within the wallet.
     * @returns {Promise<void>}
     */
    Wallet.prototype.remove = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.remove(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the identity provider registry for this wallet. All identity types stored in the wallet must have a
     * corresponding provider in the registry.
     * @returns {module:fabric-network.IdentityProviderRegistry} An identity provider registry.
     */
    Wallet.prototype.getProviderRegistry = function () {
        return this.providerRegistry;
    };
    return Wallet;
}());
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map