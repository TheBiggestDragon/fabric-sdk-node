"use strict";
/*
 * Copyright 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEventStrategy = void 0;
var Logger = require("../../logger");
var logger = Logger.getLogger('TransactionEventStrategy');
/**
 * Event handling strategy base class that keeps counts of success and fail events to allow
 * subclasses to implement concrete event handling strategies. On each success or fail event,
 * the checkCompletion() function is called, which must be implemented by
 * subclasses.
 *
 * Instances of the strategy are stateful and must only be used for a single transaction.
 * @private
 * @class
 */
var TransactionEventStrategy = /** @class */ (function () {
    /**
     * Constructor.
     * @param {Endorser[]} peers - Peers for which to process events.
     */
    function TransactionEventStrategy(peers) {
        if (!peers || !Array.isArray(peers) || peers.length < 1) {
            var message = 'No peers for strategy';
            logger.error('constructor:', message);
            throw new Error(message);
        }
        this.peers = peers;
        this.counts = {
            success: 0,
            fail: 0,
            expected: peers.length
        };
    }
    /**
     * Called by event handler to obtain the peers to which it should listen.
     * @returns {Endorser[]} Peers.
     */
    TransactionEventStrategy.prototype.getPeers = function () {
        return this.peers;
    };
    /**
     * Called when an event is received.
     * @param {Function} successFn Callback function to invoke if this event satisfies the strategy.
     * @param {Function} failFn Callback function to invoke if this event fails the strategy.
     */
    TransactionEventStrategy.prototype.eventReceived = function (successFn, failFn) {
        this.counts.success++;
        this.checkCompletion(this.counts, successFn, failFn);
    };
    /**
     * Called when an error is received.
     * @param {Function} successFn Callback function to invoke if this error satisfies the strategy.
     * @param {Function} failFn Callback function to invoke if this error fails the strategy.
     */
    TransactionEventStrategy.prototype.errorReceived = function (successFn, failFn) {
        this.counts.fail++;
        this.checkCompletion(this.counts, successFn, failFn);
    };
    return TransactionEventStrategy;
}());
exports.TransactionEventStrategy = TransactionEventStrategy;
//# sourceMappingURL=transactioneventstrategy.js.map