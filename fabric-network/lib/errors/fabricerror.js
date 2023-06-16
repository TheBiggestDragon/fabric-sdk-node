"use strict";
/**
 * Copyright 2018 IBM All Rights Reserved.
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
exports.FabricError = void 0;
/**
 * Base type for Fabric-specific errors.
 * @memberof module:fabric-network
 * @property {Error} [cause] Underlying error that caused this error.
 * @property {string} [transactionId] ID of the associated transaction.
 */
var FabricError = /** @class */ (function (_super) {
    __extends(FabricError, _super);
    /*
     * Constructor.
     * @param {(string|object)} [info] Either an error message (string) or additional properties to assign to this
     * inctance (object).
     */
    function FabricError(info) {
        var _this = this;
        if (!info) {
            _this = _super.call(this) || this;
        }
        else if (typeof info === 'string') {
            _this = _super.call(this, info) || this;
        }
        else {
            _this = _super.call(this, info.message) || this;
            Object.assign(_this, info);
        }
        _this.name = FabricError.name;
        return _this;
    }
    return FabricError;
}(Error));
exports.FabricError = FabricError;
//# sourceMappingURL=fabricerror.js.map