"use strict";
/*
 * Copyright 2018, 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
exports.Transaction = void 0;
var util = require("util");
var EventHandlers = require("./impl/event/defaulteventhandlerstrategies");
var gatewayutils_1 = require("./impl/gatewayutils");
var query_1 = require("./impl/query/query");
var Logger = require("./logger");
var logger = Logger.getLogger('Transaction');
function getResponsePayload(proposalResponse) {
    var validEndorsementResponse = getValidEndorsementResponse(proposalResponse.responses);
    if (!validEndorsementResponse) {
        var error = newEndorsementError(proposalResponse);
        logger.error('%s', error);
        throw error;
    }
    var payload = (0, gatewayutils_1.getTransactionResponse)(validEndorsementResponse).payload;
    return (0, gatewayutils_1.asBuffer)(payload);
}
function getValidEndorsementResponse(endorsementResponses) {
    return endorsementResponses.find(function (endorsementResponse) { return endorsementResponse.endorsement; });
}
function newEndorsementError(proposalResponse) {
    var _a, _b;
    var errorInfos = [];
    for (var _i = 0, _c = proposalResponse.errors; _i < _c.length; _i++) {
        var error = _c[_i];
        var errorInfo = {
            peer: (_a = error === null || error === void 0 ? void 0 : error.connection) === null || _a === void 0 ? void 0 : _a.name,
            status: 'grpc',
            message: error.message
        };
        errorInfos.push(errorInfo);
    }
    for (var _d = 0, _e = proposalResponse.responses; _d < _e.length; _d++) {
        var endorsement = _e[_d];
        var errorInfo = {
            peer: (_b = endorsement === null || endorsement === void 0 ? void 0 : endorsement.connection) === null || _b === void 0 ? void 0 : _b.name,
            status: endorsement.response.status,
            message: endorsement.response.message
        };
        errorInfos.push(errorInfo);
    }
    var messages = ['No valid responses from any peers. Errors:'];
    for (var _f = 0, errorInfos_1 = errorInfos; _f < errorInfos_1.length; _f++) {
        var errorInfo = errorInfos_1[_f];
        messages.push(util.format('peer=%s, status=%s, message=%s', errorInfo.peer, errorInfo.status, errorInfo.message));
    }
    return new Error(messages.join('\n    '));
}
function isInteger(value) {
    return Number.isInteger(value);
}
/**
 * Represents a specific invocation of a transaction function, and provides
 * flexibility over how that transaction is invoked. Applications should
 * obtain instances of this class by calling
 * [Contract#createTransaction()]{@link module:fabric-network.Contract#createTransaction}.
 * <br><br>
 * Instances of this class are stateful. A new instance <strong>must</strong>
 * be created for each transaction invocation.
 * @memberof module:fabric-network
 * @hideconstructor
 */
var Transaction = /** @class */ (function () {
    /**
     * Transaction instances should be obtained only by calling
     * [Contract.createTransaction()]{@link module:fabric-network.Contract#createTransaction}. This constructor should
     * not be used directly.
     */
    function Transaction(contract, name, state) {
        var _a;
        var method = "constructor[".concat(name, "]");
        logger.debug('%s - start', method);
        this.name = name;
        this.contract = contract;
        this.gatewayOptions = contract.gateway.getOptions();
        this.eventHandlerStrategyFactory = this.gatewayOptions.eventHandlerOptions.strategy || EventHandlers.NONE;
        this.queryHandler = contract.network.queryHandler;
        if (!state) {
            // Store the returned copy to prevent state being modified by other code before it is used to send proposals
            this.identityContext = contract.gateway.identityContext.calculateTransactionId();
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.identityContext = contract.gateway.identityContext.clone({
                nonce: Buffer.from(state.nonce, 'base64'),
                transactionId: state.transactionId,
            });
            this.endorsingOrgs = state.endorsingOrgs;
            this.endorsingPeers = (_a = state.endorsingPeers) === null || _a === void 0 ? void 0 : _a.map(function (peerName) { return contract.network.getChannel().getEndorser(peerName); }).filter(function (endorser) { return endorser !== undefined; });
            if (state.transientData) {
                this.transientMap = {};
                for (var _i = 0, _b = Object.entries(state.transientData); _i < _b.length; _i++) {
                    var _c = _b[_i], key = _c[0], value = _c[1];
                    this.transientMap[key] = Buffer.from(value, 'base64');
                }
            }
        }
    }
    /**
     * Get the fully qualified name of the transaction function.
     * @returns {string} Transaction name.
     */
    Transaction.prototype.getName = function () {
        return this.name;
    };
    /**
     * Set transient data that will be passed to the transaction function
     * but will not be stored on the ledger. This can be used to pass
     * private data to a transaction function.
     * @param {Object} transientMap Object with String property names and
     * Buffer property values.
     * @returns {module:fabric-network.Transaction} This object, to allow function chaining.
     */
    Transaction.prototype.setTransient = function (transientMap) {
        var method = "setTransient[".concat(this.name, "]");
        logger.debug('%s - start', method);
        this.transientMap = transientMap;
        return this;
    };
    /**
     * Get the ID that will be used for this transaction invocation.
     * @returns {string} A transaction ID.
     */
    Transaction.prototype.getTransactionId = function () {
        return this.identityContext.transactionId;
    };
    /**
     * Set the peers that should be used for endorsement when this transaction
     * is submitted to the ledger.
     * Setting the peers will override the use of discovery and the submit will
     * send the proposal to these peers.
     * This will override the setEndorsingOrganizations if previously called.
     * @param {Endorser[]} peers - Endorsing peers.
     * @returns {module:fabric-network.Transaction} This object, to allow function chaining.
     */
    Transaction.prototype.setEndorsingPeers = function (peers) {
        var method = "setEndorsingPeers[".concat(this.name, "]");
        logger.debug('%s - start', method);
        this.endorsingPeers = peers;
        this.endorsingOrgs = undefined;
        return this;
    };
    /**
     * Set the organizations that should be used for endorsement when this
     * transaction is submitted to the ledger.
     * Peers that are in the organizations will be used for the endorsement.
     * This will override the setEndorsingPeers if previously called. Setting
     * the endorsing organizations will not override discovery, however it will
     * filter the peers provided by discovery to be those in these organizatons.
     * @param {string[]} orgs - Endorsing organizations.
     * @returns {module:fabric-network.Transaction} This object, to allow function chaining.
     */
    Transaction.prototype.setEndorsingOrganizations = function () {
        var orgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            orgs[_i] = arguments[_i];
        }
        var method = "setEndorsingOrganizations[".concat(this.name, "]");
        logger.debug('%s - start', method);
        this.endorsingOrgs = orgs;
        this.endorsingPeers = undefined;
        return this;
    };
    /**
     * Set an event handling strategy to use for this transaction instead of the default configured on the gateway.
     * @param strategy An event handling strategy.
     * @returns {module:fabric-network.Transaction} This object, to allow function chaining.
     */
    Transaction.prototype.setEventHandler = function (strategy) {
        this.eventHandlerStrategyFactory = strategy;
        return this;
    };
    /**
     * Submit a transaction to the ledger. The transaction function <code>name</code>
     * will be evaluated on the endorsing peers and then submitted to the ordering service
     * for committing to the ledger.
     * @async
     * @param {...string} [args] Transaction function arguments.
     * @returns {Buffer} Payload response from the transaction function.
     * @throws {module:fabric-network.TimeoutError} If the transaction was successfully submitted to the orderer but
     * timed out before a commit event was received from peers.
     * @throws {module:fabric-network.TransactionError} If the transaction committed with an unsuccessful transaction
     * validation code, and so did not update the ledger.
     */
    Transaction.prototype.submit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var method, channel, transactionOptions, endorsement, proposalBuildRequest, proposalSendRequest, _a, flatten, proposalResponse, result, eventHandler, commit, commitSendRequest, commitResponse, msg, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        method = "submit[".concat(this.name, "]");
                        logger.debug('%s - start', method);
                        channel = this.contract.network.getChannel();
                        transactionOptions = this.gatewayOptions.eventHandlerOptions;
                        endorsement = channel.newEndorsement(this.contract.chaincodeId);
                        proposalBuildRequest = this.newBuildProposalRequest(args);
                        logger.debug('%s - build and send the endorsement', method);
                        // build the outbound request along with getting a new transactionId
                        // from the identity context
                        endorsement.build(this.identityContext, proposalBuildRequest);
                        endorsement.sign(this.identityContext);
                        proposalSendRequest = {};
                        if (isInteger(transactionOptions.endorseTimeout)) {
                            proposalSendRequest.requestTimeout = transactionOptions.endorseTimeout * 1000; // in ms;
                        }
                        if (!this.endorsingPeers) return [3 /*break*/, 1];
                        logger.debug('%s - user has assigned targets', method);
                        proposalSendRequest.targets = this.endorsingPeers;
                        return [3 /*break*/, 4];
                    case 1:
                        if (!this.contract.network.discoveryService) return [3 /*break*/, 3];
                        logger.debug('%s - discovery handler will be used for endorsing', method);
                        _a = proposalSendRequest;
                        return [4 /*yield*/, this.contract.getDiscoveryHandler()];
                    case 2:
                        _a.handler = _b.sent();
                        if (this.endorsingOrgs) {
                            logger.debug('%s - using discovery and user has assigned endorsing orgs %s', method, this.endorsingOrgs);
                            proposalSendRequest.requiredOrgs = this.endorsingOrgs;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (this.endorsingOrgs) {
                            logger.debug('%s - user has assigned endorsing orgs %s', method, this.endorsingOrgs);
                            flatten = function (accumulator, value) {
                                accumulator.push.apply(accumulator, value);
                                return accumulator;
                            };
                            proposalSendRequest.targets = this.endorsingOrgs.map(function (mspid) { return channel.getEndorsers(mspid); }).reduce(flatten, []);
                        }
                        else {
                            logger.debug('%s - targets will default to all that are assigned to this channel', method);
                            proposalSendRequest.targets = channel.getEndorsers();
                        }
                        _b.label = 4;
                    case 4: return [4 /*yield*/, endorsement.send(proposalSendRequest)];
                    case 5:
                        proposalResponse = _b.sent();
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 10, , 11]);
                        result = getResponsePayload(proposalResponse);
                        eventHandler = this.eventHandlerStrategyFactory(endorsement.getTransactionId(), this.contract.network);
                        return [4 /*yield*/, eventHandler.startListening()];
                    case 7:
                        _b.sent();
                        commit = endorsement.newCommit();
                        commit.build(this.identityContext);
                        commit.sign(this.identityContext);
                        commitSendRequest = {};
                        if (isInteger(transactionOptions.commitTimeout)) {
                            commitSendRequest.requestTimeout = transactionOptions.commitTimeout * 1000; // in ms;
                        }
                        if (proposalSendRequest.handler) {
                            logger.debug('%s - use discovery to commit', method);
                            commitSendRequest.handler = proposalSendRequest.handler;
                        }
                        else {
                            logger.debug('%s - use the orderers assigned to the channel', method);
                            commitSendRequest.targets = channel.getCommitters();
                        }
                        return [4 /*yield*/, commit.send(commitSendRequest)];
                    case 8:
                        commitResponse = _b.sent();
                        logger.debug('%s - commit response %j', method, commitResponse);
                        if (commitResponse.status !== 'SUCCESS') {
                            msg = "Failed to commit transaction %".concat(endorsement.getTransactionId(), ", orderer response status: ").concat(commitResponse.status);
                            logger.error('%s - %s', method, msg);
                            eventHandler.cancelListening();
                            throw new Error(msg);
                        }
                        else {
                            logger.debug('%s - successful commit', method);
                        }
                        logger.debug('%s - wait for the transaction to be committed on the peer', method);
                        return [4 /*yield*/, eventHandler.waitForEvents()];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, result];
                    case 10:
                        err_1 = _b.sent();
                        err_1.responses = proposalResponse.responses;
                        err_1.errors = proposalResponse.errors;
                        throw err_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Evaluate a transaction function and return its results.
     * The transaction function will be evaluated on the endorsing peers but
     * the responses will not be sent to the ordering service and hence will
     * not be committed to the ledger.
     * This is used for querying the world state.
     * @async
     * @param {...string} [args] Transaction function arguments.
     * @returns {Promise<Buffer>} Payload response from the transaction function.
     */
    Transaction.prototype.evaluate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var method, queryProposal, request, query, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = "evaluate[".concat(this.name, "]");
                        logger.debug('%s - start', method);
                        queryProposal = this.contract.network.getChannel().newQuery(this.contract.chaincodeId);
                        request = this.newBuildProposalRequest(args);
                        logger.debug('%s - build and sign the query', method);
                        queryProposal.build(this.identityContext, request);
                        queryProposal.sign(this.identityContext);
                        query = new query_1.QueryImpl(queryProposal, this.gatewayOptions.queryHandlerOptions);
                        logger.debug('%s - handler will send', method);
                        return [4 /*yield*/, this.queryHandler.evaluate(query)];
                    case 1:
                        results = _a.sent();
                        logger.debug('%s - queryHandler completed', method);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Extract the state of this transaction in a form that can be reconstructed using
     * [Contract#deserializeTransaction()]{@link module:fabric-network.Contract#deserializeTransaction}. This allows a
     * transaction to persisted, and then reconstructed and resubmitted following a client application restart. There is
     * no guarantee of compatibility for the serialized data between different versions of this package.
     * @returns {Buffer} A serialized transaction.
     */
    Transaction.prototype.serialize = function () {
        var _a;
        var state = {
            name: this.name,
            nonce: this.identityContext.nonce.toString('base64'),
            transactionId: this.identityContext.transactionId,
            endorsingOrgs: this.endorsingOrgs,
            endorsingPeers: (_a = this.endorsingPeers) === null || _a === void 0 ? void 0 : _a.map(function (endorser) { return endorser.name; }),
        };
        if (this.transientMap) {
            state.transientData = {};
            for (var _i = 0, _b = Object.entries(this.transientMap); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], value = _c[1];
                state.transientData[key] = value.toString('base64');
            }
        }
        var json = JSON.stringify(state);
        return Buffer.from(json);
    };
    Transaction.prototype.newBuildProposalRequest = function (args) {
        var request = {
            fcn: this.name,
            args: args,
            generateTransactionId: false
        };
        if (this.transientMap) {
            request.transientMap = this.transientMap;
        }
        return request;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map