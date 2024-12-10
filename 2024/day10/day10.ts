import { file } from "bun";

type Position = [number, number];

const STEPS = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
} as const;

function checkMoveValid(position: Position, mapSize: number) {
  const [x, y] = position;
  return x >= 0 && x < mapSize && y >= 0 && y < mapSize;
}

function getAdjacentPositions(position: Position, mapSize: number): Position[] {
  const positions: Position[] = [];
  const [x1, y1] = position;

  for (const [, vector] of Object.entries(STEPS)) {
    const [x2, y2] = vector;
    const newPosition: Position = [x1 + x2, y1 + y2];
    const isValid = checkMoveValid(newPosition, mapSize);

    if (isValid) {
      positions.push(newPosition);
    }
  }

  return positions;
}

const START = 0;
const END = 9;

async function parseInput() {
  const text = await file(`${import.meta.dir}/input.txt`).text();
  return text.split("\n").map((line) => line.split(""));
}

function findStartingPoints(map: string[][]) {
  const startingPositions: Position[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== ".") {
        const height = Number(map[i][j]);

        if (height === START) {
          startingPositions.push([i, j]);
        }
      }
    }
  }

  return startingPositions;
}

function positionToKey(position: Position) {
  return `${position[0]}, ${position[1]}`;
}

type Node = {
  height: number;
  position: Position;
};

function findTrailheads(
  map: string[][],
  startingPositions: Position[],
  distinct?: boolean
) {
  let sumOfScores = 0;

  for (const startPosition of startingPositions) {
    const visitedEnds = new Set<string>();
    let queue: Node[] = [];
    let sum = 0;

    const startNode: Node = { position: startPosition, height: 0 };
    queue.push(startNode);

    while (queue.length > 0) {
      const { height, position } = queue[0];
      queue = queue.slice(1);

      if (height === END) {
        visitedEnds.add(positionToKey(position));
        sum++;
      } else {
        const adjacentPositions = getAdjacentPositions(position, map.length);

        for (const adjacentPosition of adjacentPositions) {
          const [x, y] = adjacentPosition;

          if (Number(map[x][y]) === height + 1) {
            queue.push({ position: [x, y], height: height + 1 });
          }
        }
      }
    }

    if (distinct) {
      sumOfScores += sum;
    } else {
      sumOfScores += visitedEnds.size;
    }
  }

  return sumOfScores;
}

const map = await parseInput();
const startingPoints = findStartingPoints(map);
const partOne = findTrailheads(map, startingPoints);
console.log({ partOne });

const partTwo = findTrailheads(map, startingPoints, true);
console.log({ partTwo });
