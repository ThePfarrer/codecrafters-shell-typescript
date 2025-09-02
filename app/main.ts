import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
      default:
        console.log(`${answer}: command not found`);
        prompt();
    }
  });
};

prompt();
