import { input } from "./input";

type Rules = Map<number, number[]>;

function parseInput(input: string): [Rules, number[][]] {
  let readingUpdates = false;
  const rules: Rules = new Map();
  const updates: number[][] = [];

  for (const line of input.split("\n")) {
    if (line === "") {
      readingUpdates = true;
    } else if (readingUpdates) {
      updates.push(line.split(",").map(Number));
    } else {
      const [before, after] = line.split("|").map(Number);
      const currentRules = rules.get(before) ?? [];
      rules.set(before, [...currentRules, after]);
    }
  }

  return [rules, updates];
}

function checkIfUpdateInOrder(update: number[], rules: Rules): boolean {
  const visitedPages = new Set<number>();

  for (const page of update) {
    const pagesRequiredAfter = rules.get(page) ?? [];

    for (const pageRequiredAfter of pagesRequiredAfter) {
      if (visitedPages.has(pageRequiredAfter)) {
        return false;
      }
    }

    visitedPages.add(page);
  }

  return true;
}

function getProcessedUpdates(
  updates: number[][],
  rules: Rules
): [number[][], number[][]] {
  const updatesInRightOrder: number[][] = [];
  const updatesToFix: number[][] = [];

  for (const update of updates) {
    const isInOrder = checkIfUpdateInOrder(update, rules);

    if (isInOrder) {
      updatesInRightOrder.push(update);
    } else {
      updatesToFix.push(update);
    }
  }

  return [updatesInRightOrder, updatesToFix];
}

function sumMiddlePageNumbers(updatesInOrder: number[][]) {
  return updatesInOrder.reduce(
    (sum, update) => sum + (update.at(update.length / 2) ?? 0),
    0
  );
}

const [rules, updates] = parseInput(input);
const [updatesInOrder, updatesToFix] = getProcessedUpdates(updates, rules);
const solutionOne = sumMiddlePageNumbers(updatesInOrder);
console.log({ solutionOne });

// part two

function fixUpdate(updateToFix: number[], rules: Rules) {
  function comparePages(pageOne: number, pageTwo: number): number {
    const pageOneRules = rules.get(pageOne) ?? [];
    const pageTwoRules = rules.get(pageTwo) ?? [];

    if (pageOneRules.includes(pageTwo)) return -1;
    if (pageTwoRules.includes(pageOne)) return 1;
    return 0;
  }

  return updateToFix.toSorted(comparePages);
}

function solvePartTwo(updatesToFix: number[][], rules: Rules): number {
  const fixedUpdates = updatesToFix.map((update) => fixUpdate(update, rules));

  return sumMiddlePageNumbers(fixedUpdates);
}

const solutionTwo = solvePartTwo(updatesToFix, rules);
console.log({ solutionTwo });
