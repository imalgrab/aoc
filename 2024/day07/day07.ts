import { file } from "bun";

type Equation = {
  testValue: number;
  numbers: number[];
};

async function parseInput(): Promise<Equation[]> {
  const text = await file(`${import.meta.dir}/input.txt`).text();

  return text.split("\n").map((line) => {
    const [testValue, remainingNumbers] = line.split(": ");
    const numbers = remainingNumbers.split(" ").map((n) => Number(n));

    return {
      testValue: Number(testValue),
      numbers,
    };
  });
}

function concat(left: number, right: number) {
  return Number(`${left}${right}`);
}

function getAllResults(numbers: number[], allowConcat?: boolean): number[] {
  let previousResults = [numbers[0]];

  for (let i = 1; i < numbers.length; i++) {
    const currentResults: number[] = [];

    for (const result of previousResults) {
      currentResults.push(result + numbers[i]);
      currentResults.push(result * numbers[i]);

      if (allowConcat) {
        currentResults.push(concat(result, numbers[i]));
      }
    }

    previousResults = [...currentResults];
  }

  return previousResults;
}

function checkEquationFeasible(equation: Equation, allowConcat?: boolean) {
  const { testValue, numbers } = equation;
  const allResults = getAllResults(numbers, allowConcat);

  return allResults.includes(testValue);
}

function findFeasibleEquations(equations: Equation[], allowConcat?: boolean) {
  return equations.filter((equation) =>
    checkEquationFeasible(equation, allowConcat)
  );
}

function solvePartOne(feasibleEquations: Equation[]) {
  return feasibleEquations.reduce((sum, { testValue }) => sum + testValue, 0);
}

const equations = await parseInput();
const feasibleEquations = findFeasibleEquations(equations);
const partOne = solvePartOne(feasibleEquations);
console.log({ partOne });

const feasibleEquationsWithConcat = findFeasibleEquations(equations, true);
const partTwo = solvePartOne(feasibleEquationsWithConcat);
console.log({ partTwo });
