import { spawn, argv } from "bun";

const today = new Date();
const currentYear = today.getFullYear().toString();
const currentDay = today.getDate().toString();

if (argv[2] !== undefined && !argv[2].startsWith("--day=")) {
  console.error("Usage: bun run aoc --day=<day> --year=<year>");
  process.exit(1);
}

const day = (argv[2]?.split("=")[1] ?? currentDay)?.padStart(2, "0");
const year = argv[3]?.split("=")[1] ?? currentYear;

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
