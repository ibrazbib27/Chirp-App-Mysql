import * as React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fab);

interface FooterProps {}

const Footer: React.FC<FooterProps> = (props) => {
    return (
        <Row className="w-100  mx-0 justify-content-around bg-dark mt-auto">
            <Col xs={12} className="mx-auto mt-2">
                <Row className="w-25  mx-auto justify-content-between">
                    <FontAwesomeIcon
                        className="fa-2x text-primary"
                        icon={["fab", "facebook"]}
                    />
                    <FontAwesomeIcon
                        className="fa-2x text-white"
                        icon={["fab", "twitter"]}
                    />
                    <FontAwesomeIcon
                        className="fa-2x text-danger"
                        icon={["fab", "instagram"]}
                    />
                </Row>
            </Col>

            <Col xs={12} className="text-center small font-italic text-white my-2">
                © 2020 Copyright: chirperapp.com
            </Col>
        </Row>
    );
};

export default Footer;
