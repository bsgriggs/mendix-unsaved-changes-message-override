import { createElement } from "react";

export function preview({  }) {
    return (<div className="unsaved-changes-message" />); 
}
 
export function getPreviewCss() {
    return require("./ui/UnsavedChangesMessage.css");
}
