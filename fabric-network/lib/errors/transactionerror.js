"use strict";
/**
 * Copyright 2020 IBM All Rights Reserved.
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
exports.TransactionError = void 0;
var fabricerror_1 = require("./fabricerror");
/**
 * Base type for Fabric-specific errors.
 * @memberof module:fabric-network
 * @property {string} [transactionId] ID of the associated transaction.
 * @property {string} [transactionCode] The transaction validation code of the associated transaction.
 */
var TransactionError = /** @class */ (function (_super) {
    __extends(TransactionError, _super);
    /*
     * Constructor.
     * @param {(string|object)} [info] Either an error message (string) or additional properties to assign to this
     * instance (object).
     */
    function TransactionError(info) {
        var _this = _super.call(this, info) || this;
        _this.name = TransactionError.name;
        return _this;
    }
    return TransactionError;
}(fabricerror_1.FabricError));
exports.TransactionError = TransactionError;
//# sourceMappingURL=transactionerror.js.map