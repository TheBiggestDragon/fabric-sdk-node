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
exports.BlockEventSource = void 0;
var Logger = require("../../logger");
var GatewayUtils = require("../gatewayutils");
var asyncnotifier_1 = require("./asyncnotifier");
var filteredblockeventfactory_1 = require("./filteredblockeventfactory");
var fullblockeventfactory_1 = require("./fullblockeventfactory");
var orderedblockqueue_1 = require("./orderedblockqueue");
var privateblockeventfactory_1 = require("./privateblockeventfactory");
var gatewayutils_1 = require("../gatewayutils");
var Long = require("long");
var logger = Logger.getLogger('BlockEventSource');
var defaultBlockType = 'filtered';
function newBlockQueue(options) {
    var startBlock = asLong(options.startBlock);
    return new orderedblockqueue_1.OrderedBlockQueue(startBlock);
}
function asLong(value) {
    if ((0, gatewayutils_1.notNullish)(value)) {
        return Long.fromValue(value);
    }
    return undefined;
}
var BlockEventSource = /** @class */ (function () {
    function BlockEventSource(eventServiceManager, options) {
        if (options === void 0) { options = {}; }
        this.listeners = new Set();
        this.state = 'ready';
        this.eventServiceManager = eventServiceManager;
        this.blockQueue = newBlockQueue(options);
        this.asyncNotifier = new asyncnotifier_1.AsyncNotifier(this.blockQueue.getNextBlock.bind(this.blockQueue), this.notifyListeners.bind(this));
        this.blockType = options.type || defaultBlockType;
        logger.debug('constructor - blockType:%s', this.blockType);
    }
    BlockEventSource.prototype.addBlockListener = function (listener) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.listeners.add(listener);
                        return [4 /*yield*/, this.start()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, listener];
                }
            });
        });
    };
    BlockEventSource.prototype.removeBlockListener = function (listener) {
        this.listeners.delete(listener);
    };
    BlockEventSource.prototype.setState = function (state) {
        if (this.state !== 'stopped') {
            this.state = state;
        }
    };
    BlockEventSource.prototype.close = function () {
        this.setState('stopped');
        logger.debug('state set to  - :%s', this.state);
        this._close();
    };
    BlockEventSource.prototype._close = function () {
        var _a;
        this.unregisterListener();
        (_a = this.eventService) === null || _a === void 0 ? void 0 : _a.close();
        this.setState('ready');
        logger.debug('state set to  - :%s', this.state);
        if (this.restart) {
            clearImmediate(this.restart);
        }
    };
    BlockEventSource.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug('state - :%s', this.state);
                        if (this.state !== 'ready') {
                            return [2 /*return*/];
                        }
                        this.state = 'started';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.eventService = this.eventServiceManager.newDefaultEventService();
                        this.registerListener(); // Register before start so no events are missed
                        logger.debug('start - calling startEventService');
                        return [4 /*yield*/, this.startEventService()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger.error('Failed to start event service', error_1);
                        this._close();
                        this.restart = setImmediate(function () {
                            void _this.start();
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BlockEventSource.prototype.registerListener = function () {
        var callback = this.blockEventCallback.bind(this);
        var options = {
            startBlock: this.getNextBlockNumber(),
            unregister: false
        };
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.eventListener = this.eventService.registerBlockListener(callback, options);
    };
    BlockEventSource.prototype.unregisterListener = function () {
        var _a;
        try {
            (_a = this.eventListener) === null || _a === void 0 ? void 0 : _a.unregisterEventListener();
        }
        catch (error) {
            logger.warn('Failed to unregister listener', error);
        }
    };
    BlockEventSource.prototype.startEventService = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startBlock, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startBlock = this.getNextBlockNumber();
                        if (startBlock) {
                            startBlock = startBlock.subtract(Long.ONE);
                            if (startBlock.isNegative()) {
                                startBlock = Long.ZERO;
                            }
                        }
                        options = {
                            blockType: this.blockType,
                            startBlock: startBlock
                        };
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        return [4 /*yield*/, this.eventServiceManager.startEventService(this.eventService, options)];
                    case 1:
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BlockEventSource.prototype.blockEventCallback = function (error, event) {
        var _this = this;
        if (error) {
            this._close();
            this.restart = setImmediate(function () {
                void _this.start();
            }); // Must schedule after current event loop to avoid recursion in event service notification
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.onBlockEvent(event);
        }
    };
    BlockEventSource.prototype.onBlockEvent = function (eventInfo) {
        var blockEvent = this.newBlockEvent(eventInfo);
        this.blockQueue.addBlock(blockEvent);
        if (this.blockQueue.size() > 0) {
            this.asyncNotifier.notify();
        }
    };
    BlockEventSource.prototype.newBlockEvent = function (eventInfo) {
        if (this.blockType === 'filtered') {
            return (0, filteredblockeventfactory_1.newFilteredBlockEvent)(eventInfo);
        }
        else if (this.blockType === 'full') {
            return (0, fullblockeventfactory_1.newFullBlockEvent)(eventInfo);
        }
        else if (this.blockType === 'private') {
            return (0, privateblockeventfactory_1.newPrivateBlockEvent)(eventInfo);
        }
        else {
            throw new Error("Unsupported event type: ".concat(this.blockType));
        }
    };
    BlockEventSource.prototype.notifyListeners = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results, _i, results_1, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = Array.from(this.listeners).map(function (listener) { return listener(event); });
                        return [4 /*yield*/, GatewayUtils.allSettled(promises)];
                    case 1:
                        results = _a.sent();
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            result = results_1[_i];
                            if (result.status === 'rejected') {
                                logger.warn('Error notifying listener', result.reason);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BlockEventSource.prototype.getNextBlockNumber = function () {
        return this.blockQueue.getNextBlockNumber();
    };
    return BlockEventSource;
}());
exports.BlockEventSource = BlockEventSource;
//# sourceMappingURL=blockeventsource.js.map