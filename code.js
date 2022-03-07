// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 250, height: 250, title: "Label Creator" });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    console.log(msg);
    if (msg.type == "label") {
        // One way of distinguishing between different types of messages sent from
        // your HTML page is to use an object with a "type" property like this.
        if (msg.data.value !== "none") {
            let selection = figma.currentPage.selection.slice();
            let index = parseInt(msg.data.value);
            console.log(index);
            let colors = [
                { r: 0, g: 1, b: 0 },
                { r: 1, g: 1, b: 0 },
                { r: 0, g: 0, b: 1 },
                { r: 1, g: 0, b: 0 }, //Deprecated
            ];
            let titles = ["SOT", "Previous", "A/B Test", "Deprecated"];
            let frame = selection[0];
            if (frame) {
                frame.strokes = [{ type: "SOLID", color: colors[index] }];
                frame.strokeWeight = 5;
                if (msg.data.date !== "") {
                    frame.name = titles[index].concat(" - ", msg.data.date);
                }
                else {
                    frame.name = titles[index];
                }
            }
            else {
                figma.notify("No frame was selected");
            }
        }
        else {
            figma.notify("You should select a type of label");
        }
        // Make sure to close the plugin when you're done. Otherwise the plugin will
        // keep running, which shows the cancel button at the bottom of the screen.
        figma.closePlugin();
    }
    else {
        figma.closePlugin();
    }
};
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === "undefined" ||
        type === "number" ||
        type === "string" ||
        type === "boolean") {
        return val;
    }
    else if (type === "object") {
        if (val instanceof Array) {
            return val.map((x) => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw "unknown";
}
