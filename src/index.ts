import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { parseBBVA_Statement } from "./parsers/BBVA/parser.js";
import { parseBankArgument, parseFileArgument } from "./arguments.js";
import { Bank } from "./codecs.js";
import { parseRevolutStatement } from "./parsers/Revolut/parser.js";
import { readConfigFile } from "./config.js";
import { fileURLToPath } from "url";
import Kafka from "node-rdkafka";

dotenv.config();

const bank = parseBankArgument(process.argv);
const file = parseFileArgument(process.argv);

if (!bank) {
  console.error("Please provide a bank parameter (--bank=BBVA|Revolut)");
  process.exit(1);
}

if (!file) {
  console.error("Please provide a file to process (--file=<path_to_file>)");
  process.exit(1);
}

const configFilePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../client.properties"
);

const producer = new Kafka.Producer(readConfigFile(configFilePath));
const filePath = path.resolve(file);
const rs = fs.createReadStream(filePath);

producer.connect();
producer.on("ready", () => {
  rs.on("data", (chunk) => {
    switch (bank) {
      case Bank.Enum.BBVA:
        parseBBVA_Statement(chunk).forEach((tx) => {
          console.log("sending to kafka", tx);
          producer.produce(
            "bank_transactions_raw",
            -1,
            Buffer.from(JSON.stringify(tx)),
            Buffer.from(`bbva-${tx.Fecha.toISOString()}`)
          );
        });

        return;
      case Bank.Enum.Revolut:
        parseRevolutStatement(chunk).forEach((tx) => {
          console.log("sending to kafka", tx);
          producer.produce(
            "bank_transactions_raw",
            -1,
            Buffer.from(JSON.stringify(tx)),
            Buffer.from(`revolut-${tx["Started Date"].toISOString()}`)
          );
        });
        return;
    }
  });

  rs.on("close", () => {
    console.log("closed");
  });
});

producer.on("disconnected", () => {
  rs.destroy();
});
