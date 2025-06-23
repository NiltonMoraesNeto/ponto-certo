import * as z from "zod";
import { TFunction } from "i18next";

export const schemaNewTicket = (t: TFunction) =>
  z.object({
    ticket: z.string().min(1, { message: t("tasks.formNewTask.ticket") }),
    descricao: z
      .string()
      .min(1, { message: t("tasks.formNewTask.description") }),
  });
