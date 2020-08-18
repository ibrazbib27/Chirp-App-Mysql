import * as React from "react";
import {Link, RouteComponentProps} from "react-router-dom";
import {useState, useEffect} from "react";
import { Chirp } from "../App";
import { JumbotronText } from "../App";
import MyJumbotron from "../jumbotron/MyJumbotron";

import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

interface AllChirpProps extends RouteComponentProps<{ username: null | string }> {}

const AllChirps: React.FC<AllChirpProps> = (props) => {
    const [chirpers, setChirp] = useState<Chirp[]>([]);
    const [chirpersBool, setChirpBool] = useState<boolean>(true);

    const jumbotronText: JumbotronText = {
        header: "Well, this is a little awkward...",
        body: [
            "It seems like you have not uploaded any chirps to your timeline, ",
            "click the button below to start chirping!",
        ],
        button: true,
    };
    let setChirps = (bool: boolean) => {
        setChirpBool(bool);
    };



    let chirpContent = (id: string, chirpContents: string) => {
        let tempElement: HTMLParagraphElement = document.getElementById(`content${id}`) as HTMLParagraphElement;
        tempElement.classList.add("font-italic")
        tempElement.innerHTML = '';
            let reg: RegExp = new RegExp(/[@]+([_]|[a-zA-Z0-9]){1,50}/, 'gi');
            if(chirpContents.match(reg) !== null) {
                let myUsername = chirpContents.match(reg);
                myUsername.forEach((val, index) => {

                    let valReg: RegExp = new RegExp( `@\\b${val.toString().slice(1)}\\b`, 'gi' );
                    chirpContents = chirpContents.replace(valReg ,
                        `<a href='/${val.toString().slice(1).toLowerCase()}' class=' text-dark text-shadowing' key='${val.toString().slice(1).toLowerCase()}${index}'>${val}</a>`);
                })
            }
        tempElement.innerHTML = chirpContents;




    }



    let getChirps = async () => {
        try {
            let res;
            if(props.match.params.username)
                res = await fetch(`/getall/${props.match.params.username}`, {
                method: "GET",
                });
            else
                res = await fetch(`/getall/?`, {
                    method: "GET",
                });
            let chirpMore = await res.json();
            let chirpObj: Chirp[] = [];
            //json returned with username parameter is different compared to returning chirps with no parameters
            if(props.match.params.username) {
                    for (const chirp in chirpMore[0]) {
                        chirpObj.push({
                            id: chirpMore[0][chirp].id,
                            title: chirpMore[0][chirp].title,
                            img_src: chirpMore[0][chirp].img_src,
                            content: chirpMore[0][chirp].content,
                            _created: chirpMore[0][chirp]._created,
                        });

                    }
            }
            else{
                for (const chirp in chirpMore) {
                    chirpObj.push({
                        id: chirpMore[chirp].id,
                        title: chirpMore[chirp].title,
                        img_src: chirpMore[chirp].img_src,
                        content: chirpMore[chirp].content,
                        _created: chirpMore[chirp]._created,
                    });

                }
            }

            setChirp(chirpObj);
            if (chirpObj !== undefined) {
            if (chirpObj.length > 0) setChirps(true);
            else setChirps(false);
        }

        } catch (e) {
            console.log(e.message);
        }
    };

    useEffect(() => {
       getChirps();

    }, []);
    return (
        <>
            {chirpersBool ? (
                chirpers.map((chirp) => (
                    <Card
                        key={chirp.id}
                        id={chirp.id}
                        className="text-center shadow-lg col-10 col-lg-5 p-0 my-5"
                    >
                        <Card.Header
                            className={
                                "w-100 d-flex-wrap justify-content-center m-0 h1 font-weight-bold"
                            }
                        >
                            {chirp.title}
                        </Card.Header>
                        <Card.Body className={"row w-100 justify-content-center m-0"}>
                            <Col xs={10} md={8} xl={6} className={"my-2 order-1 display-img"}>
                                <Image
                                    src={chirp.img_src}
                                    className={"shadow-sm "}
                                    id={"img_src"}
                                    width="100%"
                                    height="100%"
                                    rounded
                                />
                            </Col>

                            <Col className={"mt-5 mb-2 order-2"} xs={12} md={10}>
                                <p className={"font-italic"}  id={`content${chirp.id}`}
                                   ref={ () => {
                                    chirpContent(chirp.id,   chirp.content);
                                   }} > </p>
                            </Col>
                        </Card.Body>
                        <Card.Footer className=" d-flex justify-content-between m-0 w-100">
                            <div className={"my-auto text-muted small font-italic"}>
                                {chirp._created}
                            </div>{" "}
                            <div className={"my-auto"}>
                                <Button

                                    onClick={() => props.history.goBack()}
                                    size={"sm"}
                                    variant="warning"
                                    className={"shadow-sm text-light"}
                                >
                                    Go Back
                                </Button>
                            </div>
                            <div className={"my-auto"}>
                                <Link
                                    to={`/chirp/${chirp.id}/admin`}
                                    className={"btn btn-sm btn-secondary shadow-sm"}
                                >
                                    Admin Options
                                </Link>
                            </div>
                        </Card.Footer>
                    </Card>
                ))
            ) : (
                <MyJumbotron text_info={jumbotronText} />
            )}
        </>
    );
};

export default AllChirps;
