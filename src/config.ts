import fs from "fs";

export function readConfigFile(fileName: string) {
  const data = fs.readFileSync(fileName, "utf8").toString().split("\n");
  return data.reduce<Record<string, string>>((config, line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      config[key] = value;
    }
    return config;
  }, {});
}
