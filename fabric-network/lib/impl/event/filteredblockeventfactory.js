"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFilteredBlockEvent = void 0;
var gatewayutils_1 = require("../gatewayutils");
var TransactionStatus = require("./transactionstatus");
var util = require("util");
function newFilteredBlockEvent(eventInfo) {
    if (!eventInfo.filteredBlock) {
        throw new Error('No block data found: ' + util.inspect(eventInfo));
    }
    var blockEvent = {
        blockNumber: eventInfo.blockNumber,
        blockData: eventInfo.filteredBlock,
        getTransactionEvents: (0, gatewayutils_1.cachedResult)(function () { return newFilteredTransactionEvents(blockEvent); })
    };
    return Object.freeze(blockEvent);
}
exports.newFilteredBlockEvent = newFilteredBlockEvent;
function newFilteredTransactionEvents(blockEvent) {
    var filteredTransactions = blockEvent.blockData.filtered_transactions || [];
    return filteredTransactions.map(function (tx) { return newFilteredTransactionEvent(blockEvent, tx); });
}
function newFilteredTransactionEvent(blockEvent, filteredTransaction) {
    var status = TransactionStatus.getStatusForCode(filteredTransaction.tx_validation_code);
    var transactionEvent = {
        transactionId: filteredTransaction.txid,
        status: status,
        transactionData: filteredTransaction,
        isValid: status === TransactionStatus.VALID_STATUS,
        getBlockEvent: function () { return blockEvent; },
        getContractEvents: (0, gatewayutils_1.cachedResult)(function () { return newFilteredContractEvents(transactionEvent); })
    };
    return Object.freeze(transactionEvent);
}
function newFilteredContractEvents(transactionEvent) {
    var _a;
    var chaincodeActions = ((_a = transactionEvent.transactionData.transaction_actions) === null || _a === void 0 ? void 0 : _a.chaincode_actions) || [];
    return chaincodeActions.map(function (ccAction) { return newFilteredContractEvent(transactionEvent, ccAction.chaincode_event); });
}
function newFilteredContractEvent(transactionEvent, chaincodeEvent) {
    var contractEvent = {
        chaincodeId: chaincodeEvent.chaincode_id,
        eventName: chaincodeEvent.event_name,
        getTransactionEvent: function () { return transactionEvent; }
    };
    return Object.freeze(contractEvent);
}
//# sourceMappingURL=filteredblockeventfactory.js.map