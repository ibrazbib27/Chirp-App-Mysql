import * as React from "react";
import { Link } from "react-router-dom";

import Nav from "react-bootstrap/Nav";

interface LinksProps {}

const MyLinks: React.FC<LinksProps> = (props) => {
    return (
        <>
            <Nav.Link as={Link}  to={"/"} eventKey="1" className="nav-color">
                Home
            </Nav.Link>

            <Nav.Link
                as={Link}
                to={"/chirp/about"}
                eventKey="2"
                className="nav-color"
            >
                About
            </Nav.Link>

            <Nav.Link as={Link} className="nav-color" to={"/chirp/add"} eventKey="3">
                Add New Chirp
            </Nav.Link>
        </>
    );
};

export default MyLinks;
