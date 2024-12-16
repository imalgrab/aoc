import { file } from "bun";

const FREE_SPACE = "." as const;

async function parseInput() {
  const text = await file(`${import.meta.dir}/input.txt`).text();

  return text.split("").map((n) => Number(n));
}

function getIndividualBlocks(diskMap: number[]) {
  const blocks: string[] = [];

  for (let i = 0; i < diskMap.length; i++) {
    const isFile = i % 2 === 0;
    const currentBlock = isFile ? String(i / 2) : FREE_SPACE;

    blocks.push(...new Array(diskMap[i]).fill(currentBlock));
  }

  return blocks;
}

function getFreeSpacePositions(individualBlocks: string[]) {
  const positions: number[] = [];

  for (let i = 0; i < individualBlocks.length; i++) {
    const block = individualBlocks[i];

    if (block === FREE_SPACE) {
      positions.push(i);
    }
  }

  return positions;
}

function compactAllFiles(individualBlocks: string[], freePositions: number[]) {
  let blocks = individualBlocks.slice();
  let i = blocks.length - 1;
  let j = 0;

  while (j < freePositions.length - 1 && i >= freePositions[j]) {
    const lastBlock = blocks[i];
    const free = freePositions[j];

    if (lastBlock !== FREE_SPACE) {
      blocks[free] = lastBlock;
      blocks[i] = FREE_SPACE;
      j++;
    }

    i--;
  }

  return blocks;
}

function calculateChecksum(compactDisk: string[]) {
  return compactDisk
    .map((n) => Number(n))
    .reduce((sum, size, index) => {
      if (!Number.isNaN(size)) {
        return sum + size * index;
      }

      return sum;
    }, 0);
}

function solvePartOne(denseDiskMap: number[]) {
  const individualBlocks = getIndividualBlocks(denseDiskMap);
  const freeSpacePositions = getFreeSpacePositions(individualBlocks);
  const compactDisk = compactAllFiles(individualBlocks, freeSpacePositions);
  const checksum = calculateChecksum(compactDisk);
  return checksum;
}

const denseDiskMap = await parseInput();
const partOne = solvePartOne(denseDiskMap);
console.log({ partOne });
