import { createRows } from "./table.js";

/** document.getElementById(id) */
export let $id = id => document.getElementById(id);

/** Convert a locale string to an integer. */
export let $int = v => parseInt(v.replace(/,/g, ""));

/** document.querySelector(selector) */
export let $qo = s => document.querySelector(s);

/** document.querySelectorAll(selector) */
export let $qa = s => document.querySelectorAll(s);

/** Create an object from a NodeList given a CSS selector and a mapping function. */
export let $toObj = (a, s, m) => Object.fromEntries(Array.from(a.querySelectorAll(s)).map(m));

/** Convert a number to a locale string with no decimal places. */
export let $toLS = v => v.toLocaleString(undefined, { minimumFractionDigits: 0 });

/** Create a new element given its tag name and properties */
export let $e = (t, p) => Object.assign(document.createElement(t), p);

/** Set the `oninput` function of one or more inputs given a CSS selector. */
export let $qfn = (s, f) => $qa(s).forEach(e => e.oninput = () => f());

/** Get input values. */
export let $in = () => $toObj($id("inputs"), "input", e => [e.id, parseFloat(e.value)]);

/** Get table settings. */
export let $ts = () => $toObj($id("table-settings"), "input", e => [e.id, parseInt(e.value)]);

/** Roughly calculate the amount in the retirement fund from monthly
 *  contributions and natural growth after a number of years.
 *  - `y`: Absolute years between start and ending ages.
 *  - `i`: Initial amount
 *  - `m`: Monthly contribution
 *  - `r`: Interest rate
 */
export function getTotalValue(y, i, m, r) {
    // Return if age is undefined.
    if (y < 1 || !y) return;

    // Convert undefined to 0.
    [i, m, r] = [i, m, r].map(v => v = v || 0);

    let output = Math.floor(Array(y).fill()
        .reduce(acc => (acc + m * 12) * (r / 100 + 1), i));

    return output;
}

/** Roughly calculate the amount in the retirement fund with withdrawals. */
export function getDrawDownValue(y, i, m, r) {
    let drawDownAmt = () => $int($id("stat-draw-down").textContent);

    // Return if age is undefined.
    if (y < 1 || !y) return;

    // Convert undefined to 0.
    [i, m, r] = [i, m, r].map(v => v = v || 0);

    // Calculate the total value of the retirement fund.
    let iter = 0;
    let output = Math.floor(Array(y).fill()
        .reduce((acc) => {
            iter++;

            // Check whether the current age is greater than the retirement age.
            return iter + $in()["age"] - 1 > $in()["ret-age"] ?

                // If so, subtract the draw down amount from the total.
                (acc - drawDownAmt()) * (r / 100 + 1)

                // Otherwise, add the monthly contribution to the total.
                : (acc + m * 12) * (r / 100 + 1);
        }, i));

    return output;
}

/** Update the values of all text fields in the application following user input. */
export function updateValues() {
    let inputs = $in();

    let sixty = getTotalValue(
        (60 - inputs["age"] + 1),
        inputs["nest-egg"],
        inputs["amt-inv"],
        inputs["exp-int"],
    );

    let drawDown = Math.ceil(parseInt(sixty) * $id("draw-down").value / 100);

    /* "Age Sixty" section. */
    $id("startup").innerHTML = $toLS(inputs["nest-egg"]);
    $id("age-sixty").innerHTML = $toLS(sixty);
    $id("total-inv").innerHTML = $toLS(((60 - inputs["age"]) * (inputs["amt-inv"] * 12)));

    /* "Summary" section. */
    $id("stat-ret-age").innerHTML = inputs["ret-age"]
    $id("stat-nest-egg").innerHTML = $toLS(sixty);
    $id("stat-draw-down").innerHTML = $toLS(drawDown);

    // Fill in the table.
    createRows();
}
