const { invoke } = window.__TAURI__.tauri;

const tSettings = document.getElementById("table-settings");
const tBody = document.querySelector("#age-results>tbody");
const DEFAULT_INPUT = [23, 1000, 500, 10, 60];

/** Create a new element given its tag name and properties */
let newElement = (t, p) => Object.assign(document.createElement(t), p);

/** Get table settings. */
let tableSettings = () => Object.fromEntries(
    Array.from(tSettings.querySelectorAll("input"))
        .map(e => [e.id, parseInt(e.value)]));

// Table Handlers
let lastRow = () => tBody.querySelector("tr:last-child");
let lastRowData = () => Array.from(lastRow().querySelectorAll("td"));
let lastRowContents = () => lastRowData().map(e => parseInt(e.textContent));

/** Add a new row to the age results table. */
function addRow() {
    let row = newElement("tr");
    row.appendChild(newElement("td", {
        textContent: lastRowContents()[0] + tableSettings()["age-increment"]
    }));

    row.appendChild(newElement("td", {
        textContent: calculateNestEgg(lastRowContents()[0])
    }));

    tBody.appendChild(row);
}

function calculateNestEgg(age) {
    return age;
}

function createRows() {
    tBody.innerHTML = "";

    let [startingAge, ageIncrement, rowCount] = Object.values(tableSettings());

    for (let i = 0; i < rowCount; i++) {
        let row = newElement("tr");

        // Add incremented age.
        row.appendChild(newElement("td", { textContent: startingAge + i * ageIncrement }));

        // TODO: Calculate Nest Egg.
        row.appendChild(newElement("td", { textContent: parseInt(ageIncrement) * i }));

        tBody.appendChild(row);
    }
}

/** Set the `oninput` function of one or more inputs given a CSS selector. */
function inputFn(selector, fn) {
    document.querySelectorAll(selector)
        .forEach(element => element.oninput = () => fn());
}

function updateRowCount() {
    let currentRows = tBody.querySelectorAll("tr").length;
    let desiredRows = tableSettings()["row-count"];
    let rowDelta = currentRows - desiredRows;

    // If the user sets the row count manually, just recreate all rows.
    if (Math.abs(rowDelta) != 1) {
        createRows();
        return;
    }

    if (rowDelta < 0) addRow();
    else lastRow().remove();
}

window.onload = () => {
    inputFn("#inputs input", () => console.log(tableSettings()));
    inputFn("#table-settings input:not(:last-child)", () => console.log(createRows()));
    inputFn("#table-settings input:last-child", () => updateRowCount());

    document.getElementById("clear-inputs").onclick = () => {
        document.querySelectorAll("#inputs input").forEach(e => e.value = "");
    };

    document.getElementById("reset-inputs").onclick = () => {
        DEFAULT_INPUT.forEach((v, i) => {
            document.querySelectorAll("#inputs input")[i].value = v;
        });
    }

    createRows();
}
