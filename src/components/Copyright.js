import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Copyright() {
    return (
        <Typography variant="caption" display="block" gutterBottom>
            This site is for informational purposes only and is not affiliated
            with or endorsed by the Commonwealth of Massachusetts. Not all
            vaccination locations are tracked and the information may not be
            complete or accurate.
            <br />
            Copyright &#169; {new Date().getFullYear()} Olivia Adams/Ora
            Innovations LLC. All rights reserved.
        </Typography>
    );
}
