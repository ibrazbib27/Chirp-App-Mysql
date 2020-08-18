import * as React from "react";

import MyNavbar from "./navbar/MyNavbar";
import Footer from "./footer/Footer";
import NewChirp from "./chirp_maker/NewChirp";
import AllChirps from "./chirp_maker/AllChirps";
import MyJumbotron from "./jumbotron/MyJumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export interface AppProps {}

export interface Chirp {
  id: string;
  title: string;
  img_src: string;
  content: string;
  _created: string;
}
export interface JumbotronText {
  header: string;
  body: string[];
  button: boolean;
}

const App: React.FC<AppProps> = (props) => {
  const jumbotronText: JumbotronText = {
    header: "Who Are We?",
    body: [
      `The Chirper App is a social media platform designed for users to use to express themselves.`,
    ],
    button: false,
  };

  return (
    <>
      <Router>
        <Switch>
          {["/", "/:username?"].map((path) => (
            <Route
              exact
              path={path}
              key={path}
              render={(props) => (
                <>
                  <MyNavbar />
                  <Container className={"d-flex justify-content-center"} fluid>
                    <Row
                      id={"chirps"}
                      className={
                        "justify-content-center justify-content-lg-around mt-5 py-5 w-100"
                      }
                    >
                      <AllChirps
                        history={props.history}
                        location={props.location}
                        match={props.match}
                      />
                    </Row>
                  </Container>
                  <Footer />
                </>
              )}
            />
          ))}
          <Route
            exact
            path="/chirp/about"
            render={(props) => (
              <>
                <MyNavbar />
                <Container className={"d-flex justify-content-center"} fluid>
                  <Row
                    id={"chirps"}
                    className={"justify-content-center align-self-center w-100"}
                  >
                    <MyJumbotron text_info={jumbotronText} />
                  </Row>
                </Container>
                <Footer />
              </>
            )}
          />
          {["/chirp/add", "/chirp/:id/admin"].map((path) => (
            <Route
              exact
              path={path}
              key={path}
              render={(props) => (
                <>
                  <MyNavbar />
                  <Container className={"d-flex justify-content-center"} fluid>
                    <Row
                      className={
                        "justify-content-center align-self-center w-100 py-5 mt-5"
                      }
                    >
                      <NewChirp
                        history={props.history}
                        location={props.location}
                        match={props.match}
                      />
                    </Row>
                  </Container>
                  <Footer />
                </>
              )}
            />
          ))}
        </Switch>
      </Router>
    </>
  );
};

export default App;
