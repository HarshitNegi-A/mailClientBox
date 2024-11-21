import React, { Fragment, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cpassword, setCpassword] = useState();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (password === cpassword) {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAdLu3kqqSMkUU-ba_vFel2sHQnRWYo7eI",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authetication Failed";
              throw new Error(errorMessage);
            });
          }
        })
        .then((data) => {
          console.log("User has successfully signed up");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      alert("Password does not match with confirm password");
    }
  };

  return (
    <Fragment>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <h1 className="text-center mb-4">Sign Up</h1>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="pass" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="cpass" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  value={cpassword}
                  type="password"
                  placeholder="Re-enter your password"
                  required
                  onChange={(e) => {
                    setCpassword(e.target.value);
                  }}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Sign Up
              </Button>
            </Form>
            <div className="text-center mt-5">
                <Button variant="success" className="w-100">
                Have an account?Login
                </Button>
              </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SignUp;
