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
exports.blockFromContractListener = exports.checkpointBlockListener = void 0;
var GatewayUtils = require("../gatewayutils");
var Logger = require("../../logger");
var logger = Logger.getLogger('Listener');
function checkpointBlockListener(listener, checkpointer) {
    var _this = this;
    return function (blockEvent) { return __awaiter(_this, void 0, void 0, function () {
        var checkpointBlockNumber, nextBlockNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkpointer.getBlockNumber()];
                case 1:
                    checkpointBlockNumber = _a.sent();
                    if (!(!checkpointBlockNumber || checkpointBlockNumber.equals(blockEvent.blockNumber))) return [3 /*break*/, 4];
                    return [4 /*yield*/, listener(blockEvent)];
                case 2:
                    _a.sent();
                    nextBlockNumber = blockEvent.blockNumber.add(1);
                    return [4 /*yield*/, checkpointer.setBlockNumber(nextBlockNumber)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
exports.checkpointBlockListener = checkpointBlockListener;
function blockFromContractListener(listener, checkpointer) {
    if (checkpointer) {
        var transactionListener = transactionFromContractListener(listener);
        var checkpointTxListener = checkpointTransactionListener(transactionListener, checkpointer);
        var blockListener = blockFromTransactionListener(checkpointTxListener);
        return checkpointBlockListener(blockListener, checkpointer);
    }
    else {
        var transactionListener = transactionFromContractListener(listener);
        return blockFromTransactionListener(transactionListener);
    }
}
exports.blockFromContractListener = blockFromContractListener;
function transactionFromContractListener(listener) {
    var _this = this;
    return function (transactionEvent) { return __awaiter(_this, void 0, void 0, function () {
        var _i, _a, contractEvent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = transactionEvent.getContractEvents();
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    contractEvent = _a[_i];
                    return [4 /*yield*/, listener(contractEvent)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
function checkpointTransactionListener(listener, checkpointer) {
    var _this = this;
    return function (transactionEvent) { return __awaiter(_this, void 0, void 0, function () {
        var checkpointTransactionIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkpointer.getTransactionIds()];
                case 1:
                    checkpointTransactionIds = _a.sent();
                    if (!!checkpointTransactionIds.has(transactionEvent.transactionId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, listener(transactionEvent)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, checkpointer.addTransactionId(transactionEvent.transactionId)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
function blockFromTransactionListener(listener) {
    var _this = this;
    return function (blockEvent) { return __awaiter(_this, void 0, void 0, function () {
        var transactionPromises, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionPromises = blockEvent.getTransactionEvents()
                        .filter(function (transactionEvent) { return transactionEvent.isValid; })
                        .map(function (transactionEvent) { return listener(transactionEvent); });
                    return [4 /*yield*/, GatewayUtils.allSettled(transactionPromises)];
                case 1:
                    results = _a.sent();
                    logAndThrowErrors(results);
                    return [2 /*return*/];
            }
        });
    }); };
}
function logAndThrowErrors(results) {
    var errors = results
        .filter(function (result) { return result.status === 'rejected'; })
        .map(function (result) { return result.reason; });
    if (errors.length > 0) {
        errors.forEach(function (error) { return logger.warn('Error notifying transaction listener', error); });
        throw new Error("Error notifying listener: ".concat(errors[0].stack || errors[0].message));
    }
}
//# sourceMappingURL=listeners.js.map