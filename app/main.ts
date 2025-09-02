import * as fs from "fs";
import { createInterface } from "readline";

const pathsVar = process.env.PATH?.split(":")

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const isBuiltin = (cmd: string) => {
  switch (cmd) {
    case "exit":
    case "echo":
    case "type":
      console.log(`${cmd} is a shell builtin`)
      break;
    case cmd:
      for (const path of pathsVar) {
        const fullPath = `${path}/${cmd}`
        if (fs.existsSync(fullPath) && isExecutable(fullPath)) {
          console.log(`${cmd} is ${fullPath}`)
          return
        }
      }

    default:
      console.log(`${cmd}: not found`)

  }
}

const isExecutable = (filePath: string) => {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true
  } catch (err) {
    return false
  }
}

// Uncomment this block to pass the first stage
let prompt = () => {
  // console.log(pathsVar)
  rl.question("$ ", (answer: string) => {
    const [first, ...rest] = answer.split(" ");
    switch (first) {
      case "exit":
        rl.close();
        break;
      case "echo":
        console.log(rest.join(" "));
        prompt();
        break;
      case "type":
        isBuiltin(rest[0])
        prompt()
        break;
      default:
        console.log(`${answer}: command not found`);
        prompt();
    }
  });
};

prompt();


