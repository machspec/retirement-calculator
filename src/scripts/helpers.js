import { TABLE_SETTINGS } from "./constants.js";

/** Get input values. */
export function getInputValues() {
    return Object.fromEntries(
        Array.from(document.querySelectorAll("#inputs input"))
            .map(e => [e.id, parseInt(e.value)]));
}

/** Get table settings. */
export function getTableSettings() {
    return Object.fromEntries(
        Array.from(TABLE_SETTINGS.querySelectorAll("input"))
            .map(e => [e.id, parseInt(e.value)]));
};

/** Roughly calculate the amount in the retirement fund from monthly
 *  contributions and natural growth after a number of years. */
export function getTotalValue(years, initial, monthly, intRate) {
    return Math.floor(Array(years).fill().reduce(
        acc => (acc + monthly * 12) * (intRate / 100 + 1),
        initial
    ));
}


/** Set the `oninput` function of one or more inputs given a CSS selector. */
export function queryAssignFn(selector, fn) {
    document.querySelectorAll(selector)
        .forEach(element => element.oninput = () => fn());
}

/** Create a new element given its tag name and properties */
export function newElement(t, p) {
    return Object.assign(document.createElement(t), p);
}
