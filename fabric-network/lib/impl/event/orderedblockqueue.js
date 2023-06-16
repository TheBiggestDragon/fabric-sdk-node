"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedBlockQueue = void 0;
var Long = require("long");
var OrderedBlockQueue = /** @class */ (function () {
    function OrderedBlockQueue(startBlock) {
        this.queue = new Map();
        this.nextBlockNumber = startBlock;
    }
    OrderedBlockQueue.prototype.addBlock = function (event) {
        var blockNumber = event.blockNumber;
        if (!this.isNewBlockNumber(blockNumber)) {
            return;
        }
        var key = this.blockNumberToKey(blockNumber);
        this.queue.set(key, event);
        if (!this.nextBlockNumber) {
            this.nextBlockNumber = blockNumber;
        }
    };
    OrderedBlockQueue.prototype.getNextBlock = function () {
        if (!this.nextBlockNumber) {
            return;
        }
        var key = this.blockNumberToKey(this.nextBlockNumber);
        var event = this.queue.get(key);
        if (event) {
            this.queue.delete(key);
            this.nextBlockNumber = this.nextBlockNumber.add(Long.ONE);
        }
        return event;
    };
    OrderedBlockQueue.prototype.getNextBlockNumber = function () {
        return this.nextBlockNumber;
    };
    OrderedBlockQueue.prototype.size = function () {
        return this.queue.size;
    };
    OrderedBlockQueue.prototype.isNewBlockNumber = function (blockNumber) {
        return !this.nextBlockNumber || this.nextBlockNumber.lessThanOrEqual(blockNumber);
    };
    OrderedBlockQueue.prototype.blockNumberToKey = function (blockNumber) {
        return blockNumber.toString();
    };
    return OrderedBlockQueue;
}());
exports.OrderedBlockQueue = OrderedBlockQueue;
//# sourceMappingURL=orderedblockqueue.js.map