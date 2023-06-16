"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCommitEvent = void 0;
var gatewayutils_1 = require("../gatewayutils");
var filteredblockeventfactory_1 = require("./filteredblockeventfactory");
var TransactionStatus = require("./transactionstatus");
var util = require("util");
function newCommitEvent(peer, eventInfo) {
    if (!eventInfo.transactionId || !eventInfo.status) {
        throw new Error('Invalid event info for commit event: ' + util.inspect(eventInfo));
    }
    var transactionId = eventInfo.transactionId;
    var getBlockEvent = (0, gatewayutils_1.cachedResult)(function () { return (0, filteredblockeventfactory_1.newFilteredBlockEvent)(eventInfo); });
    var getTransactionEvent = (0, gatewayutils_1.cachedResult)(function () {
        var blockEvent = getBlockEvent();
        var transactionEvent = blockEvent.getTransactionEvents().find(function (tx) { return tx.transactionId === transactionId; });
        if (!transactionEvent) {
            throw new Error("Transaction ".concat(transactionId, " does not exist in block: ").concat(util.inspect(blockEvent)));
        }
        return transactionEvent;
    });
    var commitEvent = {
        peer: peer,
        transactionId: transactionId,
        status: eventInfo.status,
        get transactionData() {
            return getTransactionEvent().transactionData;
        },
        isValid: eventInfo.status === TransactionStatus.VALID_STATUS,
        getBlockEvent: getBlockEvent,
        getContractEvents: function () { return getTransactionEvent().getContractEvents(); }
    };
    return Object.freeze(commitEvent);
}
exports.newCommitEvent = newCommitEvent;
//# sourceMappingURL=commiteventfactory.js.map