import { input } from "./input";

const instructionRegex = /mul\(\d{1,3},\d{1,3}\)/g;
const multiplyRegex = /\d{1,3}\,\d{1,3}/g;

// part 1

function getInstructionScore(instruction: string) {
  const regexMatch = instruction.match(multiplyRegex);

  if (!regexMatch) {
    return 0;
  }

  const [left, right] = regexMatch[0].split(",").map(Number);
  return left * right;
}

function solveA(memory: string) {
  let result = 0;
  let regexExec: RegExpExecArray | null = null;

  while ((regexExec = instructionRegex.exec(memory)) !== null) {
    const instruction = regexExec[0];
    const score = getInstructionScore(instruction);
    result += score;
  }

  return result;
}

const solutionA = solveA(input);
console.log({ solutionA });

// part 2

const guardsRegex = /do\(\)|don't\(\)|mul\(\d{1,3}\,\d{1,3}\)/g;

function solveB(memory: string) {
  let result = 0;
  let regexExec: RegExpExecArray | null;
  let enabled = true;

  while ((regexExec = guardsRegex.exec(memory)) !== null) {
    const match = regexExec[0];

    if (match === "do()" && !enabled) {
      enabled = true;
    } else if (match === "don't()" && enabled) {
      enabled = false;
    } else if (match !== "do()" && match !== "don't()" && enabled) {
      const score = getInstructionScore(match);
      result += score;
    }
  }

  return result;
}

const solutionB = solveB(input);
console.log({ solutionB });
