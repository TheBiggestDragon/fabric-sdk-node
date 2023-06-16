"use strict";
/*
 Copyright 2019 IBM All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0
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
exports.loadFromConfig = void 0;
var fs = require("fs");
var fabric_common_1 = require("fabric-common");
var logger = fabric_common_1.Utils.getLogger('NetworkConfig');
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Configures a client object using a supplied connection profile JSON object.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadFromConfig(client, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var method, _a, _b, _c, _i, peerName, _d, _e, _f, _g, ordererName, _h, _j, _k, _l, channelName;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    method = 'loadFromConfig';
                    logger.debug('%s - start', method);
                    if (!config.peers) return [3 /*break*/, 4];
                    _a = config.peers;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _m.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 4];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 3];
                    peerName = _c;
                    return [4 /*yield*/, buildPeer(client, peerName, config.peers[peerName], config)];
                case 2:
                    _m.sent();
                    _m.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!config.orderers) return [3 /*break*/, 8];
                    _d = config.orderers;
                    _e = [];
                    for (_f in _d)
                        _e.push(_f);
                    _g = 0;
                    _m.label = 5;
                case 5:
                    if (!(_g < _e.length)) return [3 /*break*/, 8];
                    _f = _e[_g];
                    if (!(_f in _d)) return [3 /*break*/, 7];
                    ordererName = _f;
                    return [4 /*yield*/, buildOrderer(client, ordererName, config.orderers[ordererName])];
                case 6:
                    _m.sent();
                    _m.label = 7;
                case 7:
                    _g++;
                    return [3 /*break*/, 5];
                case 8:
                    if (!config.channels) return [3 /*break*/, 12];
                    _h = config.channels;
                    _j = [];
                    for (_k in _h)
                        _j.push(_k);
                    _l = 0;
                    _m.label = 9;
                case 9:
                    if (!(_l < _j.length)) return [3 /*break*/, 12];
                    _k = _j[_l];
                    if (!(_k in _h)) return [3 /*break*/, 11];
                    channelName = _k;
                    return [4 /*yield*/, buildChannel(client, channelName, config.channels[channelName])];
                case 10:
                    _m.sent();
                    _m.label = 11;
                case 11:
                    _l++;
                    return [3 /*break*/, 9];
                case 12:
                    logger.debug('%s - end', method);
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadFromConfig = loadFromConfig;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildChannel(client, channelName, channelConfig) {
    var method = 'buildChannel';
    logger.debug('%s - start - %s', method, channelName);
    // this will add the channel to the client instance
    var channel = client.getChannel(channelName);
    var peers = channelConfig.peers;
    if (peers) {
        var peerNames = Array.isArray(peers) ? peers : Object.keys(peers);
        peerNames.forEach(function (peerName) {
            var peer = client.getEndorser(peerName);
            channel.addEndorser(peer);
            logger.debug('%s - added endorsing peer :: %s', method, peer.name);
        });
    }
    else {
        logger.debug('%s - no peers in config', method);
    }
    if (channelConfig.orderers) {
        channelConfig.orderers.forEach(function (ordererName) {
            var orderer = client.getCommitter(ordererName);
            channel.addCommitter(orderer);
            logger.debug('%s - added orderer :: %s', method, orderer.name);
        });
    }
    else {
        logger.debug('%s - no orderers in config', method);
    }
    return Promise.resolve();
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildOrderer(client, ordererName, ordererConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var method, mspid, options, endpoint, orderer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = 'buildOrderer';
                    logger.debug('%s - start - %s', method, ordererName);
                    mspid = ordererConfig.mspid;
                    return [4 /*yield*/, buildOptions(ordererConfig)];
                case 1:
                    options = _a.sent();
                    endpoint = client.newEndpoint(options);
                    logger.debug('%s - about to connect to committer %s url:%s mspid:%s', method, ordererName, ordererConfig.url, mspid);
                    orderer = client.getCommitter(ordererName, mspid);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, orderer.connect(endpoint)];
                case 3:
                    _a.sent();
                    logger.debug('%s - connected to committer %s url:%s', method, ordererName, ordererConfig.url);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    logger.info('%s - Unable to connect to the committer %s due to %s', method, ordererName, error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPeer(client, peerName, peerConfig, config) {
    return __awaiter(this, void 0, void 0, function () {
        var method, mspid, options, endpoint, peer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = 'buildPeer';
                    logger.debug('%s - start - %s', method, peerName);
                    mspid = findPeerMspid(peerName, config);
                    return [4 /*yield*/, buildOptions(peerConfig)];
                case 1:
                    options = _a.sent();
                    endpoint = client.newEndpoint(options);
                    logger.debug('%s - about to connect to endorser %s url:%s mspid:%s', method, peerName, peerConfig.url, mspid);
                    peer = client.getEndorser(peerName, mspid);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, peer.connect(endpoint)];
                case 3:
                    _a.sent();
                    logger.debug('%s - connected to endorser %s url:%s', method, peerName, peerConfig.url);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    logger.info('%s - Unable to connect to the endorser %s due to %s', method, peerName, error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findPeerMspid(name, config) {
    var method = 'findPeerMspid';
    logger.debug('%s - start for %s', method, name);
    var mspid;
    here: for (var orgName in config.organizations) {
        var org = config.organizations[orgName];
        for (var _i = 0, _a = org.peers; _i < _a.length; _i++) {
            var peer = _a[_i];
            logger.debug('%s - checking peer %s in org %s', method, peer, orgName);
            if (peer === name) {
                mspid = org.mspid;
                logger.debug('%s - found mspid %s for %s', method, mspid, name);
                break here;
            }
        }
    }
    return mspid;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildOptions(endpointConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var method, options, pem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = 'buildOptions';
                    logger.debug("".concat(method, " - start"));
                    options = {
                        url: endpointConfig.url
                    };
                    return [4 /*yield*/, getPEMfromConfig(endpointConfig.tlsCACerts)];
                case 1:
                    pem = _a.sent();
                    if (pem) {
                        options.pem = pem;
                    }
                    Object.assign(options, endpointConfig.grpcOptions);
                    if (options['request-timeout'] && !options.requestTimeout) {
                        options.requestTimeout = options['request-timeout'];
                    }
                    return [2 /*return*/, options];
            }
        });
    });
}
function getPEMfromConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config) return [3 /*break*/, 3];
                    if (!config.pem) return [3 /*break*/, 1];
                    // cert value is directly in the configuration
                    result = config.pem;
                    return [3 /*break*/, 3];
                case 1:
                    if (!config.path) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.promises.readFile(config.path)];
                case 2:
                    data = _a.sent();
                    result = Buffer.from(data).toString();
                    result = fabric_common_1.Utils.normalizeX509(result);
                    _a.label = 3;
                case 3: return [2 /*return*/, result];
            }
        });
    });
}
//# sourceMappingURL=networkconfig.js.map