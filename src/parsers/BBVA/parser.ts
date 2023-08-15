import * as xlsx from "xlsx";
import { BankStatementParser } from "../types.js";
import { BBVA_Transaction, bbvaTransction } from "./codecs.js";

export const parseBBVA_Statement: BankStatementParser<BBVA_Transaction> = (
  data: Buffer | string
) => {
  const workbook = xlsx.read(data, {
    type: typeof data === "string" ? "string" : "buffer",
    cellDates: true,
  });

  const sheets = Object.values(workbook.Sheets);

  return sheets.flatMap((sheet) => {
    const sheetCsv = xlsx.utils.sheet_to_csv(sheet);
    const [header, ...dataRows] = sheetCsv.split("\n").slice(4); // First four rows are document header - TODO somehow include this in schema?
    const headerDecoded = header.split(",");
    return dataRows
      .map((row) => row.split(","))
      .map((dataRow) => {
        const rawTransaction = headerDecoded.reduce<Record<string, unknown>>(
          (obj, key, index) => ({
            ...obj,
            [key]: dataRow[index],
          }),
          {}
        );
        return bbvaTransction.parse(rawTransaction);
      });
  });
};
