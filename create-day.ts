import { argv, write, file } from "bun";
import { parseArgs } from "util";
import { mkdir } from "node:fs/promises";

const today = new Date();
const currentDay = today.getDate().toString();
const currentYear = today.getFullYear().toString();

const { values } = parseArgs({
  args: argv,
  options: {
    day: { type: "string", default: currentDay },
    year: { type: "string", default: currentYear },
  },
  allowPositionals: true,
});

let { day, year } = values;

const formattedDay = `day${day?.padStart(2, "0")}`;
const directoryName = `${year}/${formattedDay}`;

try {
  const dirCreated = await mkdir(directoryName, { recursive: true });

  if (dirCreated) {
    console.log(`Created directory ${dirCreated}!`);
  } else {
    console.log(`Directory ${directoryName} already exists!`);
  }

  const dayPath = `${directoryName}/${formattedDay}.ts`;
  const inputPath = `${directoryName}/input.txt`;

  const dayExists = await file(dayPath).exists();
  const inputExists = await file(inputPath).exists();

  if (dayExists) {
    console.log(`Solution file for ${formattedDay} already exists!`);
  } else {
    await write(dayPath, "");
    console.log(`Created solution file for ${formattedDay}`);
  }

  if (inputExists) {
    console.log(`Input file for ${formattedDay} already exists!`);
  } else {
    await write(inputPath, "");
    console.log(`Created input file for ${formattedDay}`);
  }
} catch (error) {
  console.error(`Error creating folder or files: ${error}`);
}
