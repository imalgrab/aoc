import { input } from "./day01-input";

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

function parseInputB(): [Map<number, number>, Map<number, number>] {
  const leftAppearances: Map<number, number> = new Map();
  const rightAppearances: Map<number, number> = new Map();

  for (const line of input.split("\n")) {
    const [first, second] = line.split("  ");
    const firstNumber = Number(first);
    const secondNumber = Number(second);

    if (!leftAppearances.has(firstNumber)) {
      leftAppearances.set(firstNumber, firstNumber);
    } else {
      const currentValue = leftAppearances.get(firstNumber) as number;
      leftAppearances.set(firstNumber, currentValue + firstNumber);
    }

    if (!rightAppearances.has(secondNumber)) {
      rightAppearances.set(secondNumber, 1);
    } else {
      const currentValue = rightAppearances.get(secondNumber) as number;
      rightAppearances.set(secondNumber, currentValue + 1);
    }
  }

  return [leftAppearances, rightAppearances];
}

function solveB(
  leftAppearances: Map<number, number>,
  rightAppearances: Map<number, number>
): number {
  let result = 0;

  for (const [number, sumAppearance] of leftAppearances) {
    const rightAppearance = rightAppearances.get(number) ?? 0;
    result += sumAppearance * rightAppearance;
  }

  return result;
}

const inputB = parseInputB();
const solutionB = solveB(...inputB);

console.log({ solutionB });
