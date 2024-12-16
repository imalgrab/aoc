import { file } from "bun";

function parsePairToKey(pair: [number, number]) {
  const [first, second] = pair;
  return `${first}, ${second}`;
}

async function parseInput() {
  const text = await file(`${import.meta.dir}/input.txt`).text();
  return text.split(" ").map((n) => Number(n));
}

function updateStone(stone: number): [number] | [number, number] {
  if (stone === 0) {
    return [1];
  }

  const numOfDigits = stone.toString().length;

  if (numOfDigits % 2 === 0) {
    const stoneDigits = stone.toString();
    const left = stoneDigits.slice(0, numOfDigits / 2);
    const right = stoneDigits.slice(numOfDigits / 2);
    return [Number(left), Number(right)];
  }

  return [stone * 2024];
}

function performBlink(currentStones: number[]): number[] {
  const newStones: number[] = [];

  for (const stone of currentStones) {
    const stoneUpdate = updateStone(stone);
    newStones.push(...stoneUpdate);
  }

  return newStones;
}

function countStonesAfterBlinks(initialStones: number[], blinks: number) {
  let currentStones = [...initialStones];

  for (let i = 0; i < blinks; i++) {
    currentStones = performBlink(currentStones);
  }

  return currentStones.length;
}

let initialStones = await parseInput();
const partOne = countStonesAfterBlinks(initialStones, 40);
console.log({ partOne });
