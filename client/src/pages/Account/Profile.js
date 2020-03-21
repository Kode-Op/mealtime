import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accordion, Card, Button } from "react-bootstrap";
import "./Profile.css";

function EditButton() {
  return <Link className="ProfileEditLink">Edit</Link>;
}

export default class Profile extends Component {
  render() {
    return (
      <div>
        <h2>Profile</h2>
        <Accordion>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Name:</div>
              <div className="ProfileUserInfo">Firstname Lastname</div>
              <EditButton />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h5>Edit name</h5>
                <br />
                <form>
                  <label htmlFor="fname" className="ProfileFormTest">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    value="Firstname"
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="lname" className="ProfileFormTest">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    value="Lastname"
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordname" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordname"
                    className="ProfileInputBox"
                    required
                  />
                  <Button variant="success" type="submit">
                    Update name
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="1"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Email:</div>
              <div className="ProfileUserInfo">example@email.com</div>
              <EditButton />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <h5>Edit email</h5>
                <br />
                <form>
                  <label htmlFor="email" className="ProfileFormTest">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="emailconfirm" className="ProfileFormTest">
                    Confirm email
                  </label>
                  <input
                    type="text"
                    name="emailconfirm"
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordemail" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordemail"
                    className="ProfileInputBox"
                    required
                  />
                  <Button variant="success" type="submit">
                    Update email
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="2"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Password:</div>
              <div className="ProfileUserInfo">•••••••••••••••</div>
              <EditButton />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <h5>Edit password</h5>
                <br />
                <form>
                  <label htmlFor="passwordcurrent" className="ProfileFormTest">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="passwordcurrent"
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordnew" className="ProfileFormTest">
                    New password
                  </label>
                  <input
                    type="password"
                    name="passwordnew"
                    className="ProfileInputBox"
                    required
                  />
                  <label
                    htmlFor="passwordnewconfirm"
                    className="ProfileFormTest"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="passwordnewconfirm"
                    className="ProfileInputBox"
                    required
                  />
                  <Button variant="success" type="submit">
                    Update password
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="3"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Address:</div>
              <div className="ProfileUserInfo">
                123 North Main Street, City, State 12345
              </div>
              <EditButton />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>To be replaced</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}
