"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPrivateBlockEvent = void 0;
var gatewayutils_1 = require("../gatewayutils");
var fullblockeventfactory_1 = require("./fullblockeventfactory");
var fullcontracteventfactory_1 = require("./fullcontracteventfactory");
var fulltransactioneventfactory_1 = require("./fulltransactioneventfactory");
var util = require("util");
function newPrivateBlockEvent(eventInfo) {
    var privateData = eventInfo.privateData;
    if (!privateData) {
        throw new Error('No private data found: ' + util.inspect(eventInfo));
    }
    var fullBlockEvent = (0, fullblockeventfactory_1.newFullBlockEvent)(eventInfo);
    var privateBlockEvent = {
        blockNumber: fullBlockEvent.blockNumber,
        blockData: fullBlockEvent.blockData,
        getTransactionEvents: (0, gatewayutils_1.cachedResult)(function () { return newPrivateTransactionEvents(privateBlockEvent, privateData); })
    };
    return Object.freeze(privateBlockEvent);
}
exports.newPrivateBlockEvent = newPrivateBlockEvent;
function newPrivateTransactionEvents(blockEvent, privateData) {
    return (0, fulltransactioneventfactory_1.getTransactionEnvelopeIndexes)(blockEvent.blockData)
        .map(function (index) { return newPrivateTransactionEvent(blockEvent, index, privateData[index]); });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function newPrivateTransactionEvent(blockEvent, index, privateData) {
    var fullTransactionEvent = (0, fulltransactioneventfactory_1.newFullTransactionEvent)(blockEvent, index);
    var privateTransactionEvent = {
        transactionId: fullTransactionEvent.transactionId,
        status: fullTransactionEvent.status,
        transactionData: fullTransactionEvent.transactionData,
        isValid: fullTransactionEvent.isValid,
        timestamp: fullTransactionEvent.timestamp,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        privateData: privateData,
        getBlockEvent: function () { return blockEvent; },
        getContractEvents: (0, gatewayutils_1.cachedResult)(function () { return (0, fullcontracteventfactory_1.newFullContractEvents)(privateTransactionEvent); })
    };
    return Object.freeze(privateTransactionEvent);
}
//# sourceMappingURL=privateblockeventfactory.js.map