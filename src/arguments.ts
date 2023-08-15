import { Bank } from "./codecs.js";
import path from "path";

const BANK_ARG_PREFIXES = ["--bank", "-b"];
export function parseBankArgument(args: string[]): Bank | null {
  const bankArgIndex = args.findIndex((arg) => BANK_ARG_PREFIXES.includes(arg));
  if (bankArgIndex !== -1) {
    const bank = Bank.safeParse(args[bankArgIndex + 1]);
    return bank.success ? bank.data : null;
  }

  return null;
}

const FILE_ARG_PREFIXES = "--file";
export function parseFileArgument(args: string[]): string | null {
  const fileArgIndex = args.findIndex((arg) => FILE_ARG_PREFIXES.includes(arg));

  if (fileArgIndex !== -1) {
    const fileArg = args[fileArgIndex + 1];
    if (fileArg) {
      return fileArg.startsWith("/")
        ? path.resolve(fileArg)
        : path.resolve("./", fileArg);
    }
  }

  return null;
}
