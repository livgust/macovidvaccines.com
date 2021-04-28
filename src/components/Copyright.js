import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Copyright() {
    const { t } = useTranslation("main");

    return (
        <Typography variant="caption" display="block" gutterBottom>
            {t("disclaimer")}
            <br />
            Copyright &#169; {new Date().getFullYear()} Olivia Adams/Ora
            Innovations LLC. All rights reserved.
        </Typography>
    );
}
