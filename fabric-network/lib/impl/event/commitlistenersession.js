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
exports.CommitListenerSession = void 0;
var Logger = require("../../logger");
var commiteventfactory_1 = require("./commiteventfactory");
var logger = Logger.getLogger('CommitListenerSession');
var CommitListenerSession = /** @class */ (function () {
    function CommitListenerSession(listener, eventServiceManager, endorsers, transactionId) {
        this.endorsers = {};
        this.eventListeners = [];
        this.listener = listener;
        this.eventServiceManager = eventServiceManager;
        this.eventServices = endorsers.map(function (endorser) { return eventServiceManager.getCommitEventService(endorser); });
        this.transactionId = transactionId;
        for (var _i = 0, endorsers_1 = endorsers; _i < endorsers_1.length; _i++) {
            var endorser = endorsers_1[_i];
            this.endorsers[endorser.name] = endorser;
        }
    }
    CommitListenerSession.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startErrors, _i, startErrors_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.registerTransactionListeners()];
                    case 1:
                        startErrors = _a.sent();
                        // Notify listeners of errors after all registrations are complete so listeners can remove themselves in response
                        for (_i = 0, startErrors_1 = startErrors; _i < startErrors_1.length; _i++) {
                            error = startErrors_1[_i];
                            this.listener(error, undefined);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CommitListenerSession.prototype.close = function () {
        for (var _i = 0, _a = this.eventListeners; _i < _a.length; _i++) {
            var eventListener = _a[_i];
            eventListener.unregisterEventListener();
        }
    };
    CommitListenerSession.prototype.registerTransactionListeners = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startErrors, _i, _a, eventService, error, eventListener;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        startErrors = [];
                        _i = 0, _a = this.eventServices;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        eventService = _a[_i];
                        return [4 /*yield*/, this.startEventService(eventService)];
                    case 2:
                        error = _b.sent();
                        if (error) {
                            startErrors.push(error);
                        }
                        else {
                            eventListener = this.registerTransactionListener(eventService);
                            this.eventListeners.push(eventListener);
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, startErrors];
                }
            });
        });
    };
    CommitListenerSession.prototype.startEventService = function (eventService) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, commitError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.eventServiceManager.startEventService(eventService)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        commitError = error_1;
                        commitError.peer = this.getEndorserForEventService(eventService);
                        return [2 /*return*/, commitError];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CommitListenerSession.prototype.getEndorserForEventService = function (eventService) {
        return this.endorsers[eventService.name];
    };
    CommitListenerSession.prototype.registerTransactionListener = function (eventService) {
        var _this = this;
        var peer = this.getEndorserForEventService(eventService);
        var callback = function (error, event) {
            var commitError = error ? Object.assign(error, { peer: peer }) : undefined;
            var commitEvent = event ? (0, commiteventfactory_1.newCommitEvent)(peer, event) : undefined;
            _this.notifyListener(commitError, commitEvent);
        };
        var registrationOptions = {
            unregister: false
        };
        return eventService.registerTransactionListener(this.transactionId, callback, registrationOptions);
    };
    CommitListenerSession.prototype.notifyListener = function (commitError, commitEvent) {
        try {
            this.listener(commitError, commitEvent);
        }
        catch (error) {
            logger.warn('Error notifying listener:', error);
        }
    };
    return CommitListenerSession;
}());
exports.CommitListenerSession = CommitListenerSession;
//# sourceMappingURL=commitlistenersession.js.map