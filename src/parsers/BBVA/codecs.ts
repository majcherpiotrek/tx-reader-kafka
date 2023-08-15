import { z } from "zod";

const bbvaDate = z.coerce.string().transform((dateStr, ctx) => {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    12
  );
  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_date,
      message: "A date in dd/MM/yyyy format is expected",
    });
  }
  return date;
});

export const bbvaTransction = z.object({
  Fecha: bbvaDate,
  "F.Valor": bbvaDate,
  Concepto: z.string(),
  Movimiento: z.string(),
  Importe: z.coerce.string(), // Maybe use Big.js
  Divisa: z.string(),
  Observaciones: z.string(),
});

export type BBVA_Transaction = z.infer<typeof bbvaTransction>;
