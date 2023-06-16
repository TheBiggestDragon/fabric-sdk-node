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
exports.NetworkImpl = void 0;
var contract_1 = require("./contract");
var blockeventsource_1 = require("./impl/event/blockeventsource");
var commitlistenersession_1 = require("./impl/event/commitlistenersession");
var eventservicemanager_1 = require("./impl/event/eventservicemanager");
var isolatedblocklistenersession_1 = require("./impl/event/isolatedblocklistenersession");
var listeners_1 = require("./impl/event/listeners");
var listenersession_1 = require("./impl/event/listenersession");
var sharedblocklistenersession_1 = require("./impl/event/sharedblocklistenersession");
var gatewayutils_1 = require("./impl/gatewayutils");
var Logger = require("./logger");
var logger = Logger.getLogger('Network');
function listenerOptionsWithDefaults(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var defaultOptions, result, checkpointBlock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaultOptions = {
                        type: 'full'
                    };
                    result = Object.assign(defaultOptions, options);
                    return [4 /*yield*/, ((_a = options.checkpointer) === null || _a === void 0 ? void 0 : _a.getBlockNumber())];
                case 1:
                    checkpointBlock = _b.sent();
                    if (checkpointBlock) {
                        result.startBlock = checkpointBlock;
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * <p>A Network represents the set of peers in a Fabric network.
 * Applications should get a Network instance using the
 * gateway's [getNetwork]{@link module:fabric-network.Gateway#getNetwork} method.</p>
 *
 * <p>The Network object provides the ability for applications to:</p>
 * <ul>
 *   <li>Obtain a specific smart contract deployed to the network using [getContract]{@link module:fabric-network.Network#getContract},
 *       in order to submit and evaluate transactions for that smart contract.</li>
 *   <li>Listen to new block events and replay previous block events using
 *       [addBlockListener]{@link module:fabric-network.Network#addBlockListener}.</li>
 * </ul>
 * @interface Network
 * @memberof module:fabric-network
 */
/**
 * Get the owning Gateway connection.
 * @method Network#getGateway
 * @memberof module:fabric-network
 * @returns {module:fabric-network.Gateway} A Gateway.
 */
/**
 * Get an instance of a contract (chaincode) on the current network.
 * @method Network#getContract
 * @memberof module:fabric-network
 * @param {string} chaincodeId - the chaincode identifier.
 * @param {string} [name] - the name of the contract.
 * @param {string[]} [collections] - the names of collections defined for this chaincode.
 * @returns {module:fabric-network.Contract} the contract.
 */
/**
 * Get the underlying channel object representation of this network.
 * @method Network#getChannel
 * @memberof module:fabric-network
 * @returns {Channel} A channel.
 */
/**
 * Add a listener to receive transaction commit and peer disconnect events for a set of peers. This is typically used
 * only within the implementation of a custom [transaction commit event handler]{@tutorial transaction-commit-events}.
 * @method Network#addCommitListener
 * @memberof module:fabric-network
 * @param {module:fabric-network.CommitListener} listener A transaction commit listener callback function.
 * @param {Endorser[]} peers The peers from which to receive events.
 * @param {string} transactionId A transaction ID.
 * @returns {module:fabric-network.CommitListener} The added listener.
 * @example
 * const listener: CommitListener = (error, event) => {
 *     if (error) {
 *         // Handle peer communication error
 *     } else {
 *         // Handle transaction commit event
 *     }
 * }
 * const peers = network.channel.getEndorsers();
 * await network.addCommitListener(listener, peers, transactionId);
 */
/**
 * Remove a previously added transaction commit listener.
 * @method Network#removeCommitListener
 * @memberof module:fabric-network
 * @param {module:fabric-network.CommitListener} listener A transaction commit listener callback function.
 */
/**
 * Add a listener to receive block events for this network. Blocks will be received in order and without duplication.
 * The default is to listen for full block events from the current block position.
 * @method Network#addBlockListener
 * @memberof module:fabric-network
 * @async
 * @param {module:fabric-network.BlockListener} listener A block listener callback function.
 * @param {module:fabric-network.ListenerOptions} [options] Listener options.
 * @returns {Promise<module:fabric-network.BlockListener>} The added listener.
 * @example
 * const listener: BlockListener = async (event) => {
 *     // Handle block event
 *
 *     // Listener may remove itself if desired
 *     if (event.blockNumber.equals(endBlock)) {
 *         network.removeBlockListener(listener);
 *     }
 * }
 * const options: ListenerOptions = {
 *     startBlock: 1
 * };
 * await network.addBlockListener(listener, options);
 */
/**
 * Remove a previously added block listener.
 * @method Network#removeBlockListener
 * @memberof module:fabric-network
 * @param listener {module:fabric-network.BlockListener} A block listener callback function.
 */
/**
 * A callback function that will be invoked when a block event is received.
 * @callback BlockListener
 * @memberof module:fabric-network
 * @async
 * @param {module:fabric-network.BlockEvent} event A block event.
 * @returns {Promise<void>}
 */
/**
 * A callback function that will be invoked when either a peer communication error occurs or a transaction commit event
 * is received. Only one of the two arguments will have a value for any given invocation.
 * @callback CommitListener
 * @memberof module:fabric-network
 * @param {module:fabric-network.CommitError} [error] Peer communication error.
 * @param {module:fabric-network.CommitEvent} [event] Transaction commit event from a specific peer.
 */
/**
 * @interface CommitError
 * @extends Error
 * @memberof module:fabric-network
 * @property {Endorser} peer The peer that raised this error.
 */
/**
 * @interface CommitEvent
 * @extends {module:fabric-network.TransactionEvent}
 * @memberof module:fabric-network
 * @property {Endorser} peer The endorsing peer that produced this event.
 */
var NetworkImpl = /** @class */ (function () {
    /*
     * Network constructor for internal use only.
     * @param {Gateway} gateway The owning gateway instance
     * @param {Channel} channel The fabric-common channel instance
     */
    function NetworkImpl(gateway, channel) {
        this.contracts = new Map();
        this.initialized = false;
        this.commitListeners = new Map();
        this.blockListeners = new Map();
        var method = 'constructor';
        logger.debug('%s - start', method);
        this.gateway = gateway;
        this.channel = channel;
        this.eventServiceManager = new eventservicemanager_1.EventServiceManager(this);
        this.realtimeFilteredBlockEventSource = new blockeventsource_1.BlockEventSource(this.eventServiceManager, { type: 'filtered' });
        this.realtimeFullBlockEventSource = new blockeventsource_1.BlockEventSource(this.eventServiceManager, { type: 'full' });
        this.realtimePrivateBlockEventSource = new blockeventsource_1.BlockEventSource(this.eventServiceManager, { type: 'private' });
    }
    NetworkImpl.prototype.getGateway = function () {
        return this.gateway;
    };
    NetworkImpl.prototype.getContract = function (chaincodeId, name) {
        if (name === void 0) { name = ''; }
        var method = 'getContract';
        logger.debug('%s - start - name %s', method, name);
        if (!this.initialized) {
            throw new Error('Unable to get contract as this network has failed to initialize');
        }
        var key = "".concat(chaincodeId, ":").concat(name);
        var contract = this.contracts.get(key);
        if (!contract) {
            contract = new contract_1.ContractImpl(this, chaincodeId, name);
            logger.debug('%s - create new contract %s', method, chaincodeId);
            this.contracts.set(key, contract);
        }
        return contract;
    };
    NetworkImpl.prototype.getChannel = function () {
        return this.channel;
    };
    NetworkImpl.prototype.addCommitListener = function (listener, peers, transactionId) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionSupplier;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionSupplier = function () { return Promise.resolve(new commitlistenersession_1.CommitListenerSession(listener, _this.eventServiceManager, peers, transactionId)); };
                        return [4 /*yield*/, (0, listenersession_1.addListener)(listener, this.commitListeners, sessionSupplier)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NetworkImpl.prototype.removeCommitListener = function (listener) {
        (0, listenersession_1.removeListener)(listener, this.commitListeners);
    };
    NetworkImpl.prototype.addBlockListener = function (listener, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var sessionSupplier;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionSupplier = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.newBlockListenerSession(listener, options)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); };
                        return [4 /*yield*/, (0, listenersession_1.addListener)(listener, this.blockListeners, sessionSupplier)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NetworkImpl.prototype.removeBlockListener = function (listener) {
        (0, listenersession_1.removeListener)(listener, this.blockListeners);
    };
    NetworkImpl.prototype._dispose = function () {
        var method = '_dispose';
        logger.debug('%s - start', method);
        this.contracts.clear();
        this.commitListeners.forEach(function (listener) { return listener.close(); });
        this.commitListeners.clear();
        this.blockListeners.forEach(function (listener) { return listener.close(); });
        this.blockListeners.clear();
        this.realtimeFilteredBlockEventSource.close();
        this.realtimeFullBlockEventSource.close();
        this.realtimePrivateBlockEventSource.close();
        this.eventServiceManager.close();
        this.channel.close();
        this.initialized = false;
    };
    /**
     * Initialize this network instance
     * @private
     */
    NetworkImpl.prototype._initialize = function (discover) {
        return __awaiter(this, void 0, void 0, function () {
            var method, queryOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = '_initialize';
                        logger.debug('%s - start', method);
                        if (this.initialized) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this._initializeInternalChannel(discover)];
                    case 1:
                        _a.sent();
                        this.initialized = true;
                        queryOptions = this.gateway.getOptions().queryHandlerOptions;
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.queryHandler = queryOptions.strategy(this);
                        logger.debug('%s - end', method);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * initialize the channel if it hasn't been done
     * @private
     */
    NetworkImpl.prototype._initializeInternalChannel = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var method, targets, mspId, discoverers, _i, targets_1, peer, discoverer, idx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = '_initializeInternalChannel';
                        logger.debug('%s - start', method);
                        if (!(options === null || options === void 0 ? void 0 : options.enabled)) return [3 /*break*/, 2];
                        logger.debug('%s - initialize with discovery', method);
                        targets = void 0;
                        logger.debug('%s - user has not specified discovery targets, check channel and client', method);
                        mspId = this.gateway.getIdentity().mspId;
                        targets = this.channel.getEndorsers(mspId);
                        if (!targets || targets.length < 1) {
                            // then check the client for connected peers associated with the mspid
                            targets = this.channel.client.getEndorsers(mspId);
                        }
                        if (!targets || targets.length < 1) {
                            // get any peer
                            targets = this.channel.client.getEndorsers();
                        }
                        if (!targets || targets.length < 1) {
                            throw Error('No discovery targets found');
                        }
                        else {
                            logger.debug('%s - using channel/client targets', method);
                        }
                        discoverers = [];
                        for (_i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
                            peer = targets_1[_i];
                            discoverer = this.channel.client.newDiscoverer(peer.name, peer.mspid);
                            discoverer.setEndpoint(peer.endpoint);
                            discoverers.push(discoverer);
                        }
                        this.discoveryService = this.channel.newDiscoveryService(this.channel.name);
                        idx = this.gateway.identityContext;
                        // do the three steps
                        this.discoveryService.build(idx);
                        this.discoveryService.sign(idx);
                        logger.debug('%s - will discover asLocalhost:%s', method, options.asLocalhost);
                        return [4 /*yield*/, this.discoveryService.send({
                                asLocalhost: options.asLocalhost,
                                targets: discoverers
                            })];
                    case 1:
                        _a.sent();
                        // now we can work with the discovery results
                        // or get a handler later from the discoverService
                        // to be used on endorsement, queries, and commits
                        logger.debug('%s - discovery complete - channel is populated', method);
                        _a.label = 2;
                    case 2:
                        logger.debug('%s - end', method);
                        return [2 /*return*/];
                }
            });
        });
    };
    NetworkImpl.prototype.newBlockListenerSession = function (listener, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, listenerOptionsWithDefaults(options)];
                    case 1:
                        options = _a.sent();
                        if (options.checkpointer) {
                            listener = (0, listeners_1.checkpointBlockListener)(listener, options.checkpointer);
                        }
                        if ((0, gatewayutils_1.notNullish)(options.startBlock)) {
                            return [2 /*return*/, this.newIsolatedBlockListenerSession(listener, options)];
                        }
                        else {
                            return [2 /*return*/, this.newSharedBlockListenerSession(listener, options.type)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    NetworkImpl.prototype.newIsolatedBlockListenerSession = function (listener, options) {
        var blockSource = new blockeventsource_1.BlockEventSource(this.eventServiceManager, options);
        return new isolatedblocklistenersession_1.IsolatedBlockListenerSession(listener, blockSource);
    };
    NetworkImpl.prototype.newSharedBlockListenerSession = function (listener, type) {
        if (type === 'filtered') {
            return new sharedblocklistenersession_1.SharedBlockListenerSession(listener, this.realtimeFilteredBlockEventSource);
        }
        else if (type === 'full') {
            return new sharedblocklistenersession_1.SharedBlockListenerSession(listener, this.realtimeFullBlockEventSource);
        }
        else if (type === 'private') {
            return new sharedblocklistenersession_1.SharedBlockListenerSession(listener, this.realtimePrivateBlockEventSource);
        }
        else {
            throw new Error("Unsupported event listener type: ".concat(type));
        }
    };
    return NetworkImpl;
}());
exports.NetworkImpl = NetworkImpl;
//# sourceMappingURL=network.js.map