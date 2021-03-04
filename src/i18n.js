import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translations_en_main from "./translations/translations.en.main.json";

i18n.use(initReactI18next).init({
    fallbackLng: "en-US",
    interpolation: { escapeValue: false }, // React performs escaping.
    resources: {
        en: {
            main: translations_en_main,
        },
    },
});
