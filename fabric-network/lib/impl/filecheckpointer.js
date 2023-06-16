"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
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
exports.FileCheckpointer = void 0;
var Long = require("long");
var fs = require("fs");
var encoding = 'utf8';
var FileCheckpointer = /** @class */ (function () {
    function FileCheckpointer(path) {
        this.transactionIds = new Set();
        this.path = path;
    }
    FileCheckpointer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.addTransactionId = function (transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.transactionIds.add(transactionId);
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.getBlockNumber = function () {
        return Promise.resolve(this.blockNumber);
    };
    FileCheckpointer.prototype.getTransactionIds = function () {
        return Promise.resolve(this.transactionIds);
    };
    FileCheckpointer.prototype.setBlockNumber = function (blockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.blockNumber = blockNumber;
                        this.transactionIds.clear();
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, json, state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readFile()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            json = data.toString(encoding);
                            state = JSON.parse(json);
                            this.setState(state);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.readFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.promises.readFile(this.path)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.setState = function (state) {
        this.blockNumber = state.blockNumber ? Long.fromString(state.blockNumber) : undefined;
        this.transactionIds = new Set(state.transactionIds);
    };
    FileCheckpointer.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, json, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.getState();
                        json = JSON.stringify(state);
                        data = Buffer.from(json, encoding);
                        return [4 /*yield*/, fs.promises.writeFile(this.path, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileCheckpointer.prototype.getState = function () {
        var _a;
        return {
            blockNumber: (_a = this.blockNumber) === null || _a === void 0 ? void 0 : _a.toString(),
            transactionIds: Array.from(this.transactionIds)
        };
    };
    return FileCheckpointer;
}());
exports.FileCheckpointer = FileCheckpointer;
//# sourceMappingURL=filecheckpointer.js.map