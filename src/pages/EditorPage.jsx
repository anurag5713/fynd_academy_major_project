
    
import React, { useState, useRef, useEffect } from "react";
import ACTIONS from "../Actions";
import Client from "../components/core/editor/Client";
import Editor from "../components/core/editor/Editor";
import logo from "../assets/logo.png";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputBoxValue, setInputBoxValue] = useState("");

  useEffect(() => {
    const init = async () => {
      // Initialize socket connection
      socketRef.current = await initSocket();

      // Handle socket connection errors
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      // Join the room on socket connection
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });

      // Listening for message
      socketRef.current.on(ACTIONS.SEND_MESSAGE, ({ message }) => {
        const chatWindow = document.getElementById("chatWindow");
        var currText = chatWindow.value;
        currText += message;
        chatWindow.value = currText;
        chatWindow.scrollTop = chatWindow.scrollHeight;
      });

      // Chatgpt
      socketRef.current.on(ACTIONS.SEND_MESSAGE, ({ message }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    };

    init();

    // Cleanup on component unmount
    const currentSocket = socketRef.current;
    return () => {
      if (currentSocket) {
        currentSocket.off(ACTIONS.JOINED);
        currentSocket.off(ACTIONS.DISCONNECTED);
        currentSocket.off(ACTIONS.SEND_MESSAGE);
        currentSocket.disconnect();
      }
    };
  }, [socketRef, roomId, location.state, reactNavigator]);

  // Function to copy the room ID to clipboard
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the room id");
      console.error(err);
    }
  }

  // Function to leave the room and navigate to the home page
  function leaveRoom() {
    reactNavigator("/");
  }

  // Function to handle clicking on the input area
  const inputClicked = () => {
    const inputArea = document.getElementById("input");
    inputArea.placeholder = "Enter your input here";
    inputArea.value = "";
    inputArea.disabled = false;
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    inputLabel.classList.remove("notClickedLabel");
    inputLabel.classList.add("clickedLabel");
    outputLabel.classList.remove("clickedLabel");
    outputLabel.classList.add("notClickedLabel");
  };

  // Function to handle clicking on the output area
  const outputClicked = () => {
    const inputArea = document.getElementById("input");
    inputArea.placeholder =
      "You output will appear here, Click 'Run code' to see it";
    inputArea.value = "";
    inputArea.disabled = true;
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    inputLabel.classList.remove("clickedLabel");
    inputLabel.classList.add("notClickedLabel");
    outputLabel.classList.remove("notClickedLabel");
    outputLabel.classList.add("clickedLabel");
  };

  // Function to run the code
  const runCode = () => {
    const lang = document.getElementById("languageOptions").value;
    const input = document.getElementById("input").value;
    const code = codeRef.current;

    toast.loading("Running Code....");

    const encodedParams = new URLSearchParams();
    encodedParams.set("LanguageChoice", lang);
    encodedParams.set("Program", code);
    encodedParams.set("Input", input);

    const options = {
      method: "POST",
      url: "https://code-compiler.p.rapidapi.com/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "1c2f607fecmsh3207f1e62ae9f06p186c5fjsn011f82c49e66",
        "X-RapidAPI-Host": "code-compiler.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("response of code compilation:",response);
        let message = response.data.Result;
        console.log("message of output:", message);
        if (message === null) {
          message = response.data.Errors;
        }
        console.log("message of output:", message);

        outputClicked();
        document.getElementById("input").value = message;
        toast.dismiss();
        toast.success("Code compilation complete");
      })
      .catch(function (error) {
        toast.dismiss();
        toast.error("Code compilation unsuccessful");
        document.getElementById("input").value =
          "Something went wrong, Please check your code and input.";
      });
  };

  // Function to send a chat message
  const sendMessage = () => {
    if (document.getElementById("inputBox").value === "") return;
    var message = `>${location.state.username}:\n${document.getElementById("inputBox").value}\n`;
    const chatWindow = document.getElementById("chatWindow");
    var currText = chatWindow.value;
    currText += message;
    chatWindow.value = currText;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    document.getElementById("inputBox").value = "";

    // Emitting chat message to the server
    socketRef.current.emit(ACTIONS.SEND_MESSAGE, { roomId, message });
  };

  // Function to handle pressing Enter in the chat input
  const handleInputEnter = (key) => {
    if (key.code === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="mainWrap bg-richblack-900">
      {/* Aside Section */}
      <div className="asideWrap">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={logo} alt="CodeMate" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} size={"50"} />
            ))}
          </div>
        </div>
        {/* Language Selection and Buttons */}
        <label>
          Select Language:
          <select id="languageOptions" className="seLang text-black" defaultValue="17">
            {/* Options for different programming languages */}
            <option value="1">C#</option>
            <option value="4">Java</option>
            <option value="5">Python</option>
            <option value="6">C (gcc)</option>
            <option value="7">C++ (gcc)</option>
            <option value="8">PHP</option>
            <option value="11">Haskell</option>
            <option value="12">Ruby</option>
            <option value="13">Perl</option>
            <option value="17">Javascript</option>
            <option value="20">Golang</option>
            <option value="21">Scala</option>
            <option value="37">Swift</option>
            <option value="38">Bash</option>
            <option value="43">Kotlin</option>
            <option value="60">TypeScript</option>
          </select>
        </label>
        <button className="btn runBtn" onClick={runCode}>
          Run Code
        </button>
        <button className="btn copyBtn text-black" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      {/* Editor Section */}
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
            setCode(code);
          }}
          initialCode={code}
        />
        {/* Input/Output Container */}
        <div className="IO-container">
          <label
            id="inputLabel"
            className="clickedLabel"
            onClick={inputClicked}
          >
            Input
          </label>
          <label
            id="outputLabel"
            className="notClickedLabel"
            onClick={outputClicked}
          >
            Output
          </label>
        </div>
        {/* Input Textarea */}
        <textarea
          id="input"
          className="inputArea textarea-style "
          placeholder="Enter your input here"
        ></textarea>
      </div>

      {/* Chat Section */}
      <div className="chatWrap">
        {/* Chat Window */}
        <textarea
          id="chatWindow"
          className="chatArea textarea-style"
          placeholder="Chat messages will appear here"
          disabled
          value={messages.join('\n')}
        ></textarea>
        {/* Send Message Section */}
        <div className="sendChatWrap">
          <input
            id="inputBox"
            type="text"
            placeholder="Type your message here"
            className="inputField"
            value={inputBoxValue}
            onChange={(e) => setInputBoxValue(e.target.value)}
            onKeyUp={handleInputEnter}
          ></input>
          <button className="btn sendBtn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;



