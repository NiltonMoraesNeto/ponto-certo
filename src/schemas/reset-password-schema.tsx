import * as z from "zod";
import { TFunction } from "i18next";

export const schemaResetPassword = (t: TFunction) =>
  z.object({
    email: z.string().email({ message: t("resetPassword.requiredMsgEmail") }),
  });
