"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusForCode = exports.VALID_STATUS = void 0;
var fabproto6 = require("fabric-protos");
exports.VALID_STATUS = 'VALID';
function getStatusForCode(code) {
    var status = fabproto6.protos.TxValidationCode[code];
    if (!status) {
        throw new Error("Unexpected transaction status code: ".concat(code));
    }
    return status;
}
exports.getStatusForCode = getStatusForCode;
//# sourceMappingURL=transactionstatus.js.map