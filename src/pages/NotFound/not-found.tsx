import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-indigo-900">
      <h1 className="text-4xl font-bold text-red-600">{t("home.notFound")}</h1>
    </div>
  );
}
