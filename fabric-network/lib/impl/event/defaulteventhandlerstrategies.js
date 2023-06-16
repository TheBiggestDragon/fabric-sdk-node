"use strict";
/*
 * Copyright 2018, 2019 IBM All Rights Reserved.
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
exports.NONE = exports.PREFER_MSPID_SCOPE_ANYFORTX = exports.PREFER_MSPID_SCOPE_ALLFORTX = exports.NETWORK_SCOPE_ANYFORTX = exports.NETWORK_SCOPE_ALLFORTX = exports.MSPID_SCOPE_ANYFORTX = exports.MSPID_SCOPE_ALLFORTX = void 0;
var allfortxstrategy_1 = require("./allfortxstrategy");
var anyfortxstrategy_1 = require("./anyfortxstrategy");
var transactioneventhandler_1 = require("./transactioneventhandler");
function getOrganizationPeers(network) {
    var mspId = network.getGateway().getIdentity().mspId;
    return network.getChannel().getEndorsers(mspId);
}
function getNetworkPeers(network) {
    return network.getChannel().getEndorsers();
}
/**
 * @typedef DefaultEventHandlerStrategies
 * @memberof module:fabric-network
 * @property {module:fabric-network.TxEventHandlerFactory} MSPID_SCOPE_ALLFORTX Listen for transaction commit
 * events from all peers in the client identity's organization. If the client identity's organization has no peers,
 * this strategy will fail.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until successful
 * events are received from <em>all</em> currently connected peers (minimum 1).
 * @property {module:fabric-network.TxEventHandlerFactory} MSPID_SCOPE_ANYFORTX Listen for transaction commit
 * events from all peers in the client identity's organization. If the client identity's organization has no peers,
 * this strategy will fail.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until a successful
 * event is received from <em>any</em> peer.
 * @property {module:fabric-network.TxEventHandlerFactory} NETWORK_SCOPE_ALLFORTX Listen for transaction commit
 * events from all peers in the network.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until successful
 * events are received from <em>all</em> currently connected peers (minimum 1).
 * @property {module:fabric-network.TxEventHandlerFactory} NETWORK_SCOPE_ANYFORTX Listen for transaction commit
 * events from all peers in the network.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until a
 * successful event is received from <em>any</em> peer.
 * @property {module:fabric-network.TxEventHandlerFactory} PREFER_MSPID_SCOPE_ALLFORTX Listen for transaction commit
 * events from all peers in the client identity's organization. If the client identity's organization has no peers, listen
 * for transaction commit events from all peers in the network.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until successful
 * events are received from <em>all</em> currently connected peers (minimum 1).
 * @property {module:fabric-network.TxEventHandlerFactory} PREFER_MSPID_SCOPE_ANYFORTX Listen for transaction commit
 * events from all peers in the client identity's organization. If the client identity's organization has no peers, listen
 * for transaction commit events from all peers in the network.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will wait until a
 * successful event is received from <em>any</em> peer.
 * @property {module:fabric-network.TxEventHandlerFactory} NONE Do not wait for any commit events.
 * The [submitTransaction]{@link module:fabric-network.Contract#submitTransaction} function will return immediately
 * after successfully sending the transaction to the orderer.
 */
var MSPID_SCOPE_ALLFORTX = function (transactionId, network) {
    var eventStrategy = new allfortxstrategy_1.AllForTxStrategy(getOrganizationPeers(network));
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.MSPID_SCOPE_ALLFORTX = MSPID_SCOPE_ALLFORTX;
var MSPID_SCOPE_ANYFORTX = function (transactionId, network) {
    var eventStrategy = new anyfortxstrategy_1.AnyForTxStrategy(getOrganizationPeers(network));
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.MSPID_SCOPE_ANYFORTX = MSPID_SCOPE_ANYFORTX;
var NETWORK_SCOPE_ALLFORTX = function (transactionId, network) {
    var eventStrategy = new allfortxstrategy_1.AllForTxStrategy(getNetworkPeers(network));
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.NETWORK_SCOPE_ALLFORTX = NETWORK_SCOPE_ALLFORTX;
var NETWORK_SCOPE_ANYFORTX = function (transactionId, network) {
    var eventStrategy = new anyfortxstrategy_1.AnyForTxStrategy(getNetworkPeers(network));
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.NETWORK_SCOPE_ANYFORTX = NETWORK_SCOPE_ANYFORTX;
var PREFER_MSPID_SCOPE_ALLFORTX = function (transactionId, network) {
    var peers = getOrganizationPeers(network);
    if (peers.length === 0) {
        peers = getNetworkPeers(network);
    }
    var eventStrategy = new allfortxstrategy_1.AllForTxStrategy(peers);
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.PREFER_MSPID_SCOPE_ALLFORTX = PREFER_MSPID_SCOPE_ALLFORTX;
var PREFER_MSPID_SCOPE_ANYFORTX = function (transactionId, network) {
    var peers = getOrganizationPeers(network);
    if (peers.length === 0) {
        peers = getNetworkPeers(network);
    }
    var eventStrategy = new anyfortxstrategy_1.AnyForTxStrategy(peers);
    return new transactioneventhandler_1.TransactionEventHandler(transactionId, network, eventStrategy);
};
exports.PREFER_MSPID_SCOPE_ANYFORTX = PREFER_MSPID_SCOPE_ANYFORTX;
var noOpEventHandler = {
    startListening: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); },
    waitForEvents: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); },
    cancelListening: function () {
        // No-op
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var NONE = function (transactionId, network) {
    return noOpEventHandler;
};
exports.NONE = NONE;
//# sourceMappingURL=defaulteventhandlerstrategies.js.map