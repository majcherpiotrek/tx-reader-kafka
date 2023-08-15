import * as xlsx from "xlsx";
import { BankStatementParser } from "../types.js";
import { RevolutTransaction, revolutTransaction } from "./codecs.js";

export const parseRevolutStatement: BankStatementParser<RevolutTransaction> = (
  data: Buffer | string
) => {
  const workbook = xlsx.read(data, {
    type: typeof data === "string" ? "string" : "buffer",
    cellDates: true,
  });

  const sheets = Object.values(workbook.Sheets);

  const result = sheets.flatMap((sheet) => {
    const sheetJson = xlsx.utils.sheet_to_json(sheet);
    console.log(sheetJson);
    return sheetJson.map((json) =>
      revolutTransaction.passthrough().parse(json)
    ); // todo this will throw, make it more functional;
  });

  return result;
};
