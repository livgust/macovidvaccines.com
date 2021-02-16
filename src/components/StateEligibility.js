import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
    return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
}

function getIframeStyle() {
    return {
        border: "none",
        height: "100%",
        width: "100%",
    };
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "center",
        paddingBottom: "12px",
    },
    modal: {
        position: "absolute",
        width: 400,
        maxWidth: "90%",
        height: 532,
        maxHeight: "90%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        boxShadow: theme.shadows[5],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
}));

export default function StateEligibility() {
    const iframeSrc =
        "https://docs.google.com/forms/d/e/1FAIpQLSeOcfCPu_afvFILB_nXZz3v9VMaFZZQMgGbKGiU7o3VBr5m7Q/viewform?embedded=true";

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [iframeStyle] = useState(getIframeStyle);

    const [modalOpen, setModalOpen] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const handleModalClose = () => {
        setModalOpen(false);
        setIframeLoaded(false);
    };

    return (
        <div className={classes.container}>
            <Button
                data-testid="eligibility-button"
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setModalOpen(true)}
            >
                Check your eligibility
            </Button>
            <Modal open={modalOpen} onClose={handleModalClose}>
                <div
                    style={modalStyle}
                    className={classes.modal}
                    data-testid="eligibility-modal"
                >
                    {!iframeLoaded && <p>Loading...</p>}
                    <iframe
                        onLoad={() => setIframeLoaded(true)}
                        src={iframeSrc}
                        style={iframeStyle}
                        title="Vaccine Eligibility Form"
                        data-testid="eligibility-iframe"
                    />
                </div>
            </Modal>
        </div>
    );
}
