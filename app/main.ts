import { execSync } from "child_process";
import * as fs from "fs";
import { createInterface } from "readline";

const PATH = process.env.PATH ? process.env.PATH.split(":") : [];
const HOME = process.env.HOME
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const isBuiltin = (cmd: string) => {
  switch (cmd) {
    case "cd":
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

const searchPath = (command: string): [boolean, string] => {
  for (const path of PATH) {
    const fullPath = `${path}/${command}`
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
      let dirPath = args.join(" ")
      if (dirPath.startsWith("~")) {
        dirPath = `${HOME}${dirPath.slice(1)}`
      }
      try {
        process.chdir(dirPath)
      } catch (err) {
        console.log(`cd: ${dirPath}: No such file or directory`)
      }
      break;
    default:
      const [found, fullPath] = searchPath(command)
      if (found) {
        try {
          const result = execSync(input).toString().trim()
          console.log(result)
        }
        catch (err) {
        }
      }
      else { console.log(`${command}: command not found`) }
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