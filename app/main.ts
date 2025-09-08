import { execSync } from "child_process";
import * as fs from "fs";
import { createInterface } from "readline";

const PATH = process.env.PATH ? process.env.PATH.split(":") : [];
const HOME = process.env.HOME
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const searchPath = (command: string): [boolean, string] => {
  for (const dir of PATH) {
    const fullPath = `${dir}/${command}`
    if (fs.existsSync(fullPath) && isExecutable(fullPath)) {
      return [true, fullPath]
    }
  }
  return [false, ""]
}

const isExecutable = (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true
  } catch (err) {
    return false
  }
}

const handleEcho = (args: string[]): void => {
  console.log(args.join(" "));

}

const handleExit = (args: string[]): void => {
  const exitCode = parseInt(args[0]) || 0
  process.exit(exitCode)
}

const handlePwd = (): void => {
  console.log(process.cwd())
}

const handleType = (args: string[]): void => {
  const command = args[0]
  if (!command) return

  const builtins = ["echo", "exit", "type", "pwd", "cd"]
  if (builtins.includes(command)) {
    console.log(`${command} is a shell builtin`)
    return
  }

  const [found, fullPath] = searchPath(command)
  if (found) {
    console.log(`${command} is ${fullPath}`)
  } else { console.log(`${command}: not found`) }
}

const handleCd = (args: string[]): void => {
  let dirPath = args.join(" ")
  if (!dirPath) {
    // No directory provided, default to HOME
    dirPath = HOME || process.cwd();
  }
  if (dirPath.startsWith("~")) {
    dirPath = `${HOME}${dirPath.slice(1)}`
  }
  try {
    process.chdir(dirPath)
  } catch (err) {
    console.log(`cd: ${dirPath}: No such file or directory`)
  }

}

const handleExternalCommand = (command: string, fullInput: string): void => {
  const [found] = searchPath(command)
  if (found) {
    try {
      const result = execSync(fullInput, { encoding: "utf-8" }).trim()
      console.log(result)
    }
    catch (err) {
    }
  }
  else { console.log(`${command}: command not found`) }
}

const executeCommand = (input: string): void => {
  const [command, ...args] = input.trim().split(" ");
  switch (command) {
    case "":
      break
    case "exit":
      handleExit(args)
      break
    case "echo":
      handleEcho(args)
      break;
    case "type":
      handleType(args)
      break;
    case "pwd":
      handlePwd()
      break;
    case "cd":
      handleCd(args)
      break;
    default:
      handleExternalCommand(command, input)
  }
}


// Uncomment this block to pass the first stage
const prompt = (): void => {
  rl.question("$ ", (answer: string) => {
    executeCommand(answer)
    prompt()
  });
};

prompt();