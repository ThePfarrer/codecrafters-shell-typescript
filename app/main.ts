import { execSync } from "child_process";
import * as fs from "fs";
import { createInterface } from "readline";

const PATH = process.env.PATH ? process.env.PATH.split(":") : [];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const isBuiltin = (cmd: string) => {
  switch (cmd) {
    case "echo":
    case "exit":
    case "pwd":
    case "type":
      console.log(`${cmd} is a shell builtin`)
      break;
    default:
      const [found, fullPath] = searchPath(cmd)
      found ? console.log(`${cmd} is ${fullPath}`) : console.log(`${cmd}: not found`)

  }
}

const searchPath = (command: string) => {
  for (const path of PATH) {
    const fullPath = `${path}/${command}`
    if (fs.existsSync(fullPath) && isExecutable(fullPath)) {
      return [true, fullPath]
    }
  }
  return [false, ""]
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
  rl.question("$ ", (answer: string) => {
    const [first, ...rest] = answer.trim().split(" ");
    switch (first) {
      case "":
        prompt()
        break
      case "exit":
        let exitCode = parseInt(rest[0])
        exitCode = Number.isNaN(exitCode) ? 0 : exitCode
        process.exit(exitCode)
      case "echo":
        console.log(rest.join(" "));
        prompt();
        break;
      case "type":
        if (rest[0] !== undefined) {
          isBuiltin(rest[0])
        }
        prompt()
        break;
      case "pwd":
        const currDir = process.cwd()
        console.log(currDir)
        prompt()
        break;
      default:
        const [found, fullPath] = searchPath(first)
        if (found) {
          const result = execSync(answer).toString().trim()
          console.log(result)
        }
        else { console.log(`${first}: command not found`) }
        prompt();
    }
  });
};

prompt();

