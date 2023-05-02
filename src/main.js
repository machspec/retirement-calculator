import { DEFAULT_INPUT } from "./scripts/constants.js";
import { getInputValues, getTableSettings, getTotalValue, queryAssignFn } from "./scripts/helpers.js";
import { createRows, updateRowCount } from "./scripts/table.js";

const { invoke } = window.__TAURI__.tauri;

window.onload = () => {
    queryAssignFn("#inputs input", () => console.log(getTableSettings()));
    queryAssignFn("#table-settings input:not(:last-child)", () => console.log(createRows()));
    queryAssignFn("#table-settings input:last-child", () => updateRowCount());

    document.getElementById("clear-inputs").onclick = () => {
        document.querySelectorAll("#inputs input").forEach(e => e.value = "");
    };

    document.getElementById("reset-inputs").onclick = () => {
        DEFAULT_INPUT.forEach((v, i) => {
            document.querySelectorAll("#inputs input")[i].value = v;
        });
        getTotal(getInputValues());
    }

    console.log(`Age ${23 + 37}: $${getTotalValue(37, 1000, 500, 10)}`);
    console.log(`Age ${23 + 42}: $${getTotalValue(42, 1000, 500, 10)}`);

    createRows();
}
