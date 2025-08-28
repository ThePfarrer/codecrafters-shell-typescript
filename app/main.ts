import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Uncomment this block to pass the first stage
function prompt() {
  rl.question("$ ", (answer: string) => {
    console.log(`${answer}: command not found`);
    prompt();
  });
}

prompt();