import { z } from "zod";

export const Bank = z.enum(["Revolut", "BBVA"]);

export type Bank = z.infer<typeof Bank>;
