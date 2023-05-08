import { $in, $int, $qa, $qo, $toLS, $ts, getDrawDownValue } from "./helpers.js";

export let lastRow = () => Array.from($qa("tbody>tr:last-child td"))
    .map(e => $int(e.textContent));

let imr = () => [$in()["nest-egg"], $in()["amt-inv"], $in()["exp-ret-int"]];

function addRow() {
    let age = lastRow()[0] + $ts()["age-increment"];
    $qo("#age-results>tbody").appendChild(newRow(
        age, getDrawDownValue(
            age - $in()["age"] + 1,
            ...imr()
        )
    ));
}

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

export function createRows() {
    if ($ts()["starting-age"] < $in()["age"]) return;

    $qo("#age-results>tbody").innerHTML = "";

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

export function updateRowCount() {
    let rowCount = $ts()["row-count"];
    let currentCount = $qo("#age-results>tbody").childElementCount;

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