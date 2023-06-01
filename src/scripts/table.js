import { $in, $int, $qa, $qo, $toLS, $ts, getDrawDownValue } from "./helpers.js";

/** Get values from the last row of the table. */
export let lastRow = () => Array.from($qa("tbody>tr:last-child td"))
    .map(e => $int(e.textContent));

/** Get input values for initial investment, monthly
 *  contribution, and expected interest rate during retirement. */
let imr = () => [
    $in()["nest-egg"],
    $in()["amt-inv"],
    $in()["exp-int"],
    $in()["exp-ret-int"],
];

function addRow() {
    let age = lastRow()[0] + $ts()["age-increment"];
    $qo("#age-results>tbody").appendChild(newRow(
        age, getDrawDownValue(
            age - $in()["age"] + 1,
            ...imr()
        )
    ));
}

/** Remove the last row from the table. */
function removeRow() {
    $qo("tbody>tr:last-child").remove();
}

/** Create a new row given values for `age` and `value`. */
export function newRow(age, value) {
    return Object.assign(document.createElement("tr"), {
        innerHTML: `
            <td>${age}</td>
            <td>${$toLS(value)}</td>
        `
    });
}

/** Create rows for the table. */
export function createRows() {
    // Return if starting age < current age, or no age increment defined.
    if ($ts()["starting-age"] < $in()["age"] || !$ts()["age-increment"]) return;

    // Clear the table.
    $qo("#age-results>tbody").innerHTML = "";

    // Add rows.
    for (let i = 0; i < $ts()["row-count"]; i++) {
        let age = $ts()["starting-age"] + i * $ts()["age-increment"];
        $qo("#age-results>tbody").appendChild(newRow(
            age, getDrawDownValue(
                age - $in()["age"] + 1,
                ...imr(),
            )
        ));
    }
}

/** Update the table row count. */
export function updateRowCount() {
    let rowCount = $ts()["row-count"];
    let currentCount = $qo("#age-results>tbody").childElementCount;

    if (!rowCount || !currentCount) return;

    switch (rowCount - currentCount) {
        case 0: break;

        case 1:
            addRow();
            break;

        case -1:
            removeRow();
            break;

        default:
            createRows();
            break;
    }
}