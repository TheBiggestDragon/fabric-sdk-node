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
exports.EventServiceManager = void 0;
var GatewayUtils = require("../gatewayutils");
var Logger = require("../../logger");
var logger = Logger.getLogger('EventSourceManager');
var EventServiceManager = /** @class */ (function () {
    function EventServiceManager(network) {
        this.eventServices = new Map();
        this.network = network;
        this.channel = network.getChannel();
        this.mspId = network.getGateway().getIdentity().mspId;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.identityContext = this.network.getGateway().identityContext;
        logger.debug('constructor - network:%s', this.network.getChannel().name);
    }
    /**
     * Get a shared event service that can only be used for realtime listening to filtered events. These event services
     * provide high performance event listening for commit events.
     * @param peer Peer from which to receive events.
     * @returns An event service.
     */
    EventServiceManager.prototype.getCommitEventService = function (peer) {
        var eventService = this.eventServices.get(peer);
        if (!eventService) {
            eventService = this.newEventService([peer]);
            this.eventServices.set(peer, eventService);
        }
        return eventService;
    };
    /**
     * Use this method to be sure the event service has been connected and has been started. If the event service is not
     * started, it will start the service based on the options provided. If the event service is already started, it
     * will check that the event service is compatible with the options provided.
     * @param eventService EventService to be started if it not already started.
     * @param options The options to start the event service.
     */
    EventServiceManager.prototype.startEventService = function (eventService, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug('startEventService - start %s', this.network.getChannel().name);
                        if (eventService.isStarted() || eventService.isInUse()) {
                            return [2 /*return*/, this.assertValidOptionsForStartedService(options, eventService)];
                        }
                        eventService.build(this.identityContext, options);
                        eventService.sign(this.identityContext);
                        // targets must be previously assigned
                        return [4 /*yield*/, eventService.send()];
                    case 1:
                        // targets must be previously assigned
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventServiceManager.prototype.newDefaultEventService = function () {
        var peers = this.getEventPeers();
        GatewayUtils.shuffle(peers);
        return this.newEventService(peers);
    };
    EventServiceManager.prototype.close = function () {
        this.eventServices.forEach(function (eventService) { return eventService.close(); });
    };
    /**
     * This method will build fabric-common Eventers and the fabric-common
     * EventService. The Eventers will not be connected to the endpoint at
     * this time. Since the endorsers have been previously connected, the
     * endpoint should be accessable. The EventService will check the connection
     * and perform the connect during the send() when it starts the service.
     * @param peers The Endorser service endpoints used to build a
     *  a list of {@link Eventer} service endpoints that will be used as the
     *  targets of the new EventService.
     */
    EventServiceManager.prototype.newEventService = function (peers) {
        var _this = this;
        var serviceName = this.createName(peers);
        var eventService = this.channel.newEventService(serviceName);
        var eventers = peers.map(function (peer) { return _this.newEventer(peer); });
        eventService.setTargets(eventers);
        return eventService;
    };
    EventServiceManager.prototype.newEventer = function (peer) {
        var eventer = this.channel.client.newEventer(peer.name);
        eventer.setEndpoint(peer.endpoint);
        return eventer;
    };
    EventServiceManager.prototype.createName = function (peers) {
        return peers.map(function (peer) { return peer.name; }).join(',');
    };
    EventServiceManager.prototype.assertValidOptionsForStartedService = function (options, eventService) {
        if (options.blockType && options.blockType !== eventService.blockType) {
            throw new Error('EventService is not receiving the correct blockType');
        }
        if (options.startBlock) {
            throw new Error('EventService is started and not usable for replay');
        }
    };
    EventServiceManager.prototype.getEventPeers = function () {
        var orgPeers = this.getOrganizationPeers();
        return orgPeers.length > 0 ? orgPeers : this.getNetworkPeers();
    };
    EventServiceManager.prototype.getOrganizationPeers = function () {
        return this.channel.getEndorsers(this.mspId);
    };
    EventServiceManager.prototype.getNetworkPeers = function () {
        return this.channel.getEndorsers();
    };
    return EventServiceManager;
}());
exports.EventServiceManager = EventServiceManager;
//# sourceMappingURL=eventservicemanager.js.map