import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

export default function HelpDialog({
    title,
    text,
    icon,
    iconProps,
    children,
    className,
}) {
    const [helpOpen, setHelpOpen] = React.useState(false);

    const IconComponent = icon || HelpOutlineIcon;

    return (
        <>
            <Tooltip
                arrow
                title={"Click for more info"}
                placement="bottom-start"
            >
                <span onClick={() => setHelpOpen(true)} className={className}>
                    <IconComponent
                        fontSize="small"
                        color="action"
                        {...iconProps}
                    />
                    {children}
                </span>
            </Tooltip>
            <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
                {title && (
                    <DialogTitle id="about-dialog-title">{title}</DialogTitle>
                )}
                <DialogContent>
                    <DialogContentText
                        id="about-dialog-description"
                        component={typeof text === "string" ? "p" : "div"}
                    >
                        {text}
                    </DialogContentText>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setHelpOpen(false)}
                    >
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
