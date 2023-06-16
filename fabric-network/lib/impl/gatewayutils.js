"use strict";
/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = exports.getTransactionResponse = exports.asBuffer = exports.assertDefined = exports.notNullish = exports.cachedResult = exports.allSettled = exports.shuffle = void 0;
var fabric_protos_1 = require("fabric-protos");
/**
 * Knuth shuffle of array elements. The supplied array is directly modified.
 * @private
 * @param {array} array An array to shuffle.
 */
function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
}
exports.shuffle = shuffle;
/**
 * Implementation of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled|Promise.allSettled()}
 * for use in Node versions prior to 12.9.0, where this was introduced.
 * @private
 * @param {Iterable<Promise>} promises Iterable promises.
 * @returns An array of promises.
 */
function allSettled(promises) {
    var promiseArray = Array.isArray(promises) ? promises : Array.from(promises);
    return Promise.all(promiseArray.map(settle));
}
exports.allSettled = allSettled;
function settle(promise) {
    return promise.then(function (value) {
        return { status: 'fulfilled', value: value };
    }, function (reason) {
        return { status: 'rejected', reason: reason };
    });
}
/**
 * Wrap a function call with a cache. On first call the wrapped function is invoked to obtain a result. Subsequent
 * calls return the cached result.
 * @private
 * @param f A function whose result should be cached.
 */
function cachedResult(f) {
    var value;
    return function () {
        if (typeof value === 'undefined') {
            value = f();
        }
        return value;
    };
}
exports.cachedResult = cachedResult;
/**
 * Typesafe check that a value is not nullish.
 * @private
 * @param value Any value, including null and undefined.
 */
function notNullish(value) {
    return value !== null && value !== undefined;
}
exports.notNullish = notNullish;
function assertDefined(value, message) {
    if (value == undefined) { // eslint-disable-line eqeqeq
        throw new Error(message);
    }
    return value;
}
exports.assertDefined = assertDefined;
function asBuffer(bytes) {
    if (!bytes) {
        return Buffer.alloc(0);
    }
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength); // Create a Buffer view to avoid copying
}
exports.asBuffer = asBuffer;
function getTransactionResponse(proposalResponse) {
    var responsePayload = fabric_protos_1.protos.ProposalResponsePayload.decode(proposalResponse.payload);
    var chaincodeAction = fabric_protos_1.protos.ChaincodeAction.decode(responsePayload.extension);
    return assertDefined(chaincodeAction.response, 'Missing chaincode action response');
}
exports.getTransactionResponse = getTransactionResponse;
function withTimeout(promise, timeoutMillis, timeoutMessage) {
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () { return reject(new Error(timeoutMessage)); }, timeoutMillis);
        promise.then(resolve)
            .catch(reject)
            .finally(function () { return clearTimeout(timeout); });
    });
}
exports.withTimeout = withTimeout;
//# sourceMappingURL=gatewayutils.js.map