import CodeMirror from 'codemirror'
import registerElixirMode from 'codemirror-mode-elixir'
import channel from "./socket"
import {success, error} from "./notifications";

let CODE = "test"
let SELECTED_MODULE = undefined
let editor = CodeMirror.fromTextArea(document.getElementById("editor"),
    {
        mode: "elixir",
        theme: "monokai",
        lineNumbers: true,
        value: CODE,
    })

CodeMirror.commands.save = function(){
    console.log(editor.getValue())
    channel.push("update_actor", {"name": SELECTED_MODULE, "actor_code": editor.getValue()})
        .receive("ok", resp => {
            success("Code saved for module: " + SELECTED_MODULE)
            console.log("Resp:", resp)
        })
        .receive("error", resp => {
            error("Unable to update module code")
            console.log("Unable to update module code: [" + SELECTED_MODULE + "]. Error: ", resp)
        })
}

export function show_code(module) {
    SELECTED_MODULE = module
    channel.push("get_actor_code", {"name": module})
        .receive("ok", resp => {
            console.log("Resp:", resp)
            editor.setValue(resp.code)
            $('#code-editor-modal').modal('open')
            editor.refresh()
        })
        .receive("error", resp => {
            error("Unable to get code for module")
            console.log("Unable to get code for module: [" + module + "]. Error: ", resp)
        })

}
