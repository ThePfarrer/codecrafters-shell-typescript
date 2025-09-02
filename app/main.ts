import { createInterface } from "readline";

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
    default:
      console.log(`${cmd}: not found`)

  }
}

// Uncomment this block to pass the first stage
let prompt = () => {
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


