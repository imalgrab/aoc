import { file } from "bun";

type Position = [number, number];
type Direction = "U" | "R" | "L" | "D";

const DIRECTIONS: Record<Direction, Position> = {
  U: [-1, 0],
  R: [0, 1],
  L: [0, -1],
  D: [1, 0],
};

const NEXT_DIRECTION: Record<Direction, Direction> = {
  U: "R",
  R: "D",
  D: "L",
  L: "U",
};

const GUARD = "^";
const OBSTACLE = "#";

function getKey(position: Position): string {
  const [x, y] = position;

  return `${x},${y}`;
}

function getPosition(key: string): Position {
  const [x, y] = key.split(",");

  return [Number(x), Number(y)];
}

function parseKeysToPositions(keys: Set<string>): Position[] {
  return [...keys.values()].map((value) => getPosition(value));
}

async function parseInput() {
  const text = await file(`${import.meta.dir}/input.txt`).text();

  return text.split("\n").map((line) => line.split(""));
}

function analyzeMap(map: string[][]): [Position, Set<string>, number] {
  const obstaclePositions = new Set<string>();
  let guardStartPosition: Position = [-1, -1];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] === GUARD) {
        guardStartPosition = [i, j];
      } else if (map[i][j] === OBSTACLE) {
        obstaclePositions.add(getKey([i, j]));
      }
    }
  }

  return [guardStartPosition, obstaclePositions, map.length];
}

function verifyMoveValid(nextPosition: Position, mapSize: number) {
  const [x, y] = nextPosition;

  return x >= 0 && x < mapSize && y >= 0 && y < mapSize;
}

function getGuardDistinctPositions(
  start: Position,
  obstacles: Set<string>,
  mapSize: number
): [Set<string>, boolean] {
  const visitedPositions = new Set<string>();
  const visitedObstacles = new Map<string, Direction | null>();

  let currentPosition = start;
  let direction: Direction = "U";
  let hasNextMove = true;

  while (hasNextMove) {
    const currentKey = getKey(currentPosition);
    visitedPositions.add(currentKey);

    const [x, y] = currentPosition;
    const [i, j] = DIRECTIONS[direction];
    const nextPosition: Position = [x + i, y + j];
    const nextMoveValid = verifyMoveValid(nextPosition, mapSize);

    if (!nextMoveValid) {
      return [visitedPositions, false];
    }

    const nextKey = getKey(nextPosition);
    const isObstacle = obstacles.has(nextKey);

    if (!isObstacle) {
      currentPosition = nextPosition;
    } else {
      const obstacleVisitedFrom = visitedObstacles.get(nextKey) ?? null;

      if (obstacleVisitedFrom === direction) {
        return [visitedPositions, true];
      }

      visitedObstacles.set(nextKey, direction);
      direction = NEXT_DIRECTION[direction];
    }
  }

  return [visitedPositions, false];
}

const map = await parseInput();
const mapAnalysis = analyzeMap(map);
const [distinctPositions] = getGuardDistinctPositions(...mapAnalysis);
console.log({ partOne: distinctPositions.size });

function countPossibleLoops(
  startPosition: Position,
  obstaclePositions: Set<string>,
  mapSize: number,
  guardPositions: Set<string>
) {
  let result = 0;
  const positions = parseKeysToPositions(guardPositions).filter(
    ([x, y]) => x !== startPosition[0] || y !== startPosition[1]
  );

  for (const position of positions) {
    let currentObstacles = new Set([...obstaclePositions]);
    currentObstacles.add(getKey(position));

    const [, loop] = getGuardDistinctPositions(
      startPosition,
      currentObstacles,
      mapSize
    );

    result += Number(loop);
  }

  return result;
}

const partTwo = countPossibleLoops(...mapAnalysis, distinctPositions);
console.log({ partTwo });
