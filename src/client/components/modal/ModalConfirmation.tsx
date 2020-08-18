import * as React from "react";
import { ModalObj } from "../chirp_maker/NewChirp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { RouteComponentProps } from "react-router-dom";
import { useState } from "react";
import * as $ from "jquery";

export interface ModalProps extends RouteComponentProps<{ id: string }> {
    invalid: any;
    post_user: any;
    validate_form: any;
    form_element: HTMLFormElement;
    mod_obj: ModalObj[];
    chirp_obj: any;
}

const ModalConfirmation: React.FC<ModalProps> = (props) => {
    const [option, setOption] = useState<boolean | null>(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let complete = () => props.history.push("/");
    const handleSubmit = () => {

        if (props.form_element.checkValidity() === true) updateChirp();
        else setTimeout(props.invalid, 200);

        props.validate_form();
        return false;

    };
    let updateChirp = async () => {
        let formData: any = props.chirp_obj();
        try {
            await fetch(`/api/${props.match.params.id}/admin`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(formData),
            });
            if(formData.content.match(/([@]+([_]|[a-zA-Z0-9]){1,50})/gi) !== null) await props.post_user(formData.content, false);
            await fetch(`/api/${props.match.params.id}/checkusers`, {
                method: "PUT",
            });
            complete();
        } catch (e) {
            console.log(e.message);
        }
    };
    let deleteChirp = async () => {
        try {
            await fetch(`/api/${props.match.params.id}/admin`, {
                method: "DELETE",
            });
            complete();
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <>
            <div
                className={"col-12 col-md-5 col-lg-4 my-md-0 my-1 order-2 order-md-1"}
            >
                <Button
                    onClick={() => {
                        setOption(false);
                        handleShow();
                    }}
                    className="shadow-sm w-100"
                    variant="danger"
                >
                    Delete
                </Button>
            </div>{" "}
            <div
                className={"col-12 col-md-5 col-lg-4 my-1 my-md-0 order-1 order-md-2"}
            >
                <Button
                    onClick={() => {
                        setOption(true);
                        handleShow();
                    }}
                    className="shadow-sm w-100"
                    variant="primary"
                >
                    Save Changes
                </Button>
            </div>
            <Modal
                id={"modalConfirmation"}
                className={"text-center"}
                show={show}
                onHide={handleClose}
            >
                <Modal.Header className={"w-100 px-3 mx-auto text-center"}>
                    <Modal.Title className={"px-0 w-100"}>
                        {option ? props.mod_obj[0].header : props.mod_obj[1].header}
                    </Modal.Title>{" "}
                    <div className={"px-0"}>
            <span
                onClick={handleClose}
                className="close pointer"
                aria-label="Close"
                aria-hidden="true"
            >
              &times;
            </span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {option ? props.mod_obj[0].body : props.mod_obj[1].body}
                </Modal.Body>
                <Modal.Footer className={"row mx-0 w-100 justify-content-between"}>
                    <div className={"col-4"}>
                        <Button
                            className="shadow-sm w-100"
                            variant="danger"
                            onClick={handleClose}
                        >
                            No
                        </Button>
                    </div>
                    <div className={"col-4"}>
                        <Button
                            className="shadow-sm w-100"
                            variant="success"
                            onClick={() => {
                                if (option) {
                                    handleClose();
                                    handleSubmit();
                                } else deleteChirp();
                            }}
                        >
                            Yes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalConfirmation;
