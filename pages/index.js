import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

const Home = () => {
  const [userInput, setUserInput] = useState("");

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

    // console.log("Calling OpenAI...");
    const response = await fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    // console.log(response.status);

    if (response.status != 200) {
      // alert("Too many requests at the moment! Please try again later.");
      Swal.fire({
        title: "Error!",
        text: "Too many requests at the moment! Please try again later.",
        icon: "error",
        confirmButtonText: "ok",
      });
      setIsGenerating(false);
      return;
    }

    const data = await response.json();
    const { output } = data;
    // const temp = output.data;
    // console.log("OpenAI replied...", output);

    setApiOutput(`${output}`);
    setIsGenerating(false);
    setUserInput("");
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
            <a target="_blank" className="links" href="https://nextjs.org/">
              NextJS{" "}
            </a>
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
