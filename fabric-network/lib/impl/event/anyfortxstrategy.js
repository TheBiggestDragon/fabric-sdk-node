"use strict";
/*
 * Copyright 2018, 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyForTxStrategy = void 0;
var transactioneventstrategy_1 = require("./transactioneventstrategy");
var Logger = require("../../logger");
var logger = Logger.getLogger('AnyForTxStrategy');
/**
 * Event handling strategy that:
 * - Waits for first successful reponse from an event service.
 * - Fails if all responses are errors.
 * - Succeeds if any reponses are successful.
 *
 * Instances of the strategy are stateful and must only be used for a single transaction.
 * @private
 * @class
 */
var AnyForTxStrategy = /** @class */ (function (_super) {
    __extends(AnyForTxStrategy, _super);
    function AnyForTxStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnyForTxStrategy.prototype.checkCompletion = function (counts, successFn, failFn) {
        var method = 'checkCompletion';
        logger.debug('%s:%j:', method, counts);
        var isAllResponsesReceived = (counts.success + counts.fail === counts.expected);
        if (counts.success > 0) {
            logger.debug('%s: success', method);
            successFn();
        }
        else if (isAllResponsesReceived) {
            failFn(new Error('No successful events received'));
        }
        else {
            logger.debug('%s - not complete', method);
        }
    };
    return AnyForTxStrategy;
}(transactioneventstrategy_1.TransactionEventStrategy));
exports.AnyForTxStrategy = AnyForTxStrategy;
//# sourceMappingURL=anyfortxstrategy.js.map