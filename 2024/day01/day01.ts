import { input } from "./input";

// part 1

function parseInputA(): [number[], number[]] {
  const leftArray: number[] = [];
  const rightArray: number[] = [];

  for (const line of input.split("\n")) {
    const [first, second] = line.split("   ");
    leftArray.push(Number(first));
    rightArray.push(Number(second));
  }

  return [leftArray.slice().sort(), rightArray.slice().sort()];
}

function solveA(leftArray: number[], rightArray: number[]): number {
  let result = 0;
  const length = leftArray.length;

  for (let i = 0; i < length; i++) {
    const distance = Math.abs(leftArray[i] - rightArray[i]);
    result += distance;
  }

  return result;
}

const inputA = parseInputA();
const solutionA = solveA(...inputA);

console.log({ solutionA });

// part 2

function parseInputB(): [number[], Map<number, number>] {
  const left: number[] = [];
  const right: Map<number, number> = new Map();

  for (const line of input.split("\n")) {
    const [first, second] = line.split("  ");
    const firstNumber = Number(first);
    const secondNumber = Number(second);

    left.push(firstNumber);

    if (!right.has(secondNumber)) {
      right.set(secondNumber, 1);
    } else {
      const currentValue = right.get(secondNumber) as number;
      right.set(secondNumber, currentValue + 1);
    }
  }

  return [left, right];
}

function solveB(left: number[], right: Map<number, number>): number {
  let result = 0;

  for (const num of left) {
    const appearances = right.get(num) ?? 0;
    result += num * appearances;
  }

  return result;
}

const inputB = parseInputB();
const solutionB = solveB(...inputB);

console.log({ solutionB });
