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
exports.TransactionEventHandler = void 0;
var timeouterror_1 = require("../../errors/timeouterror");
var transactionerror_1 = require("../../errors/transactionerror");
var Logger = require("../../logger");
var logger = Logger.getLogger('TransactionEventHandler');
/**
 * Handles events for a given transaction. Used to wait for a submitted transaction to be successfully commited to
 * the ledger.
 * Delegates to an event strategy to decide whether events or errors received should be interpreted as success or
 * failure of a transaction.
 * @private
 */
var TransactionEventHandler = /** @class */ (function () {
    /**
     * Constructor.
     * @private
     * @param {Transaction} transaction - Transaction object.
     * @param {Object} strategy - Event strategy implementation.
     * @param {TransactionOptions} [options] Additional options.
     */
    function TransactionEventHandler(transactionId, network, strategy) {
        var _this = this;
        this.listener = this.eventCallback.bind(this);
        this.strategySuccessCallback = this.strategySuccess.bind(this);
        this.strategyFailCallback = this.strategyFail.bind(this);
        var method = 'constructor';
        this.transactionId = transactionId;
        this.network = network;
        this.strategy = strategy;
        var defaultOptions = {
            commitTimeout: 30
        };
        this.options = Object.assign(defaultOptions, network.getGateway().getOptions().eventHandlerOptions);
        logger.debug('%s: transactionId = %s, options = %j', method, this.transactionId, this.options);
        this.peers = strategy.getPeers();
        this.unrespondedPeers = new Set(this.peers);
        this.notificationPromise = new Promise(function (resolve) {
            _this.resolveNotificationPromise = resolve;
        });
    }
    /**
     * Called to initiate listening for transaction events.
     */
    TransactionEventHandler.prototype.startListening = function () {
        return __awaiter(this, void 0, void 0, function () {
            var method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = 'startListening';
                        if (!(this.peers && this.peers.length > 0)) return [3 /*break*/, 2];
                        logger.debug('%s - have eventService list - start monitoring', method);
                        this.setListenTimeout();
                        return [4 /*yield*/, this.network.addCommitListener(this.listener, this.peers, this.transactionId)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        logger.error('%s - No event services', method);
                        // shutdown the monitoring
                        this.resolveNotificationPromise();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wait until enough events have been received from the event services to satisfy the event handling strategy.
     * @throws {Error} if the transaction commit is not successful within the timeout period.
     */
    TransactionEventHandler.prototype.waitForEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug('waitForEvents start');
                        return [4 /*yield*/, this.notificationPromise];
                    case 1:
                        err = _a.sent();
                        if (err) {
                            throw err;
                        }
                        logger.debug('waitForEvents end');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancel listening for events.
     */
    TransactionEventHandler.prototype.cancelListening = function () {
        logger.debug('cancelListening called');
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }
        this.network.removeCommitListener(this.listener);
    };
    TransactionEventHandler.prototype.eventCallback = function (error, event) {
        if (event && !event.isValid) {
            var message = "Commit of transaction ".concat(this.transactionId, " failed on peer ").concat(event.peer.name, " with status ").concat(event.status);
            this.strategyFail(new transactionerror_1.TransactionError({
                message: message,
                transactionId: event.transactionId,
                transactionCode: event.status
            }));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var peer = (error === null || error === void 0 ? void 0 : error.peer) || event.peer;
        if (!this.unrespondedPeers.delete(peer)) {
            // Already seen a response from this peer
            return;
        }
        if (error) {
            this.strategy.errorReceived(this.strategySuccessCallback, this.strategyFailCallback);
        }
        else {
            this.strategy.eventReceived(this.strategySuccessCallback, this.strategyFailCallback);
        }
    };
    TransactionEventHandler.prototype.setListenTimeout = function () {
        var _this = this;
        var method = 'setListenTimeout';
        if (typeof this.options.commitTimeout !== 'number' || this.options.commitTimeout <= 0) {
            logger.debug('%s - no commit timeout', method);
            return;
        }
        logger.debug('%s setTimeout(%s) in seconds for transaction %s', method, this.options.commitTimeout, this.transactionId);
        this.timeoutHandler = setTimeout(function () {
            _this.timeoutFail();
            logger.error('%s - event handler timed out', method);
        }, this.options.commitTimeout * 1000);
        logger.debug('%s - end', method);
    };
    TransactionEventHandler.prototype.timeoutFail = function () {
        var unrespondedPeerNames = Array.from(this.unrespondedPeers)
            .map(function (peer) { return peer.name; })
            .join(', ');
        var errorInfo = {
            message: "Event strategy not satisfied within the timeout period of ".concat(String(this.options.commitTimeout), " seconds. No response received from peers:  ").concat(unrespondedPeerNames),
            transactionId: this.transactionId
        };
        var error = new timeouterror_1.TimeoutError(errorInfo);
        this.strategyFail(error);
    };
    /**
     * Callback for the strategy to indicate successful commit of the transaction.
     * @private
     */
    TransactionEventHandler.prototype.strategySuccess = function () {
        logger.debug('strategySuccess: commit success for transaction %j', this.transactionId);
        this.cancelListening();
        this.resolveNotificationPromise();
    };
    /**
     * Callback for the strategy to indicate failure of the transaction commit.
     * @private
     * @param {Error} error Reason for failure.
     */
    TransactionEventHandler.prototype.strategyFail = function (error) {
        logger.warn('strategyFail: commit failure for transaction %j: %s', this.transactionId, error);
        this.cancelListening();
        this.resolveNotificationPromise(error);
    };
    return TransactionEventHandler;
}());
exports.TransactionEventHandler = TransactionEventHandler;
//# sourceMappingURL=transactioneventhandler.js.map