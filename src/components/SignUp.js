import React, { Fragment, useContext, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cpassword, setCpassword] = useState();

  const [isLogin,setIsLogin] =useState(false)
  const navi=useNavigate()

  const authCntx=useContext(AuthContext)
  const handleButtonClick=()=>{
    setIsLogin(!isLogin)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let url;
    if (isLogin || password === cpassword) {
      if(isLogin){
        url="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAdLu3kqqSMkUU-ba_vFel2sHQnRWYo7eI"
      }
      else{
        url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAdLu3kqqSMkUU-ba_vFel2sHQnRWYo7eI"
      }
      fetch(url
        ,
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
          console.log(data);
          authCntx.setToken(data.idToken)
          authCntx.setEmailId(email)
          navi('/')
          console.log("heelo")
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
            <h1 className="text-center mb-4">{isLogin?"Log In":"Sign Up"}</h1>
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
                {!isLogin && <Form.Group controlId="cpass" className="mb-3">
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
              </Form.Group>}
              

              <Button variant="primary" type="submit" className="w-100">
                {isLogin?"Log In":"Sign Up"} 
              </Button>
              {isLogin && <Button variant="link" className="w-100 mb-5">
                Forget Password
                </Button>}
            </Form>
            <div className="text-center mt-5">
            
                <Button variant="success" className="w-100" onClick={handleButtonClick}>
                {isLogin?"Don't have an account?Sign up":"Have an account?Login"}
                </Button>
              </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SignUp;
