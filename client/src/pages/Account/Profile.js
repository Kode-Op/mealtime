import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accordion, Card } from "react-bootstrap";
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
              <Card.Body>Hello! I'm the body</Card.Body>
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
              <Card.Body>Hello! I'm another body</Card.Body>
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
              <Card.Body>Hello! I'm another body</Card.Body>
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
              <Card.Body>Hello! I'm another body</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}
