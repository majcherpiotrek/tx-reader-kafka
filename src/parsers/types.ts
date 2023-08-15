export type BankStatementParser<T extends Record<string, unknown>> = {
  (input: Buffer | string): T[];
};
