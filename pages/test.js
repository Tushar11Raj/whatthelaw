import { useState, useEffect, useRef, useMemo } from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import { BiSend } from "react-icons/bi";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);
  const [messageState, setMessageState] = useState({
    messages: [
      {
        message:
          "Hi there its your personal lawyer! What would like help with?",
        type: "apiMessage",
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      Swal.fire({
        title: "Error!",
        text: "Please enter a message.",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
    const question = query.trim();
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
    }));
    setLoading(true);
    setQuery("");

    document.getElementById("input-field").style.height = "24px";
    // console.log("handleSubmit");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          question,
          history,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        Swal.fire({
          title: "Error!",
          text: "Some error occured. Please try after sometime.",
          icon: "error",
          confirmButtonText: "ok",
        });
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log(data.data.text);
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: "apiMessage",
            message: data.data.text,
          },
        ],
      }));
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  function scrollToBottom() {
    chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function handleInputChange(e) {
    const inputLines = e.target.value.split("\n").length;
    setQuery(e.target.value);
    if (inputLines <= 5) {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
  }

  // const chatMessages = useMemo(() => {
  //   return [
  //     ...messages,
  //     ...(pending ? [{ type: "apiMessage", message: pending }] : []),
  //   ];
  // }, [messages, pending]);

  useEffect(() => {
    scrollToBottom();
  }, [messageState]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "95vh",
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

        {messageState.messages.map((message, index) => (
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
              {message.type === "userMessage" ? (
                <FaUser size={16} />
              ) : (
                <FaRobot size={16} />
              )}
            </div>
            <div
              style={{
                backgroundColor:
                  message.type === "userMessage" ? "#f2f2f2" : "#007bff",
                color: message.type === "userMessage" ? "black" : "white",
                padding: "5px 10px",
                borderRadius: "5px",
                alignSelf: "flex-end",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: "75%",
                fontSize: "14px",
              }}
            >
              <ReactMarkdown linkTarget="_blank">
                {message.message}
              </ReactMarkdown>
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
          placeholder={loading ? "AI is thinking..." : "Your question here..."}
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
          value={query}
          onChange={handleInputChange}
        />
        {loading ? (
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
