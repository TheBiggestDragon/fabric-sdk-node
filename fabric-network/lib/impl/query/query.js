"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
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
exports.QueryImpl = void 0;
var gatewayutils_1 = require("../gatewayutils");
var Logger = require("../../logger");
var logger = Logger.getLogger('Query');
/**
 * @private
 */
var QueryImpl = /** @class */ (function () {
    /**
     * Builds a Query instance to send and then work with the results returned
     * by the fabric-common/Query.
     * @param {module:fabric-common.Query} query - The query instance of the proposal
     * @returns {Object} options - options to be used when sending the request to
     * fabric-common service endpoint {Endorser} peer.
     */
    function QueryImpl(query, options) {
        if (options === void 0) { options = {}; }
        this.query = query;
        this.requestTimeout = 3000; // default 3 seconds
        if (options.timeout && Number.isInteger(options.timeout)) {
            this.requestTimeout = options.timeout * 1000; // need ms;
        }
    }
    /**
     * Sends a signed proposal to the specified peers. The peer endorsment
     * responses are
     * @param {Endorser[]} peers - The peers to query
     * @returns {Object.<String, (QueryResponse | Error)>} Object with peer name keys and associated values that are either
     * QueryResponse objects or Error objects.
     */
    QueryImpl.prototype.evaluate = function (peers) {
        return __awaiter(this, void 0, void 0, function () {
            var method, results, responses, _i, _a, resultError, _b, _c, peerResponse, response, _d, peers_1, peer, error_1, _e, peers_2, peer;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        method = 'evaluate';
                        logger.debug('%s - start', method);
                        results = {};
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query.send({ targets: peers, requestTimeout: this.requestTimeout })];
                    case 2:
                        responses = _f.sent();
                        if (responses) {
                            if (responses.errors) {
                                for (_i = 0, _a = responses.errors; _i < _a.length; _i++) {
                                    resultError = _a[_i];
                                    results[resultError.connection.name] = resultError;
                                    logger.debug('%s - problem with query to peer %s error:%s', method, resultError.connection.name, resultError);
                                }
                            }
                            if (responses.responses) {
                                for (_b = 0, _c = responses.responses; _b < _c.length; _b++) {
                                    peerResponse = _c[_b];
                                    if (peerResponse.response) {
                                        response = newQueryResponse(peerResponse);
                                        results[peerResponse.connection.name] = response;
                                        logger.debug('%s - have results - peer: %s with status:%s', method, peerResponse.connection.name, response.status);
                                    }
                                }
                            }
                            // check to be sure we got results for each peer requested
                            for (_d = 0, peers_1 = peers; _d < peers_1.length; _d++) {
                                peer = peers_1[_d];
                                if (!results[peer.name]) {
                                    logger.error('%s - no results for peer: %s', method, peer.name);
                                    results[peer.name] = new Error('Missing response from peer');
                                }
                            }
                        }
                        else {
                            throw Error('No responses returned for query');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _f.sent();
                        // if we get an error, return this error for each peer
                        for (_e = 0, peers_2 = peers; _e < peers_2.length; _e++) {
                            peer = peers_2[_e];
                            results[peer.name] = error_1;
                            logger.error('%s - problem with query to peer %s error:%s', method, peer.name, error_1);
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        logger.debug('%s - end', method);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return QueryImpl;
}());
exports.QueryImpl = QueryImpl;
function newQueryResponse(endorseResponse) {
    var isEndorsed = endorseResponse.endorsement ? true : false;
    var payload = isEndorsed ? (0, gatewayutils_1.asBuffer)((0, gatewayutils_1.getTransactionResponse)(endorseResponse).payload) : endorseResponse.response.payload;
    return {
        isEndorsed: isEndorsed,
        message: endorseResponse.response.message,
        payload: payload,
        status: endorseResponse.response.status,
        endorser: endorseResponse.response.endorser,
        signature: endorseResponse.response.signature
    };
}
//# sourceMappingURL=query.js.map