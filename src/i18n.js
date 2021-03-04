import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    fallbackLng: "en-US",
    interpolation: { escapeValue: false }, // React performs escaping.
    resources: {
        en: {
            main: {
                page_title: "MA Covid Vaccine Appointments",
            },
        },
    },
});
