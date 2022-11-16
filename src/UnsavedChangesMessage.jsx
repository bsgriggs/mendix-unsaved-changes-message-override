import { createElement, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./ui/UnsavedChangesMessage.css";

export function UnsavedChangesMessage({ message, discardCaption, cancelCaption, blockExit }) {
    const backOriginal = mx.ui.back;
    const openFormOriginal = mx.ui.openForm;
    const openForm2Original = mx.ui.openForm2;

    useEffect(() => {
        return () => {
            mx.ui.back = backOriginal;
            mx.ui.openForm = openFormOriginal;
            mx.ui.openForm2 = openForm2Original;
        };
    }, []);

    useBeforeunload(event => {
        if (blockExit.value) {
            event.preventDefault();
        }
    });

    const beforeFunc = method =>
        function (...args) {
            if (blockExit.value) {
                mx.ui.confirmation({
                    content: message.value,
                    proceed: discardCaption.value,
                    cancel: cancelCaption.value,
                    handler: function () {
                        mx.ui.back = backOriginal;
                        mx.ui.openForm = openFormOriginal;
                        mx.ui.openForm2 = openForm2Original;
                        method.apply(this, args);
                    }
                });
            } else {
                method.apply(this, args);
                return this;
            }
        };

    mx.ui.back = beforeFunc(mx.ui.back);
    mx.ui.openForm = beforeFunc(mx.ui.openForm);
    mx.ui.openForm2 = beforeFunc(mx.ui.openForm2);
    return <div className="unsaved-changes-message"></div>;
}
