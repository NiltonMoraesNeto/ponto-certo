import * as z from "zod";
import { TFunction } from "i18next";

export const schemaNewProfile = (t: TFunction) =>
  z.object({
    descricao: z
      .string()
      .min(1, { message: t("profile.formNewProfile.description") }),
  });
