import { argv, spawn } from "bun";
import { parseArgs } from "util";

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

if (day !== undefined) {
  day = day.padStart(2, "0");
}

const dayPath = `day${day}`;
const scriptPath = `${year}/${dayPath}/${dayPath}.ts`;

try {
  spawn({
    cmd: ["bun", "run", scriptPath],
    stdout: "inherit",
    stderr: "inherit",
  });
} catch (err) {
  console.error(`Error: Unable to find or execute ${scriptPath}`);
  process.exit(1);
}
