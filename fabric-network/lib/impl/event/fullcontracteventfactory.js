"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFullContractEvents = void 0;
function newFullContractEvents(transactionEvent) {
    var transactionActions = transactionEvent.transactionData.actions || [];
    return transactionActions.map(function (transactionAction) {
        // payload is defined as 'bytes' in the protobuf.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment
        var payload = transactionAction.payload;
        // payload has been decoded by fabric-common event service before being stored as TransactionEvent
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        var chaincodeEvent = payload.action.proposal_response_payload.extension.events;
        return newFullContractEvent(transactionEvent, chaincodeEvent);
    });
}
exports.newFullContractEvents = newFullContractEvents;
function newFullContractEvent(transactionEvent, chaincodeEvent) {
    var contractEvent = {
        chaincodeId: chaincodeEvent.chaincode_id,
        eventName: chaincodeEvent.event_name,
        payload: chaincodeEvent.payload,
        getTransactionEvent: function () { return transactionEvent; }
    };
    return Object.freeze(contractEvent);
}
//# sourceMappingURL=fullcontracteventfactory.js.map