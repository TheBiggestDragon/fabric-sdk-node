"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFullBlockEvent = void 0;
var gatewayutils_1 = require("../gatewayutils");
var fulltransactioneventfactory_1 = require("./fulltransactioneventfactory");
var util = require("util");
function newFullBlockEvent(eventInfo) {
    if (!eventInfo.block) {
        throw new Error('No block data found: ' + util.inspect(eventInfo));
    }
    var blockEvent = {
        blockNumber: eventInfo.blockNumber,
        blockData: eventInfo.block,
        getTransactionEvents: (0, gatewayutils_1.cachedResult)(function () { return newFullTransactionEvents(blockEvent); })
    };
    return Object.freeze(blockEvent);
}
exports.newFullBlockEvent = newFullBlockEvent;
function newFullTransactionEvents(blockEvent) {
    return (0, fulltransactioneventfactory_1.getTransactionEnvelopeIndexes)(blockEvent.blockData)
        .map(function (index) { return (0, fulltransactioneventfactory_1.newFullTransactionEvent)(blockEvent, index); });
}
//# sourceMappingURL=fullblockeventfactory.js.map