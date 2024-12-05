import { input } from "./input";

const NEXT_CHAR = {
  X: "M",
  M: "A",
  A: "S",
  S: ".",
} as const;

const DIRECTIONS = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
] as const;

type Position = [number, number];

type Node = {
  character: "X" | "M" | "A" | "S";
  direction: [number, number];
  position: Position;
};

function parseInput(input: string): string[][] {
  return input.split("\n").map((line) => line.split(""));
}

function getStartPositions(
  character: "X" | "A",
  inputArray: string[][]
): Position[] {
  const xPositions: Position[] = [];

  for (let i = 0; i < inputArray.length; i++) {
    for (let j = 0; j < inputArray[i].length; j++) {
      if (inputArray[i][j] === character) {
        xPositions.push([i, j]);
      }
    }
  }

  return xPositions;
}

function checkIfOutOfBounds(x: number, y: number, n: number, m: number) {
  return x < 0 || x >= n || y < 0 || y >= m;
}

function getValidXNeighbours(
  xPositions: Position[],
  inputArray: string[][]
): Node[] {
  const nodes: Node[] = [];
  const n = inputArray.length;
  const m = inputArray[0].length;

  for (const [x, y] of xPositions) {
    for (const [i, j] of DIRECTIONS) {
      const outOfBounds = checkIfOutOfBounds(x + i, y + j, n, m);

      if (!outOfBounds) {
        const character = inputArray[x + i][y + j];

        if (character === NEXT_CHAR["X"]) {
          nodes.push({
            direction: [i, j],
            character,
            position: [x + i, y + j],
          });
        }
      }
    }
  }

  return nodes;
}

function countXmas(xNeighbours: Node[], inputArray: string[][]) {
  let times = 0;
  const n = inputArray.length;
  const m = inputArray[0].length;

  while (xNeighbours.length > 0) {
    const head = xNeighbours.pop()!;

    if (head.character === "S") {
      times++;
    } else {
      const [x, y] = head.position;
      const [i, j] = head.direction;

      const outOfBounds = checkIfOutOfBounds(x + i, y + j, n, m);

      if (
        !outOfBounds &&
        inputArray[x + i][y + j] === NEXT_CHAR[head.character]
      ) {
        xNeighbours.push({
          character: NEXT_CHAR[head.character],
          direction: [i, j],
          position: [x + i, y + j],
        });
      }
    }
  }

  return times;
}

const inputArray = parseInput(input);
const xPositions = getStartPositions("X", inputArray);
const xNeighbours = getValidXNeighbours(xPositions, inputArray);
const partOne = countXmas(xNeighbours, inputArray);
console.log({ partOne });

function getAdjacentPositions(
  x: number,
  y: number,
  n: number,
  m: number
): Position[] | null {
  if (x === 0 || x === n - 1 || y === 0 || y === m - 1) {
    return null;
  }

  return [
    [x - 1, y + 1], // upper right
    [x + 1, y + 1], // lower right
    [x - 1, y - 1], // upper left
    [x + 1, y - 1], // lower left
  ];
}

function countBigXmas(aPositions: Position[], inputArray: string[][]) {
  let count = 0;
  const n = inputArray.length;
  const m = inputArray[0].length;

  for (const [x, y] of aPositions) {
    const adjacentPositions = getAdjacentPositions(x, y, n, m);

    if (adjacentPositions !== null) {
      const [upperRight, lowerRight, upperLeft, lowerLeft] = adjacentPositions;

      const characterUR = inputArray[upperRight[0]][upperRight[1]];
      const characterLL = inputArray[lowerLeft[0]][lowerLeft[1]];

      const characterUL = inputArray[upperLeft[0]][upperLeft[1]];
      const characterLR = inputArray[lowerRight[0]][lowerRight[1]];

      if (
        ((characterUR === "M" && characterLL === "S") ||
          (characterUR === "S" && characterLL === "M")) &&
        ((characterUL === "M" && characterLR === "S") ||
          (characterUL === "S" && characterLR === "M"))
      ) {
        count++;
      }
    }
  }

  return count;
}

const aPositions = getStartPositions("A", inputArray);
const partTwo = countBigXmas(aPositions, inputArray);
console.log({ partTwo });
