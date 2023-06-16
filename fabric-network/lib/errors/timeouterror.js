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
exports.TimeoutError = void 0;
var fabricerror_1 = require("./fabricerror");
/**
 * Error indicating a timeout.
 * @extends module:fabric-network.FabricError
 * @memberof module:fabric-network
 */
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(info) {
        var _this = _super.call(this, info) || this;
        _this.name = TimeoutError.name;
        return _this;
    }
    return TimeoutError;
}(fabricerror_1.FabricError));
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=timeouterror.js.map