import * as React from "react";
import { useEffect, useState } from "react";
import * as moment from "moment";

import * as $ from "jquery";
import { RouteComponentProps } from "react-router-dom";
import { Chirp } from "../App";
import ModalConfirmation from "../modal/ModalConfirmation";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faInfoCircle);
import htmlString = JQuery.htmlString;

export interface NewChirpProps
    extends RouteComponentProps<{ id: null | string }> {}

export interface ModalObj {
    header: string;
    body: string;
}

const NewChirp: React.FC<NewChirpProps> = (props) => {
    const renderTooltipTitle = (props: any) => (
        <Tooltip id="button-tooltip_title" {...props}>
            Enter chirp title here. The title must not be left blank and cannot exceed
            40 characters.
        </Tooltip>
    );
    const renderTooltipImg = (props: any) => (
        <Tooltip id="button-tooltip_img" {...props}>
            The image url that you enter must end with one of the following: .gif,
            .jpg, .jpeg, and .png. In order to effectively save a new image to your chirp you must click the "Upload Image" button.
            Upon a successful image upload you should see the image on your screen change to the image located at the image url
            that you have entered. Upon an unsuccessful image upload you should get an error message and the image on the screen
            should not update as well. If you wish to save a new image make sure your new image is uploaded on the screen prior
            to creating or saving changes to your chirp.
        </Tooltip>
    );
    const renderTooltipMes = (props: any) => (
        <Tooltip id="tooltip-top" {...props}>
            Enter chirp message here. The message must not be left blank and cannot
            exceed 1000 characters. If you wish to mention a user in your message,
            include an '@' character at the beginning then type your username. The
            username cannot exceed 50 characters ('@' not included). Your username
            can only be composed from the following characters: [A-Za-z0-9_]. Entry of invalid characters will result
            in an unexpected username. Lastly, usernames with consecutive preceeding '@' will go undetected.
        </Tooltip>
    );

    const modalText: ModalObj[] = [
        {
            header: "Update Confirmation",
            body: "Are you sure you would like to makes changes to this chirp?",
        },
        {
            header: "Delete Confirmation",
            body: "Are you sure you would like to delete this chirp?",
        },
    ];

    const [chirp, setChirp] = useState<Chirp>({
        id: "",
        title: "",
        img_src: "",
        content: "",
        _created: "",
    });
    const [validated, setValidated] = useState(false);
    const isValidated = () => setValidated(true);
    const formElement: HTMLFormElement = document.getElementById(
        "chirp_form"
    ) as HTMLFormElement;
    const [textLength, setTextLength] = useState(1000);

    let postUser =  async (users: string, tempBool: boolean) => {
        let myUser = users.match(/([@]+([_]|[a-zA-Z0-9]){1,50})/gi);
        myUser.forEach(async (user) =>{
        try {
            if(tempBool) {
                await fetch(`/api/${user.slice(1)}/createusers`, {
                    method: "POST",
                });
            }
            else {
                await fetch(`/api/${user.slice(1)}/updateusers`, {
                    method: "PUT",
                });
            }

        } catch (e) {
            console.log(e.message);
        }
    })
    }

    let getChirp = async () => {
        try {
            let res = await fetch(`/api/${props.match.params.id}/admin`, {
                method: "GET",
            });
            let chirpMore = await res.json();
            let myChirp = JSON.parse(JSON.stringify(chirpMore));
            setTextLength(1000 - myChirp[0].content.length);

            setChirp({
                id: myChirp[0].id,
                title: myChirp[0].title,
                img_src: myChirp[0].img_src,
                content: myChirp[0].content,
                _created: myChirp[0]._created,
            });
        } catch (e) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        if (props.match.params.id) {
            getChirp();
        }
    }, []);

    let handleUpload = () => {
        const img: HTMLImageElement = document.getElementById(
            "img_src"
        ) as HTMLImageElement;
        const imgUrl: HTMLInputElement = document.getElementById(
            "img_upload"
        ) as HTMLInputElement;
        if (
            imgUrl.value.endsWith(".gif") ||
            imgUrl.value.endsWith(".jpg") ||
            imgUrl.value.endsWith(".jpeg") ||
            imgUrl.value.endsWith(".png")
        )
            img.src = imgUrl.value;
        else
            alert(
                "Error: Your image can not be updated until you enter a valid image url."
            );

        return false;
    };
    const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setTextLength(1000 - e.currentTarget.value.length);
    };

    const findInvalid = () => {
        $(document).ready(function () {
            $(".form-control:invalid")[0].focus();
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.checkValidity() === true) {
            if (props.match.params.id === undefined) postFunc();
        } else findInvalid();

        isValidated();
    };

    let chirpForm = () => {
        let form = $(`#chirp_form`).serializeArray();
        let formData: any = {};
        formData.title = form[0].value;
        let imgElement: HTMLImageElement = document.getElementById(
            "img_src"
        ) as HTMLImageElement;
        formData.img_src = imgElement.src;
        formData.content = form[2].value;
        formData._created = moment().format("LLL").toString();
        return formData;
    };
    let postFunc = async () => {
        let formData: any = chirpForm();
        try {
            await fetch("/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(formData),
            });
            if(formData.content.match(/([@]+([_]|[a-zA-Z0-9]){1,50})/gi) !== null)  await postUser(formData.content, true);
            props.history.push("/");
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <>
            <Card className="text-center shadow-lg col-12 col-sm-10 col-lg-8 p-0">
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    id={"chirp_form"}
                    className={"m-0"}
                >
                    <Form.Text
                        className={"font-italic small m-0"}
                        id={"required_warning"}
                        muted
                    >
                        ( <span className={"required"}></span>Indicates required )
                    </Form.Text>
                    <Card.Header className={"w-100 row justify-content-center m-0"}>
                        <Form.Group className={"my-2 col-12"}>
                            <Form.Label className={"required"}>
                                <b>
                                    {props.match.params.id === undefined ? "Title" : "Edit Title"}
                                </b>
                                <OverlayTrigger
                                    placement="right-end"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltipTitle}
                                >
                                <FontAwesomeIcon
                                    className={"ml-2"}
                                    size={"sm"}
                                    icon={["fas", "info-circle"]}
                                />
                                </OverlayTrigger>
                            </Form.Label>

                                <Form.Control
                                    type="text"
                                    name={"title"}
                                    className={"shadow-sm"}
                                    id={"title"}
                                    defaultValue={
                                        props.match.params.id === undefined ? "" : chirp.title
                                    }
                                    maxLength={40}
                                    required
                                    autoFocus
                                />
                            <Form.Control.Feedback className={"text-left"} type="invalid">
                                Title must not be blank
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Card.Header>
                    <Card.Body className={"row w-100 justify-content-center m-0"}>
                        <Col xs={8} md={6} className={"my-2 order-1 display-img"}>
                            <Image
                                src={
                                    props.match.params.id === undefined
                                        ? "https://www.evolvefish.com/assets/images/Decals/EF-VDC-00035(Black).jpg"
                                        : chirp.img_src
                                }
                                className={"shadow-sm display-img"}
                                id={"img_src"}
                                width="100%"
                                height="100%"
                                rounded
                            />
                        </Col>
                        <Col className={" my-4 order-2"} xs={12} md={10}>
                            <Form.Group className={"my-2 w-100"}>
                                <Form.Label>
                                    <b>
                                        {props.match.params.id === undefined
                                            ? "Image Url"
                                            : "Edit Image Url"}
                                    </b>
                                    <OverlayTrigger
                                        placement="right-end"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltipImg}
                                    >
                                        <FontAwesomeIcon
                                            className={"ml-2"}
                                            size={"sm"}
                                            icon={["fas", "info-circle"]}
                                        />
                                    </OverlayTrigger>
                                </Form.Label>
                                <InputGroup className={"shadow-sm"}>
                                        <Form.Control
                                            defaultValue={
                                                props.match.params.id === undefined
                                                    ? "https://www.evolvefish.com/assets/images/Decals/EF-VDC-00035(Black).jpg"
                                                    : chirp.img_src
                                            }
                                            name={"img_src"}
                                            type="url"
                                            id={"img_upload"}
                                        />
                                    <InputGroup.Append>
                                        <Button
                                            onClick={handleUpload}
                                            variant={"primary"}
                                            size={"sm"}
                                        >
                                            Upload Image
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col className={"my-2 order-3 "} xs={12} md={10}>
                            <Form.Group>
                                <Form.Label className={"required"}>
                                    <b>
                                        {props.match.params.id === undefined
                                            ? "Message"
                                            : "Edit Message"}
                                    </b>
                                    <OverlayTrigger
                                        placement="right-end"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltipMes}
                                    >
                                        <FontAwesomeIcon
                                            className={"ml-2"}
                                            size={"sm"}
                                            icon={["fas", "info-circle"]}
                                        />
                                    </OverlayTrigger>
                                </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        defaultValue={
                                            props.match.params.id === undefined ? "" : chirp.content
                                        }
                                        onInput={handleChange}
                                        name={"content"}
                                        className={"shadow-sm"}
                                        id={"message"}
                                        maxLength={1000}
                                        required
                                    />
                                <Form.Text className={"font-italic small text-left"} muted>
                                    You have {textLength} characters left.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid" className={"text-left"}>
                                    Message must not be blank
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Card.Body>
                    <Card.Footer
                        className={
                            props.match.params.id === undefined
                                ? "row mx-0 w-100 justify-content-center"
                                : "row mx-0 w-100 justify-content-between"
                        }
                    >
                        {" "}
                        {props.match.params.id === undefined ? (
                            <div className={"col"}>
                                <Button type="submit" className="shadow-sm" variant="success">
                                    Create Chirp
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ModalConfirmation
                                    invalid={findInvalid}
                                    post_user={postUser}
                                    validate_form={isValidated}
                                    form_element={formElement}
                                    chirp_obj={chirpForm}
                                    mod_obj={modalText}
                                    location={props.location}
                                    match={props.match}
                                    history={props.history}
                                />
                            </>
                        )}{" "}
                    </Card.Footer>
                </Form>
            </Card>
        </>
    );
};
export default NewChirp;
