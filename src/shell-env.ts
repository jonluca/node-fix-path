import process from "node:process";
import { execa, execaSync } from "execa";
import { userInfo } from "node:os";
import Dict = NodeJS.Dict;

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
    const { stdout } = await execa(detectDefaultShell(), args, { env });
    return parseEnv(stdout);
  } catch (error) {
    return process.env;
  }
}

export function shellEnvSync(): Dict<string> {
  if (process.platform === "win32") {
    return process.env;
  }

  try {
    const { stdout } = execaSync(detectDefaultShell(), args, { env });
    return parseEnv(stdout);
  } catch (error) {
    return process.env;
  }
}
