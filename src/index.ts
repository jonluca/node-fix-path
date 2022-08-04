import process from "node:process";
import { shellEnv, shellEnvSync } from "./shell-env";
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

  process.env.PATH = shellEnvSync()?.PATH || getFallback();
}

export async function fixPath() {
  if (process.platform === "win32") {
    return;
  }
  const path = await shellEnv();
  process.env.PATH = path?.PATH || getFallback();
}
