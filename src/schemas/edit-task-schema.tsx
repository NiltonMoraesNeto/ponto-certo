import * as z from "zod";
import { TFunction } from "i18next";

export const schemaEditTask = (t: TFunction) =>
  z.object({
    status: z.boolean(),
    descricao: z
      .string()
      .min(1, { message: t("reportPersonal.formEditTask.description") }),
  });
