import { input } from "./input";

// part 1

function parseInput(): number[][] {
  const reports: number[][] = [];

  for (const line of input.split("\n")) {
    const levels = line.split(" ").map(Number);
    reports.push(levels);
  }

  return reports;
}

function verifyIfSafe(report: number[]) {
  const decreasing = report[0] - report[1] > 0;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    const absDiff = Math.abs(diff);

    if (absDiff === 0 || absDiff > 3) {
      return false;
    }

    if ((decreasing && diff < 0) || (!decreasing && diff > 0)) {
      return false;
    }
  }

  return true;
}

function solve(reports: number[][]) {
  let numOfSafeReports = 0;

  for (const report of reports) {
    const isSafe = verifyIfSafe(report);
    numOfSafeReports += Number(isSafe);
  }

  return numOfSafeReports;
}

const reports = parseInput();
const solutionA = solve(reports);
console.log({ solutionA });

// part 2

function getAllSubreports(report: number[]): number[][] {
  const subreports: number[][] = [];

  for (let i = 0; i < report.length; i++) {
    subreports.push([
      ...report.slice(0, i),
      ...report.slice(i + 1, report.length),
    ]);
  }

  return subreports;
}

function solveB(reports: number[][]) {
  let numOfSafeReports = 0;

  for (const report of reports) {
    let isSafe = verifyIfSafe(report);
    const subreports = getAllSubreports(report);
    let i = 0;

    while (!isSafe && i < subreports.length) {
      isSafe = verifyIfSafe(subreports[i]);
      i++;
    }

    numOfSafeReports += Number(isSafe);
  }

  return numOfSafeReports;
}

const solutionB = solveB(reports);
console.log({ solutionB });
