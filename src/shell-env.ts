import process from "node:process";
import { execFile, execFileSync } from "node:child_process";
import { userInfo } from "node:os";
import { promisify } from "node:util";
import Dict = NodeJS.Dict;

const execFileAsync = promisify(execFile);

const detectDefaultShell = () => {
  const { env } = process;

  if (process.platform === "win32") {
    return env.COMSPEC || "cmd.exe";
  }

  try {
    const { shell } = userInfo();
    if (shell) {
      return shell;
    }
  } catch {
    // do nothing
  }

  if (process.platform === "darwin") {
    return env.SHELL || "/bin/zsh";
  }

  return env.SHELL || "/bin/sh";
};

const ansiRegex =
  // eslint-disable-next-line no-control-regex
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
const stripAnsi = (string) =>
  typeof string === "string" ? string.replace(ansiRegex, "") : string;
const args = [
  "-ilc",
  'echo -n "_SHELL_ENV_DELIMITER_"; env; echo -n "_SHELL_ENV_DELIMITER_"; exit',
];

const env = {
  // Disables Oh My Zsh auto-update thing that can block the process.
  DISABLE_AUTO_UPDATE: "true",
};

const getExecOptions = () => ({
  encoding: "utf8" as BufferEncoding,
  env: { ...process.env, ...env },
});

const parseEnv = (env: string) => {
  env = env.split("_SHELL_ENV_DELIMITER_")[1];
  const returnValue = {};

  for (const line of stripAnsi(env).split("\n").filter(Boolean)) {
    const [key, ...values] = line.split("=");
    returnValue[key] = values.join("=");
  }

  return returnValue;
};

export async function shellEnv(): Promise<Dict<string>> {
  if (process.platform === "win32") {
    return process.env;
  }

  try {
    const { stdout } = await execFileAsync(
      detectDefaultShell(),
      args,
      getExecOptions()
    );
    return parseEnv(stdout.toString());
  } catch (error) {
    return process.env;
  }
}

export function shellEnvSync(): Dict<string> {
  if (process.platform === "win32") {
    return process.env;
  }

  try {
    const stdout = execFileSync(detectDefaultShell(), args, getExecOptions());
    return parseEnv(stdout.toString());
  } catch (error) {
    return process.env;
  }
}
