import { createElement, useEffect } from "react";
import { useBeforeunload } from "react-beforeunload";
import "./ui/UnsavedChangesMessage.css";

const backOriginal = mx.ui.back;
const openPageOriginal = mx.ui.openPage;
const openFormOriginal = mx.ui.openForm;
const openForm2Original = mx.ui.openForm2;
const contentFormOriginal = mx.ui.getContentForm;

const callMxAction = action => {
    if (action !== undefined && action.canExecute && action.isExecuting === false) {
        action.execute();
    }
};

const discardChanges = discardAction => {
    callMxAction(discardAction);
    mx.ui.back = backOriginal;
    mx.ui.openForm = openFormOriginal;
    mx.ui.openForm2 = openForm2Original;
    mx.ui.getContentForm = contentFormOriginal;
};

// Advice function
const beforeFunc = (method, blocked, message, discardCaption, discardAction, cancelCaption) =>
    function (...args) {
        console.info("before", { this: this, method, blocked, message, discardCaption, discardAction, cancelCaption });
        if (blocked) {
            mx.ui.confirmation({
                content: message,
                proceed: discardCaption,
                cancel: cancelCaption,
                handler: function () {
                    discardChanges(discardAction);
                    method.apply(this, args);
                }
            });
        } else {
            method.apply(this, args);
        }
    };

export function UnsavedChangesMessage({ message, discardCaption, cancelCaption, blockExit, discardAction }) {
    //Override / restore mx.ui functions on widget render
    useEffect(() => {
        if (
            message.status === "available" &&
            discardCaption.status === "available" &&
            cancelCaption.status === "available" &&
            blockExit.status === "available"
        ) {
            console.info("Use Effect - override functions");
            if (mx.ui.back !== undefined) {
                mx.ui.back = beforeFunc(
                    backOriginal,
                    blockExit.value,
                    message.value,
                    discardCaption.value,
                    cancelCaption.value
                );
            }
            if (mx.ui.openPage !== undefined) {
                mx.ui.openPage = beforeFunc(
                    openPageOriginal,
                    blockExit.value,
                    message.value,
                    discardCaption.value,
                    discardAction,
                    cancelCaption.value
                );
            }
            if (mx.ui.openForm !== undefined) {
                mx.ui.openForm = beforeFunc(
                    openFormOriginal,
                    blockExit.value,
                    message.value,
                    discardCaption.value,
                    discardAction,
                    cancelCaption.value
                );
            }
            if (mx.ui.openForm2 !== undefined) {
                mx.ui.openForm2 = beforeFunc(
                    openForm2Original,
                    blockExit.value,
                    message.value,
                    discardCaption.value,
                    discardAction,
                    cancelCaption.value
                );
            }
            if (mx.ui.getContentForm !== undefined) {
                if (mx.ui.getContentForm().close !== undefined) {
                    mx.ui.getContentForm().close = beforeFunc(
                        contentFormOriginal,
                        blockExit.value,
                        message.value,
                        discardCaption.value,
                        discardAction,
                        cancelCaption.value
                    );
                }
                if (mx.ui.getContentForm().closePage !== undefined) {
                    mx.ui.getContentForm().closePage = beforeFunc(
                        contentFormOriginal,
                        blockExit.value,
                        message.value,
                        discardCaption.value,
                        discardAction,
                        cancelCaption.value
                    );
                }
            }
        }
        return () => {
            console.info("use effect - reset functions");
            if (mx.ui.back !== undefined) {
                mx.ui.back = backOriginal;
            }
            if (mx.ui.openPage !== undefined) {
                mx.ui.openPage = openPageOriginal;
            }
            if (mx.ui.openForm !== undefined) {
                mx.ui.openForm = openFormOriginal;
            }
            if (mx.ui.openForm2 !== undefined) {
                mx.ui.openForm2 = openForm2Original;
            }
            if (mx.ui.getContentForm !== undefined) {
                mx.ui.getContentForm = contentFormOriginal;
            }
        };
    }, [message, discardCaption, cancelCaption, blockExit]);

    //Browser tab close
    useBeforeunload(event => {
        if (blockExit.value) {
            event.preventDefault();
        }
    });

    return <div className="unsaved-changes-message"></div>;
}
