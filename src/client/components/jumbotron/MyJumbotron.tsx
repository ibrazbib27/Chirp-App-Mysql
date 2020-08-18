import * as React from "react";
import * as $ from "jquery";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Link } from "react-router-dom";
import { JumbotronText } from "../App";

interface JumbotronProps {
    text_info: JumbotronText;
}

const MyJumbotron: React.FC<JumbotronProps> = (props) => {
    $(document).ready(function () {
        let div: HTMLDivElement = document.getElementById(
            "chirps"
        ) as HTMLDivElement;
        div.className = "justify-content-center align-self-center  w-100";
    });
    return (
        <Jumbotron
            className={
                "text-center col-10 col-lg-6 shadow-lg bg-secondary text-white mx-auto"
            }
        >
            <h1>{props.text_info.header}</h1>
            <p className={"mt-5"}>
                {props.text_info.body[0]}
                <b>{props.text_info.button ? props.text_info.body[1] : null}</b>
            </p>
            {props.text_info.button ? (
                <section className={"mt-5"}>
                    <Link
                        to={"/chirp/add"}
                        className={"btn btn-light shadow-sm text-dark"}
                    >
                        Create New Chirp!
                    </Link>
                </section>
            ) : null}
        </Jumbotron>
    );
};

export default MyJumbotron;
