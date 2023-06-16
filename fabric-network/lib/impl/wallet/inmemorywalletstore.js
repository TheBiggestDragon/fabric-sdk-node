"use strict";
/*
 * Copyright 2019 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryWalletStore = void 0;
var InMemoryWalletStore = /** @class */ (function () {
    function InMemoryWalletStore() {
        this.map = new Map();
    }
    InMemoryWalletStore.prototype.remove = function (label) {
        this.map.delete(label);
        return Promise.resolve();
    };
    InMemoryWalletStore.prototype.get = function (label) {
        return Promise.resolve(this.map.get(label));
    };
    InMemoryWalletStore.prototype.list = function () {
        return Promise.resolve(Array.from(this.map.keys()));
    };
    InMemoryWalletStore.prototype.put = function (label, data) {
        this.map.set(label, data);
        return Promise.resolve();
    };
    return InMemoryWalletStore;
}());
exports.InMemoryWalletStore = InMemoryWalletStore;
//# sourceMappingURL=inmemorywalletstore.js.map