import { file } from "bun";

type Position = [number, number];

function positionToKey(position: Position) {
  const [x, y] = position;
  return `${x},${y}`;
}

async function parseInput() {
  const text = await file(`${import.meta.dir}/input.txt`).text();
  return text.split("\n").map((line) => line.split(""));
}

function findAntennas(map: string[][]) {
  const antennaPositions = new Map<string, Position[]>();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] !== ".") {
        const positions = antennaPositions.get(map[i][j]) ?? [];
        antennaPositions.set(map[i][j], [...positions, [i, j]]);
      }
    }
  }

  return antennaPositions;
}

function checkIfValid(antinode: Position, mapSize: number) {
  const [x, y] = antinode;
  return x >= 0 && x < mapSize && y >= 0 && y < mapSize;
}

function getValidAntinodes(
  one: Position,
  two: Position,
  mapSize: number,
  resonant?: Boolean
) {
  const antinodePositions: Position[] = [];

  let [x1, y1] = one;
  let [x2, y2] = two;

  let antinodeOne: Position = [2 * x1 - x2, 2 * y1 - y2];
  let firstValid = checkIfValid(antinodeOne, mapSize);

  while (firstValid) {
    antinodePositions.push(antinodeOne);
    [x2, y2] = [x1, y1];
    [x1, y1] = antinodeOne;
    antinodeOne = [2 * x1 - x2, 2 * y1 - y2];
    firstValid = checkIfValid(antinodeOne, mapSize);

    if (!resonant) break;
  }

  [x1, y1] = one;
  [x2, y2] = two;

  let antinodeTwo: Position = [2 * x2 - x1, 2 * y2 - y1];
  let secondValid = checkIfValid(antinodeTwo, mapSize);

  while (secondValid) {
    antinodePositions.push(antinodeTwo);
    [x1, y1] = [x2, y2];
    [x2, y2] = antinodeTwo;
    antinodeTwo = [2 * x2 - x1, 2 * y2 - y1];
    secondValid = checkIfValid(antinodeTwo, mapSize);

    if (!resonant) break;
  }

  return antinodePositions;
}

function findUniqueAntinodes(
  antennaPositions: Map<string, Position[]>,
  mapSize: number,
  resonant?: boolean
) {
  const antinodePositions = new Set<string>();

  for (const [, positions] of antennaPositions) {
    for (let i = 0; i < positions.length; i++) {
      const p1 = positions[i];

      for (let j = i + 1; j < positions.length; j++) {
        const p2 = positions[j];
        const validAntinodes = getValidAntinodes(p1, p2, mapSize, resonant);

        for (const validAntinode of validAntinodes) {
          antinodePositions.add(positionToKey(validAntinode));
        }
      }

      if (resonant && positions.length > 1) {
        antinodePositions.add(positionToKey(p1));
      }
    }
  }

  return antinodePositions;
}

function solvePartOne(map: string[][], resonant?: boolean) {
  const antennas = findAntennas(map);
  const antinodes = findUniqueAntinodes(antennas, map.length, resonant);

  return antinodes.size;
}

const map = await parseInput();
const partOne = solvePartOne(map);
console.log({ partOne });

function solvePartTwo(map: string[][]) {
  return solvePartOne(map, true);
}

const partTwo = solvePartTwo(map);
console.log({ partTwo });
