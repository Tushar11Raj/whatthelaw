import { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
import { BiSend } from "react-icons/bi";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBottomRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  function resolveAfter2Seconds() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("resolved");
      }, 2000);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") {
      return;
    }
    setIsLoading(true);
    // setMessages([...messages, { author: "user", message: input }]);
    setInput("");

    document.getElementById("input-field").style.height = "24px";
    setMessages((messages) => [
      ...messages,
      { author: "user", message: input },
    ]);
    const result = await resolveAfter2Seconds();
    // const response = await openai.complete({
    //   engine: 'davinci',
    //   prompt: input,
    //   maxTokens: 100,
    //   n: 1,
    //   stop: '\n',
    // });

    setMessages((messages) => [
      ...messages,
      { author: "agent", message: result },
    ]);
    setIsLoading(false);
  };

  function scrollToBottom() {
    chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function handleInputChange(e) {
    const inputLines = e.target.value.split("\n").length;
    setInput(e.target.value);
    if (inputLines <= 5) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* <div className="chat-header">Chat with lawyer</div> */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          padding: "20px",
        }}
      >
        <div className="chat-title-container">
          <div className="chat-title">
            whatthelaw<span style={{ color: "#007bff" }}> Chat</span>
          </div>
          <div>Chat with your personal lawyer. Powered by AI</div>
          <div
            style={{
              display: "inline-block",
              padding: "5px 10px",
              margin: "10px",
              borderRadius: "20px",
              fontWeight: "600",
              background: "linear-gradient(125deg, #007bff, #28a745)",
              color: "white",
            }}
          >
            Beta
          </div>
          <div>Trained on:</div>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            <li style={{ paddingLeft: "20px", lineHeight: "2em" }}>
              <span
                style={{
                  paddingRight: "10px",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                &#10004;
              </span>
              The Indian Penal Code
            </li>
            <li style={{ paddingLeft: "20px", lineHeight: "2em" }}>
              <span
                style={{
                  paddingRight: "10px",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                &#10004;
              </span>
              Code of Criminal Procedure
            </li>
            <li style={{ paddingLeft: "20px", lineHeight: "2em" }}>
              <span
                style={{
                  paddingRight: "10px",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                &#10004;
              </span>
              Constitution of India
            </li>
          </ul>
          <div>...more coming soon</div>
        </div>

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                marginRight: "10px",
              }}
            >
              {message.author === "user" ? (
                <FaUser size={16} />
              ) : (
                <FaRobot size={16} />
              )}
            </div>
            <div
              style={{
                backgroundColor:
                  message.author === "user" ? "#f2f2f2" : "#007bff",
                color: message.author === "user" ? "black" : "white",
                padding: "5px 10px",
                borderRadius: "5px",
                alignSelf: "flex-end",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: "75%",
                fontSize: "14px",
              }}
            >
              {message.message}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "flex-end", padding: "20px" }}
      >
        <textarea
          id="input-field"
          placeholder="Type your message here..."
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "none",
            overflowWrap: "break-word",
            height: "24px",
            fontSize: "14px",
          }}
          value={input}
          onChange={handleInputChange}
        />
        {isLoading ? (
          <span style={{ height: "24px", width: "24px", padding: "5px" }}>
            <span className="loader-blue"></span>
          </span>
        ) : (
          <button
            type="submit"
            style={{
              padding: "5px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            <BiSend size={24} />
          </button>
        )}
      </form>
    </div>
  );
}
