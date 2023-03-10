const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const openai_key = process.env.openai_key;
export default async function handler(req, res) {
  console.log("[+] input: " + req.body.userInput);
  try {
    const { spawn } = require("child_process");

    const runPythonScript = async () => {
      const python = spawn(
        "python",
        ["./pages/api/python/script.py", openai_key, req.body.userInput],
        {
          timeout: 20000,
        }
      );

      var flag = false;
      var output;
      for await (const data of python.stdout) {
        console.log(`[+] stdout: ${data}`);
        flag = true;
        output = data;
      }

      for await (const data of python.stderr) {
        console.log(`[-] stderr: ${data}`);
      }

      if (flag) {
        res.status(200).json({ output: output.toString() });
      } else {
        res.status(501).send({ error: "OpenAI error" });
      }
    };
    runPythonScript();
  } catch (error) {
    console.log("[-] error: " + error);
    res.status(500).send({ error: "Internal server error" });
  }
}
