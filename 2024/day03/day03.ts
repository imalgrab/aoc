import { input } from "./input";

const instructionRegex = /mul\(\d{1,3},\d{1,3}\)/g;
const multiplyRegex = /\d{1,3}\,\d{1,3}/g;

// part 1

function getUncorruptedInstructions(memory: string) {
  const uncorruptedInstructions: string[] = [];
  let result: RegExpExecArray | null;

  while ((result = instructionRegex.exec(memory)) !== null) {
    const instruction = result[0];
    uncorruptedInstructions.push(instruction);
  }

  return uncorruptedInstructions;
}

function solve(uncorruptedInstructions: string[]) {
  let result = 0;

  for (const instruction of uncorruptedInstructions) {
    const match = instruction.match(multiplyRegex);
    if (match) {
      const [left, right] = match[0].split(",").map(Number);
      result += left * right;
    }
  }

  return result;
}

const uncorruptedInstructions = getUncorruptedInstructions(input);
const solutionA = solve(uncorruptedInstructions);
console.log({ solutionA });

// part 2

const dontRegex = /don\'t\(\)/g;
const doRegex = /do\(\)/g;

function getAvailableInstructions(memory: string) {
  let result: RegExpExecArray | null;
  const dontIndices: number[] = [];
  let doIndices: number[] = [];

  while ((result = dontRegex.exec(memory)) !== null) {
    dontIndices.push(dontRegex.lastIndex);
  }

  while ((result = doRegex.exec(memory)) !== null) {
    doIndices.push(doRegex.lastIndex);
  }

  const unavailableIndices: [number, number][] = [];
  let doMaxGuard = -1;

  for (const removeFrom of dontIndices) {
    let removeTo: number | null = null;

    if (removeFrom > doMaxGuard) {
      let j = 0;

      while (removeTo === null && j < doIndices.length) {
        const doIndex = doIndices[j];

        if (doIndex > removeFrom) {
          removeTo = doIndex;
          doMaxGuard = doIndex;
          unavailableIndices.push([removeFrom, removeTo]);
          doIndices = doIndices.slice(j + 1);
        } else {
          j++;
        }
      }
    }
  }

  let resultMemory = "";
  let prevIndex = 0;

  for (const unavailability of unavailableIndices) {
    const [start, end] = unavailability;
    resultMemory += memory.substring(prevIndex, start);
    prevIndex = end;
  }

  resultMemory += memory.substring(prevIndex);
  return resultMemory;
}

const inputB = getAvailableInstructions(input);
const uncorruptedInstructionsB = getUncorruptedInstructions(inputB);
const solutionB = solve(uncorruptedInstructionsB);
console.log({ solutionB });
