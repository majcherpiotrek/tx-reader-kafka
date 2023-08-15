import { z } from "zod";

export const revolutTransactionType = z.enum([
  "TRANSFER",
  "CARD_PAYMENT",
  "TOPUP",
  "EXCHANGE",
]);

export type RevolutTransactionType = z.infer<typeof revolutTransactionType>;

export const revolutProduct = z.enum(["Current", "Savings"]);

export type RevolutProduct = z.infer<typeof revolutProduct>;

export const revolutTransaction = z.object({
  Type: revolutTransactionType,
  Product: revolutProduct,
  "Started Date": z.coerce.date(),
  "Completed Date": z.coerce.date(),
  Description: z.string(),
  Amount: z.coerce.string(), // TODO maybe use Big.js
  Fee: z.coerce.string(), // TODO maybe use Big.js
  Currency: z.string(),
});

export type RevolutTransaction = z.infer<typeof revolutTransaction>;
