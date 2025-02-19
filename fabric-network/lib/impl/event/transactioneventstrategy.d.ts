import { Endorser } from 'fabric-common';
export interface EventCount {
    success: number;
    fail: number;
    readonly expected: number;
}
export type SuccessCallback = () => void;
export type FailCallback = (error: Error) => void;
/**
 * Event handling strategy base class that keeps counts of success and fail events to allow
 * subclasses to implement concrete event handling strategies. On each success or fail event,
 * the checkCompletion() function is called, which must be implemented by
 * subclasses.
 *
 * Instances of the strategy are stateful and must only be used for a single transaction.
 * @private
 * @class
 */
export declare abstract class TransactionEventStrategy {
    private readonly peers;
    private readonly counts;
    /**
     * Constructor.
     * @param {Endorser[]} peers - Peers for which to process events.
     */
    constructor(peers: Endorser[]);
    /**
     * Called by event handler to obtain the peers to which it should listen.
     * @returns {Endorser[]} Peers.
     */
    getPeers(): Endorser[];
    /**
     * Called when an event is received.
     * @param {Function} successFn Callback function to invoke if this event satisfies the strategy.
     * @param {Function} failFn Callback function to invoke if this event fails the strategy.
     */
    eventReceived(successFn: SuccessCallback, failFn: FailCallback): void;
    /**
     * Called when an error is received.
     * @param {Function} successFn Callback function to invoke if this error satisfies the strategy.
     * @param {Function} failFn Callback function to invoke if this error fails the strategy.
     */
    errorReceived(successFn: SuccessCallback, failFn: FailCallback): void;
    /**
     * @typedef {Object} EventCount
     * @property {Number} success Number of successful events received.
     * @property {Number} fail Number of errors received.
     * @property {Number} expected Number of event services for which response events (or errors) are expected.
     */
    /**
     * Called when a successful event or error is received.
     * @private
     * @param {EventCount} counts Count of events received.
     * @param {Function} successFn Callback function to invoke if the strategy is successful.
     * @param {Function} failFn Callback function to invoke if the strategy fails.
     */
    protected abstract checkCompletion(counts: EventCount, successFn: SuccessCallback, failFn: FailCallback): void;
}
