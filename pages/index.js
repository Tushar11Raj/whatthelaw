import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";
import { app, database } from "firebaseConfig.js";
import { collection, addDoc, getFirestore } from "firebase/firestore";

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
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder="eg. someone hit my car while it was parked. what should i do"
            value={userInput}
            onChange={onUserChangedText}
            onKeyDown={handleKeyDown}
          />
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
              {/* <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div> */}
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
        <div className="footer">
          <p>
            Powered by{" "}
            {/* <a target="_blank" className="links" href="https://nextjs.org/">
              NextJS{" "}
            </a> */}
            <a target="_blank" className="links" href="https://vercel.com/">
              Vercel{" "}
            </a>
            <a
              target="_blank"
              className="links"
              href="https://gpt-index.readthedocs.io/en/latest/index.html"
            >
              LlamaIndex
            </a>
          </p>
          <p>
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
