import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

export default function HelpDialog(props) {
    const [helpOpen, setHelpOpen] = React.useState(false);

    return (
        <span>
            <Tooltip title="Click for more info">
                <HelpOutlineIcon
                    fontSize="small"
                    onClick={() => setHelpOpen(true)}
                />
            </Tooltip>
            <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
                <DialogTitle id="about-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="about-dialog-description">
                        <p>{props.text}</p>
                    </DialogContentText>
                    <Button onClick={() => setHelpOpen(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </span>
    );
}
