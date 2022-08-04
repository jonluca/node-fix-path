import process from "node:process";
import { shellPathSync, shellPath } from "shell-path";

const getFallback = () =>
  [
    "./node_modules/.bin",
    "/.nodebrew/current/bin",
    "/usr/local/bin",
    process.env.PATH,
  ].join(":");

export function fixPathSync() {
  if (process.platform === "win32") {
    return;
  }

  process.env.PATH = shellPathSync() || getFallback();
}

export async function fixPath() {
  if (process.platform === "win32") {
    return;
  }
  const path = await shellPath();
  process.env.PATH = path || getFallback();
}
