"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFullTransactionEvent = exports.getTransactionEnvelopeIndexes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
var fabproto6 = require("fabric-protos");
var gatewayutils_1 = require("../gatewayutils");
var fullcontracteventfactory_1 = require("./fullcontracteventfactory");
var TransactionStatus = require("./transactionstatus");
function getTransactionEnvelopeIndexes(blockData) {
    var txEnvelopeIndexes = [];
    if (blockData.data) {
        var envelopes = blockData.data.data || [];
        envelopes.forEach(function (envelope, index) {
            if (isTransactionPayload(envelope.payload)) {
                txEnvelopeIndexes.push(index);
            }
        });
    }
    return txEnvelopeIndexes;
}
exports.getTransactionEnvelopeIndexes = getTransactionEnvelopeIndexes;
function isTransactionPayload(payload) {
    return payload.header.channel_header.type === fabproto6.common.HeaderType.ENDORSER_TRANSACTION;
}
function newFullTransactionEvent(blockEvent, txEnvelopeIndex) {
    var block = blockEvent.blockData;
    if (block.metadata && block.data && block.data.data) {
        var blockMetadata = block.metadata.metadata || [];
        var transactionStatusCodes = blockMetadata[fabproto6.common.BlockMetadataIndex.TRANSACTIONS_FILTER];
        var envelope = block.data.data[txEnvelopeIndex];
        var transactionId = envelope.payload.header.channel_header.tx_id;
        var timestamp = new Date(envelope.payload.header.channel_header.timestamp);
        var code = transactionStatusCodes[txEnvelopeIndex];
        var status_1 = TransactionStatus.getStatusForCode(code);
        var transactionEvent_1 = {
            transactionId: transactionId,
            status: status_1,
            transactionData: envelope.payload.data,
            isValid: status_1 === TransactionStatus.VALID_STATUS,
            timestamp: timestamp,
            getBlockEvent: function () { return blockEvent; },
            getContractEvents: (0, gatewayutils_1.cachedResult)(function () { return (0, fullcontracteventfactory_1.newFullContractEvents)(transactionEvent_1); })
        };
        return Object.freeze(transactionEvent_1);
    }
    throw Error('Missing transaction data');
}
exports.newFullTransactionEvent = newFullTransactionEvent;
//# sourceMappingURL=fulltransactioneventfactory.js.map