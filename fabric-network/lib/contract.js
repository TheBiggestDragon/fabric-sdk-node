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
exports.ContractImpl = void 0;
var transaction_1 = require("./transaction");
var contractlistenersession_1 = require("./impl/event/contractlistenersession");
var listenersession_1 = require("./impl/event/listenersession");
var Logger = require("./logger");
var logger = Logger.getLogger('Contract');
var util = require("util");
var gatewayutils_1 = require("./impl/gatewayutils");
/**
 * Ensure transaction name is a non-empty string.
 * @private
 * @param {string} name Transaction name.
 * @throws {Error} if the name is invalid.
 */
function verifyTransactionName(name) {
    if (typeof name !== 'string' || name.length === 0) {
        var msg = util.format('Transaction name must be a non-empty string: %j', name);
        logger.error('verifyTransactionName:', msg);
        throw new Error(msg);
    }
}
/**
 * Ensure that, if a namespace is defined, it is a non-empty string
 * @private
 * @param {string|undefined} namespace Transaction namespace.
 * @throws {Error} if the namespace is invalid.
 */
function verifyNamespace(namespace) {
    if (namespace && typeof namespace !== 'string') {
        var msg = util.format('Namespace must be a non-empty string: %j', namespace);
        logger.error('verifyNamespace:', msg);
        throw new Error(msg);
    }
}
/**
 * <p>Represents a smart contract (chaincode) instance in a network.
 * Applications should get a Contract instance using the
 * networks's [getContract]{@link module:fabric-network.Network#getContract} method.</p>
 *
 * <p>The Contract allows applications to:</p>
 * <ul>
 *   <li>Submit transactions that store state to the ledger using
 *       [submitTransaction]{@link module:fabric-network.Contract#submitTransaction}.</li>
 *   <li>Evaluate transactions that query state from the ledger using
 *       [evaluateTransaction]{@link module:fabric-network.Contract#evaluateTransaction}.</li>
 *   <li>Listen for new chaincode events and replay previous chaincode events emitted by the smart contract using
 *       [addContractListener]{@link module:fabric-network.Contract#addContractListener}.</li>
 * </ul>
 *
 * <p>If more control over transaction invocation is required, such as including transient data,
 * [createTransaction]{@link module:fabric-network.Contract#createTransaction} can be used to build a transaction
 * request that is submitted to or evaluated by the smart contract.</p>
 * @interface Contract
 * @memberof module:fabric-network
 */
/**
 * Create an object representing a specific invocation of a transaction
 * function implemented by this contract, and provides more control over
 * the transaction invocation. A new transaction object <strong>must</strong>
 * be created for each transaction invocation.
 * @method Contract#createTransaction
 * @memberof module:fabric-network
 * @param {string} name Transaction function name.
 * @returns {module:fabric-network.Transaction} A transaction object.
 */
/**
 * Deserialize a transaction from previously saved state.
 * @method Contract#deserializeTransaction
 * @memberof module:fabric-network
 * @param {Buffer} data Serialized transaction data.
 * @return {module:fabric-network.Transaction} A transaction object.
 */
/**
 * Submit a transaction to the ledger. The transaction function <code>name</code>
 * will be evaluated on the endorsing peers and then submitted to the ordering service
 * for committing to the ledger.
 * This function is equivalent to calling <code>createTransaction(name).submit()</code>.
 * @method Contract#submitTransaction
 * @memberof module:fabric-network
 * @param {string} name Transaction function name.
 * @param {...string} [args] Transaction function arguments.
 * @returns {Buffer} Payload response from the transaction function.
 * @throws {module:fabric-network.TimeoutError} If the transaction was successfully submitted to the orderer but
 * timed out before a commit event was received from peers.
 */
/**
 * Evaluate a transaction function and return its results.
 * The transaction function <code>name</code>
 * will be evaluated on the endorsing peers but the responses will not be sent to
 * the ordering service and hence will not be committed to the ledger.
 * This is used for querying the world state.
 * This function is equivalent to calling <code>createTransaction(name).evaluate()</code>.
 * @method Contract#evaluateTransaction
 * @memberof module:fabric-network
 * @param {string} name Transaction function name.
 * @param {...string} [args] Transaction function arguments.
 * @returns {Buffer} Payload response from the transaction function.
 */
/**
 * Add a listener to receive all chaincode events emitted by the smart contract as part of successfully committed
 * transactions. The default is to listen for full contract events from the current block position.
 * @method Contract#addContractListener
 * @memberof module:fabric-network
 * @param {module:fabric-network.ContractListener} listener A contract listener callback function.
 * @param {module:fabric-network.ListenerOptions} [options] Listener options.
 * @returns {Promise<module:fabric-network.ContractListener>} The added listener.
 * @example
 * const listener: ContractListener = async (event) => {
 *     if (event.eventName === 'newOrder') {
 *         const details = event.payload.toString('utf8');
 *         // Run business process to handle orders
 *     }
 * };
 * contract.addContractListener(listener);
 */
/**
 * Remove a previously added contract listener.
 * @method Contract#removeContractListener
 * @memberof module:fabric-network
 * @param {module:fabric-network.ContractListener} listener A contract listener callback function.
 */
/**
 * Provide a Discovery Interest settings to help the peer's discovery service
 * build an endorsement plan. This chaincode Id will be include by default in
 * the list of discovery interests. If this contract's chaincode is in one or
 * more collections then use this method with this chaincode Id to change the
 * default discovery interest to include those collection names.
 * @method Contract#addDiscoveryInterest
 * @memberof module:fabric-network
 * @param {DiscoveryInterest} interest - These will be added to the existing discovery interests and used when
 * {@link module:fabric-network.Transaction#submit} is called.
 * @return {Contract} This Contract instance
 */
/**
 * reset Discovery interest to default of this contracts chaincode name
 * and no collection names and no other chaincode names.
 * @method Contract#resetDiscoveryInterests
 * @memberof module:fabric-network
 * @return {Contract} This Contract instance
 */
/**
 * Retrieve the Discovery Interest settings that will help the peer's
 * discovery service build an endorsement plan.
 * @method Contract#getDiscoveryInterests
 * @memberof module:fabric-network
 * @return {DiscoveryInterest[]} - An array of DiscoveryInterest
 */
/**
 * A callback function that will be invoked when a block event is received.
 * @callback ContractListener
 * @memberof module:fabric-network
 * @async
 * @param {module:fabric-network.ContractEvent} event Contract event.
 * @returns {Promise<void>}
 */
var ContractImpl = /** @class */ (function () {
    function ContractImpl(network, chaincodeId, namespace) {
        this.contractListeners = new Map();
        var method = "constructor[".concat(namespace, "]");
        logger.debug('%s - start', method);
        verifyNamespace(namespace);
        this.network = network;
        this.chaincodeId = chaincodeId;
        this.gateway = network.getGateway();
        this.namespace = namespace;
        this.contractListeners = new Map();
        this.discoveryInterests = [{ name: chaincodeId }];
    }
    ContractImpl.prototype.createTransaction = function (name) {
        verifyTransactionName(name);
        var qualifiedName = this._getQualifiedName(name);
        var transaction = new transaction_1.Transaction(this, qualifiedName);
        return transaction;
    };
    ContractImpl.prototype.deserializeTransaction = function (data) {
        var state = JSON.parse(data.toString());
        return new transaction_1.Transaction(this, state.name, state);
    };
    ContractImpl.prototype.submitTransaction = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.createTransaction(name)).submit.apply(_a, args)];
            });
        });
    };
    ContractImpl.prototype.evaluateTransaction = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.createTransaction(name)).evaluate.apply(_a, args)];
            });
        });
    };
    ContractImpl.prototype.addContractListener = function (listener, options) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionSupplier, contractListener;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionSupplier = function () { return Promise.resolve(new contractlistenersession_1.ContractListenerSession(listener, _this.chaincodeId, _this.network, options)); };
                        return [4 /*yield*/, (0, listenersession_1.addListener)(listener, this.contractListeners, sessionSupplier)];
                    case 1:
                        contractListener = _a.sent();
                        return [2 /*return*/, contractListener];
                }
            });
        });
    };
    ContractImpl.prototype.removeContractListener = function (listener) {
        (0, listenersession_1.removeListener)(listener, this.contractListeners);
    };
    /**
     * Internal use
     * Use this method to get the DiscoveryHandler to get the endorsements
     * needed to commit a transaction.
     * The first time this method is called, this contract's DiscoveryService
     * instance will be setup.
     * The service will make a discovery request to the same
     * target as that used by the Network. The request will include this contract's
     * discovery interests. This will enable the peer's discovery
     * service to generate an endorsement plan based on the chaincode's
     * endorsement policy, the collection configuration, and the current active
     * peers.
     * Note: It is assumed that the discovery interests will not
     * change on successive calls. The handler's DiscoveryService will use the
     * "refreshAge" discovery option after the first call to determine if the
     * endorsement plan should be refreshed by a new call to the peer's
     * discovery service.
     * @private
     * @return {DiscoveryHandler} The handler that will work with the discovery
     * endorsement plan to send a proposal to be endorsed to the peers as described
     * in the plan.
     */
    ContractImpl.prototype.getDiscoveryHandler = function () {
        return __awaiter(this, void 0, void 0, function () {
            var method, service, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = "getDiscoveryHandler[".concat(this.chaincodeId, "]");
                        logger.debug('%s - start', method);
                        // Contract is only using discovery if the network is too
                        if (!this.network.discoveryService) {
                            logger.debug('%s - not using discovery - return null handler', method);
                            return [2 /*return*/, undefined];
                        }
                        // check if we have initialized this contract's discovery
                        if (!this.discoveryService) {
                            logger.debug('%s - setting up contract discovery', method);
                            this.discoveryService = this.newDiscoveryService(this.network.discoveryService.targets);
                        }
                        return [4 /*yield*/, (0, gatewayutils_1.withTimeout)(this.discoveryService, 30000, 'Timed out waiting for discovery results')];
                    case 1:
                        service = _a.sent();
                        if (!service.hasDiscoveryResults()) {
                            error = new Error('Failed to retrieve discovery results');
                            logger.error('%s - %s', method, error);
                            throw error;
                        }
                        // The handler will have access to the endorsement plan fetched
                        // by the parent DiscoveryService instance.
                        logger.debug('%s - returning a new discovery service handler', method);
                        return [2 /*return*/, service.newHandler()];
                }
            });
        });
    };
    ContractImpl.prototype.newDiscoveryService = function (targets) {
        return __awaiter(this, void 0, void 0, function () {
            var method, result, identityContext, asLocalhost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = "newDiscoveryService[".concat(this.chaincodeId, "]");
                        logger.debug('%s - start', method);
                        result = this.network.getChannel().newDiscoveryService(this.chaincodeId);
                        identityContext = this.gateway.identityContext;
                        asLocalhost = this.gateway.getOptions().discovery.asLocalhost;
                        logger.debug('%s - using discovery interest %j', method, this.discoveryInterests);
                        result.build(identityContext, { interest: this.discoveryInterests });
                        result.sign(identityContext);
                        // go get the endorsement plan from the peer's discovery service
                        // to be ready to be used by the transaction's submit
                        return [4 /*yield*/, result.send({ asLocalhost: asLocalhost, targets: targets })];
                    case 1:
                        // go get the endorsement plan from the peer's discovery service
                        // to be ready to be used by the transaction's submit
                        _a.sent();
                        logger.debug('%s - endorsement plan retrieved', method);
                        logger.debug('%s - exit', method);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ContractImpl.prototype.addDiscoveryInterest = function (interest) {
        var method = "addDiscoveryInterest[".concat(this.chaincodeId, "]");
        if (typeof interest !== 'object') {
            throw Error('"interest" parameter must be a DiscoveryInterest object');
        }
        logger.debug('%s - adding %s', method, interest);
        var existingIndex = this.discoveryInterests.findIndex(function (entry) { return entry.name === interest.name; });
        if (existingIndex >= 0) {
            this.discoveryInterests[existingIndex] = interest;
        }
        else {
            this.discoveryInterests.push(interest);
        }
        return this;
    };
    ContractImpl.prototype.resetDiscoveryInterests = function () {
        var method = "resetDiscoveryInterest[".concat(this.chaincodeId, "]");
        logger.debug('%s - start', method);
        this.discoveryInterests = [{ name: this.chaincodeId }];
        this.discoveryService = undefined;
        return this;
    };
    ContractImpl.prototype.getDiscoveryInterests = function () {
        return this.discoveryInterests;
    };
    ContractImpl.prototype._getQualifiedName = function (name) {
        return (this.namespace ? "".concat(this.namespace, ":").concat(name) : name);
    };
    return ContractImpl;
}());
exports.ContractImpl = ContractImpl;
//# sourceMappingURL=contract.js.map