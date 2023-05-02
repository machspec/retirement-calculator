import { TABLE_BODY } from "./constants.js";
import { getInputValues, getTableSettings, getTotalValue, newElement } from "./helpers.js";

// Table Handlers
let lastRow = () => TABLE_BODY.querySelector("tr:last-child");
let lastRowData = () => Array.from(lastRow().querySelectorAll("td"));
let lastRowContents = () => lastRowData().map(e => parseInt(e.textContent));

/** Add a new row to the age results table. */
export function addRow() {
    let row = newElement("tr");
    let inputs = getInputValues();

    row.appendChild(newElement("td", {
        textContent: lastRowContents()[0] + getTableSettings()["age-increment"]
    }));

    row.appendChild(newElement("td", {
        textContent: getTotalValue(
            lastRowContents()[0] + getTableSettings()["age-increment"] - inputs["age"],
            inputs["nest-egg"],
            inputs["amt-inv"],
            inputs["exp-int"],
        ),
    }));

    TABLE_BODY.appendChild(row);
}

export function createRows() {
    TABLE_BODY.innerHTML = "";

    let inputs = getInputValues();
    let [startingAge, ageIncrement, rowCount] = Object.values(getTableSettings());

    for (let i = 0; i < rowCount; i++) {
        let row = newElement("tr");

        // Add incremented age.
        row.appendChild(newElement("td", { textContent: startingAge + i * ageIncrement }));

        console.log(inputs["age"] + i * ageIncrement);

        // TODO: Calculate Nest Egg.
        row.appendChild(newElement("td", {
            textContent: getTotalValue(
                inputs["age"] + i * ageIncrement,
                inputs["nest-egg"],
                inputs["amt-inv"],
                inputs["exp-int"],
            )
        }));

        TABLE_BODY.appendChild(row);
    }
}

export function updateRowCount() {
    let currentRows = TABLE_BODY.querySelectorAll("tr").length;
    let desiredRows = getTableSettings()["row-count"];
    let rowDelta = currentRows - desiredRows;

    // If the user sets the row count manually, just recreate all rows.
    if (Math.abs(rowDelta) != 1) {
        createRows();
        return;
    }

    if (rowDelta < 0) addRow();
    else lastRow().remove();
}
