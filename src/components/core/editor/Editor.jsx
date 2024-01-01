import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../../Actions";

const Editor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);
  const [isLocalChange, setIsLocalChange] = useState(false);

  useEffect(() => {
    // Initialize CodeMirror editor when component mounts
    async function init() {
      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      // Event listener for local changes in the editor
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();

        // Emit code change to the server when the change is not due to setValue
        if (origin !== "setValue") {
          setIsLocalChange(true);
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }

    init();
  }, []); // This effect runs once on component mount

  useEffect(() => {
    if (socketRef.current) {
      // Listen for code changes from the server
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // Check if the received code is different from the current editor value
        if (code != null && editorRef.current.getValue() !== code && !isLocalChange) {
          // Set the received code in the editor
          editorRef.current.setValue(code);
        }
        setIsLocalChange(false);
      });
    }

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current, isLocalChange]);

  // Render the textarea for CodeMirror
  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
