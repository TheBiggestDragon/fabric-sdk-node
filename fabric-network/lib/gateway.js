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
exports.Gateway = exports.mergeOptions = void 0;
var network_1 = require("./network");
var NetworkConfig = require("./impl/ccp/networkconfig");
var fabric_common_1 = require("fabric-common");
var EventStrategies = require("./impl/event/defaulteventhandlerstrategies");
var QueryStrategies = require("./impl/query/defaultqueryhandlerstrategies");
var IdentityProviderRegistry = require("./impl/wallet/identityproviderregistry");
var Logger = require("./logger");
var logger = Logger.getLogger('Gateway');
function mergeOptions(currentOptions, additionalOptions) {
    var result = currentOptions;
    for (var prop in additionalOptions) {
        if (typeof additionalOptions[prop] === 'object' && additionalOptions[prop] !== null) {
            if (result[prop] === undefined) {
                result[prop] = additionalOptions[prop];
            }
            else {
                mergeOptions(result[prop], additionalOptions[prop]);
            }
        }
        else {
            result[prop] = additionalOptions[prop];
        }
    }
    return result;
}
exports.mergeOptions = mergeOptions;
/**
 * @interface GatewayOptions
 * @memberof module:fabric-network
 * @property {(string|module:fabric-network.Identity)} identity The identity used for all interactions on this Gateway
 * instance. This can be either:
 * <ul>
 *   <li>a label matching an identity within the supplied wallet.</li>
 *   <li>an identity object.</li>
 * </ul
 * @property {module:fabric-network.Wallet} [wallet] The identity wallet implementation for use with this Gateway
 * instance. Required if a label is specified as the <code>identity</code>, or <code>clientTlsIdentity</code> is specified.
 * @property {module:fabric-network.IdentityProvider} [identityProvider] An identity provider for the supplied identity
 * object. Required if an identity object is not one of the default supported types.
 * @property {string} [clientTlsIdentity] The identity within the wallet to use as the client TLS identity.
 * @property {object} [tlsInfo] Credentials to use as the client TLS identity.
 * @property {string} tlsInfo.certificate Certificate PEM.
 * @property {string} tlsInfo.key Private key PEM.
 * @property {module:fabric-network.DefaultEventHandlerOptions} [eventHandlerOptions]
 * Options for event handling when submitting transactions.
 * @property {module:fabric-network.DefaultQueryHandlerOptions} [queryHandlerOptions]
 * Options for query handling when evaluating transactions.
 * @property {module:fabric-network.DiscoveryOptions} [discovery] Discovery options.
 */
/**
 * @interface DefaultEventHandlerOptions
 * @memberof module:fabric-network
 * @property {number} [commitTimeout = 300] The timeout period in seconds to wait
 * for commit notification to complete.
 * @property {number} [endorseTimeout = 30] The timeout period in seconds to wait
 * for the endorsement to complete.
 * @property {?module:fabric-network.TxEventHandlerFactory} [strategy=PREFER_MSPID_SCOPE_ALLFORTX]
 * Event handling strategy to identify successful transaction commits. A <code>null</code> value indicates that no
 * event handling is desired. The default is
 * [PREFER_MSPID_SCOPE_ALLFORTX]{@link module:fabric-network.DefaultEventHandlerStrategies}.
 */
/**
 * @interface DefaultQueryHandlerOptions
 * @memberof module:fabric-network
 * @property {number} [timeout = 30] The timeout period in seconds to wait for the query to
 * complete.
 * @property {module:fabric-network.QueryHandlerFactory} [strategy=PREFER_MSPID_SCOPE_SINGLE]
 * Query handling strategy used to evaluate queries. The default is
 * [PREFER_MSPID_SCOPE_SINGLE]{@link module:fabric-network.DefaultQueryHandlerStrategies}.
 */
/**
 * @interface DiscoveryOptions
 * @memberof module:fabric-network
 * @property {boolean} [enabled=true] True if discovery should be used; otherwise false.
 * @property {boolean} [asLocalhost=true] Convert discovered host addresses to be 'localhost'.
 * Will be needed when running a docker composed fabric network on the local system;
 * otherwise should be disabled.
 */
/**
 * Factory function to obtain transaction event handler instances. Called on every transaction submit.
 * @typedef {function} TxEventHandlerFactory
 * @memberof module:fabric-network
 * @param {string} transactionId The ID of the transaction being submitted.
 * @param {module:fabric-network.Network} network The network on which this transaction is being submitted.
 * @returns {module:fabric-network.TxEventHandler} A transaction event handler.
 * @see module:fabric-network.DefaultEventHandlerStrategies
 */
/**
 * Handler used to wait for commit events when a transaction is submitted.
 * @interface TxEventHandler
 * @memberof module:fabric-network
 */
/**
 * Resolves when the handler has started listening for transaction commit events. Called after the transaction proposal
 * has been accepted and prior to submission of the transaction to the orderer.
 * @function module:fabric-network.TxEventHandler#startListening
 * @async
 * @returns {Promise<void>}
 */
/**
 * Resolves (or rejects) when suitable transaction commit events have been received. Called after submission of the
 * transaction to the orderer.
 * @function module:fabric-network.TxEventHandler#waitForEvents
 * @async
 * @returns {Promise<void>}
 */
/**
 * Called if submission of the transaction to the orderer fails.
 * @function module:fabric-network.TxEventHandler#cancelListening
 * @returns {void}
 */
/**
 * Factory function to obtain query handler instances. Called on every network creation.
 * @typedef {Function} QueryHandlerFactory
 * @memberof module:fabric-network
 * @param {module:fabric-network.Network} network The network on which queries are being evaluated.
 * @returns {module:fabric-network.QueryHandler} A query handler.
 * @see module:fabric-network.DefaultQueryHandlerStrategies
 */
/**
 * Handler used to obtain query results from peers when a transaction is evaluated.
 * @interface QueryHandler
 * @memberof module:fabric-network
 */
/**
 * Called when a transaction is evaluated to obtain query results from suitable network peers.
 * @function module:fabric-network.QueryHandler#evaluate
 * @async
 * @param {module:fabric-network.Query} query Query object that can be used by the handler to send the query to
 * specific peers.
 * @returns {Promise<Buffer>}
 */
/**
 * Used by query handler implementations to evaluate transactions on peers of their choosing.
 * @interface Query
 * @memberof module:fabric-network
 */
/**
 * Get query results from specified peers.
 * @function module:fabric-network.Query#evaluate
 * @async
 * @param {Endorser[]} peers
 * @returns {Promise<Array<module:fabric-network.Query~QueryResponse | Error>>}
 */
/**
 * @typedef {Object} Query~QueryResponse
 * @memberof module:fabric-network
 * @property {boolean} isEndorsed True if the proposal was endorsed by the peer.
 * @property {number} status The status value from the endorsement. This attribute will be set by the chaincode.
 * @property {Buffer} payload The payload value from the endorsement. This attribute may be considered the query value
 * if the proposal was endorsed by the peer.
 * @property {string} message The message value from the endorsement. This property contains the error message from
 * the peer if it did not endorse the proposal.
 */
/**
 * The gateway peer provides the connection point for an application to access the Fabric network.
 * It is instantiated using the default constructor.
 * It can then be connected to a fabric network using the [connect]{@link #connect} method by
 * passing either a common connection profile definition or an existing {@link Client} object.
 * Once connected, it can then access individual Network instances (channels) using the
 * [getNetwork]{@link #getNetwork} method which in turn can access the
 * [smart contracts]{@link Contract} installed on a network and
 * [submit transactions]{@link Contract#submitTransaction} to the ledger.
 * @memberof module:fabric-network
 */
var Gateway = /** @class */ (function () {
    function Gateway() {
        this.networks = new Map();
        logger.debug('in Gateway constructor');
    }
    /**
     * Connect to the Gateway with a connection profile or a prebuilt Client instance.
     * @async
     * @param {(object|Client)} config The configuration for this Gateway which can be:
     * <ul>
     *   <li>A common connection profile JSON (Object)</li>
     *   <li>A pre-configured client instance</li>
     * </ul>
     * @param {module:fabric-network.GatewayOptions} options - specific options
     * for creating this Gateway instance
     * @example
     * const gateway = new Gateway();
     * const wallet = await Wallets.newFileSystemWallet('./WALLETS/wallet');
     * const connectionProfileJson = (await fs.promises.readFile('network.json')).toString();
     * const connectionProfile = JSON.parse(connectionProfileJson);
     * await gateway.connect(connectionProfile, {
     *     identity: 'admin',
     *     wallet: wallet
     * });
     */
    Gateway.prototype.connect = function (config, options) {
        return __awaiter(this, void 0, void 0, function () {
            var method, defaultOptions, loadCcp, _a, provider, user, provider, user, tlsIdentity, tlsCredentials;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        method = 'connect';
                        logger.debug('%s - start', method);
                        defaultOptions = {
                            queryHandlerOptions: {
                                timeout: 30,
                                strategy: QueryStrategies.PREFER_MSPID_SCOPE_SINGLE
                            },
                            eventHandlerOptions: {
                                endorseTimeout: 30,
                                commitTimeout: 300,
                                strategy: EventStrategies.PREFER_MSPID_SCOPE_ALLFORTX
                            },
                            discovery: {
                                enabled: true,
                                asLocalhost: true
                            }
                        };
                        this.options = mergeOptions(defaultOptions, options);
                        logger.debug('gateway options: %j', options);
                        loadCcp = false;
                        if (config instanceof fabric_common_1.Client) {
                            // initialize from an existing Client object instance
                            logger.debug('%s - using existing client object', method);
                            this.client = config;
                        }
                        else if (typeof config === 'object') {
                            this.client = new fabric_common_1.Client('gateway client');
                            loadCcp = true;
                        }
                        else {
                            throw new Error('Configuration must be a connection profile object or Client object');
                        }
                        if (!(typeof options.identity === 'string')) return [3 /*break*/, 3];
                        logger.debug('%s - setting identity from wallet', method);
                        _a = this;
                        return [4 /*yield*/, this._getWalletIdentity(options.identity)];
                    case 1:
                        _a.identity = _b.sent();
                        provider = options.wallet.getProviderRegistry().getProvider(this.identity.type);
                        return [4 /*yield*/, provider.getUserContext(this.identity, options.identity)];
                    case 2:
                        user = _b.sent();
                        this.identityContext = this.client.newIdentityContext(user);
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(typeof options.identity === 'object')) return [3 /*break*/, 5];
                        logger.debug('%s - setting identity using identity object', method);
                        this.identity = options.identity;
                        provider = options.identityProvider || IdentityProviderRegistry.newDefaultProviderRegistry().getProvider(this.identity.type);
                        return [4 /*yield*/, provider.getUserContext(this.identity, 'gateway identity')];
                    case 4:
                        user = _b.sent();
                        this.identityContext = this.client.newIdentityContext(user);
                        return [3 /*break*/, 6];
                    case 5:
                        logger.error('%s - An identity must be assigned to a Gateway instance', method);
                        throw new Error('An identity must be assigned to a Gateway instance');
                    case 6:
                        if (!options.clientTlsIdentity) return [3 /*break*/, 8];
                        logger.debug('%s - setting tlsIdentity', method);
                        return [4 /*yield*/, this._getWalletIdentity(options.clientTlsIdentity)];
                    case 7:
                        tlsIdentity = _b.sent();
                        if (tlsIdentity.type !== 'X.509') {
                            throw new Error('Unsupported TLS identity type: ' + tlsIdentity.type);
                        }
                        tlsCredentials = tlsIdentity.credentials;
                        this.client.setTlsClientCertAndKey(tlsCredentials.certificate, tlsCredentials.privateKey);
                        return [3 /*break*/, 9];
                    case 8:
                        if (options.tlsInfo) {
                            logger.debug('%s - setting tlsInfo', method);
                            this.client.setTlsClientCertAndKey(options.tlsInfo.certificate, options.tlsInfo.key);
                        }
                        else {
                            logger.debug('%s - using self signed setting for tls', method);
                            this.client.setTlsClientCertAndKey();
                        }
                        _b.label = 9;
                    case 9:
                        // apply any connection options to the client instance for use
                        // internally by the client instance when building a complete set
                        // of connection options for an endpoint
                        // these will be merged with those from the config (default.json)
                        if (options['connection-options']) {
                            this.client.setCentralizedConnectionOptions(options['connection-options']);
                            logger.debug('%s - assigned connection options');
                        }
                        if (!loadCcp) return [3 /*break*/, 11];
                        logger.debug('%s - NetworkConfig loading client from ccp', method);
                        return [4 /*yield*/, NetworkConfig.loadFromConfig(this.client, config)];
                    case 10:
                        _b.sent();
                        _b.label = 11;
                    case 11:
                        logger.debug('%s - end', method);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the identity associated with the gateway connection.
     * @returns {module:fabric-network.Identity} An identity.
     */
    Gateway.prototype.getIdentity = function () {
        if (!this.identity) {
            throw new Error('Gateway is not connected');
        }
        return this.identity;
    };
    /**
     * Returns the set of options associated with the Gateway connection
     * @returns {module:fabric-network.Gateway~GatewayOptions} The Gateway connection options
     */
    Gateway.prototype.getOptions = function () {
        if (!this.options) {
            throw new Error('Gateway is not connected');
        }
        return this.options;
    };
    /**
     * Clean up and disconnect this Gateway connection in preparation for it to be discarded and garbage collected
     */
    Gateway.prototype.disconnect = function () {
        var _a;
        logger.debug('in disconnect');
        this.networks.forEach(function (network) { return network._dispose(); });
        this.networks.clear();
        (_a = this.client) === null || _a === void 0 ? void 0 : _a.close();
    };
    /**
     * Returns an object representing a network
     * @param {string} networkName The name of the network (channel name)
     * @returns {module:fabric-network.Network}
     */
    Gateway.prototype.getNetwork = function (networkName) {
        return __awaiter(this, void 0, void 0, function () {
            var method, existingNetwork, channel, newNetwork;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = 'getNetwork';
                        logger.debug('%s - start', method);
                        if (!this.client || !this.options) {
                            throw new Error('Gateway is not connected');
                        }
                        existingNetwork = this.networks.get(networkName);
                        if (existingNetwork) {
                            logger.debug('%s - returning existing network:%s', method, networkName);
                            return [2 /*return*/, existingNetwork];
                        }
                        logger.debug('%s - create network object and initialize', method);
                        channel = this.client.getChannel(networkName);
                        newNetwork = new network_1.NetworkImpl(this, channel);
                        return [4 /*yield*/, newNetwork._initialize(this.options.discovery)];
                    case 1:
                        _a.sent();
                        this.networks.set(networkName, newNetwork);
                        return [2 /*return*/, newNetwork];
                }
            });
        });
    };
    Gateway.prototype._getWalletIdentity = function (label) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var identity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.wallet)) {
                            throw new Error('No wallet supplied from which to retrieve identity label');
                        }
                        return [4 /*yield*/, this.options.wallet.get(label)];
                    case 1:
                        identity = _b.sent();
                        if (!identity) {
                            throw new Error("Identity not found in wallet: ".concat(label));
                        }
                        return [2 /*return*/, identity];
                }
            });
        });
    };
    return Gateway;
}());
exports.Gateway = Gateway;
//# sourceMappingURL=gateway.js.map