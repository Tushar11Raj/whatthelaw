import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import { app, database } from "firebaseConfig.js";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { Button } from "react-bootstrap";

const dbInstance = collection(database, "queries");

const Home = () => {
  const [userInput, setUserInput] = useState("");
  var sourceNodes;
  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    // console.log(event.key);
    if (event.key === "Enter") {
      // Submit form
      event.preventDefault();
      callGenerateEndpoint();
    }
  };

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    // console.log(userInput);
    // return;
    if (userInput === "") {
      Swal.fire({
        title: "Error!",
        text: "Query cannot be blank!",
        icon: "error",
        confirmButtonText: "ok",
      });
      return;
    }
    setIsGenerating(true);
    var gptresponse, source_text;
    // console.log("Calling OpenAI...");
    await fetch(
      "https://whatthelaw-server.onrender.com/response/" + userInput,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        gptresponse = data.response;
        sourceNodes = data.source_nodes;

        setApiOutput(`Query: ${userInput} \n ${gptresponse}`);
        addDoc(dbInstance, {
          query: userInput,
          response: gptresponse,
        });
      })
      .then(() => {
        setIsGenerating(false);
        setUserInput("");
      })
      .catch((error) => {
        console.log("[-] error: " + error);
        var errmsg;
        // if (response.status == 500) errmsg = "Internal server error";
        // else errmsg = "Too many requests at the moment! Please try again later.";
        errmsg = "Too many requests at the moment! Please try again later.";
        Swal.fire({
          title: "Error!",
          text: errmsg,
          icon: "error",
          confirmButtonText: "ok",
        });
        setIsGenerating(false);
      });
  };

  return (
    <div className="root">
      <Head>
        <title>whatthelaw</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h3>whatthelaw</h3>
            <p>
              your personal lawyer <span className="blue">powered by AI</span>
            </p>
          </div>
        </div>

        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li
            style={{ paddingLeft: "20px", lineHeight: "2em", color: "white" }}
          >
            <span
              style={{
                paddingRight: "10px",
                color: "green",
                fontWeight: "bold",
              }}
            >
              &#10004;
            </span>
            Chat with AI lawyer
          </li>
          <li
            style={{ paddingLeft: "20px", lineHeight: "2em", color: "white" }}
          >
            <span
              style={{
                paddingRight: "10px",
                color: "green",
                fontWeight: "bold",
              }}
            >
              &#10004;
            </span>
            Trained on IPC, CRPC, Constitution of india
          </li>
          <li
            style={{ paddingLeft: "20px", lineHeight: "2em", color: "white" }}
          >
            <span
              style={{
                paddingRight: "10px",
                color: "green",
                fontWeight: "bold",
              }}
            >
              &#10004;
            </span>
            Understand Terms and conditions of Companies better!
          </li>
        </ul>
        <Button
          href="/chat"
          // target="_blank"
          style={{
            display: "inline-block",
            padding: "10px 15px",
            borderRadius: "20px",
            fontWeight: "600",
            background: "linear-gradient(125deg, #007bff, #28a745)",
            color: "white",
            border: "none",
            textDecoration: "none",
          }}
        >
          chat now
        </Button>
        {/* <div style={{ color: "white" }}>Try this query box for now 👇</div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="eg. which law explains the case about illegal possesion of property."
            value={userInput}
            onChange={onUserChangedText}
            onKeyDown={handleKeyDown}
          />
          <div
            style={{ color: "white", fontSize: "10px", textAlign: "center" }}
          >
            *this is a testing feature. responses may be slow and incorrect.
          </div>
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>help me!</p>
                )}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div> */}
        <div className="footer">
          <p style={{ textAlign: "center" }}>
            Powered by Llama-Index Langchain Supabase
          </p>
          <p style={{ textAlign: "center" }}>
            built by{" "}
            <a
              href="https://twitter.com/imtusharraj"
              target="_blank"
              className="links"
            >
              @imtusharraj
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
