import { DEFAULT_INPUT } from "./scripts/constants.js";
import { $id, $in, $qa, $qfn, updateValues } from "./scripts/helpers.js";
import { createRows, updateRowCount } from "./scripts/table.js";

const { invoke } = window.__TAURI__.tauri;

window.onload = () => {
    $qfn("#inputs input", () => updateValues());
    $qfn("#table-settings input:not(:last-child)", () => createRows());
    $qfn("#table-settings input:last-child", () => updateRowCount());

    $id("clear-inputs").onclick = () => {
        $qa("#inputs input").forEach(e => e.value = "");
    };

    $id("reset-inputs").onclick = () => {
        DEFAULT_INPUT.forEach((v, i) => $qa("#inputs input")[i].value = v);
    }

    updateValues();
}
