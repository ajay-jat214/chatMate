import React, { useState } from "react";
import { Button } from "@material-ui/core";
import DeleteUsers from "./components/deleteUsers";
import { AppBar, Toolbar } from "@material-ui/core";
import UserForm from "./components/userForm";

function Admin(props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [field, setField] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [placementYear, setPlacementYear] = useState("");
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);

  const onButtonSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3001/admin", {
      method: "post",
      headers: { Authentication: "Content-Type:application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        phone: phone,
        field: field,
        company: company,
        placementYear: placementYear,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        alert(user);
        localStorage.setItem("routes", "unsuccess");
      });
  };
  const call = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  return (
    <form>
      <div className='flex wrap'>
        <AppBar>
          <Toolbar>
            <Button
              variant='outlined'
              style={{
                margin: "8px",
                position: "relative",
                top: "8px",
                color: "white",
              }}
              onClick={props.logout}
            >
              LogOut
            </Button>
            <div>
              {show ? (
                <Button
                  variant='outlined'
                  style={{
                    margin: "8px",
                    position: "relative",
                    top: "8px",
                    color: "white",
                  }}
                  onClick={call}
                >
                  Add Users
                </Button>
              ) : (
                <Button
                  variant='outlined'
                  style={{
                    margin: "8px",
                    position: "relative",
                    top: "8px",
                    color: "white",
                  }}
                  onClick={call}
                >
                  Delete Users
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div>
        {show ? (
          <DeleteUsers />
        ) : (
          <div style={{ marginTop: "90px" }}>
            <UserForm admin='admin' />
          </div>
        )}
      </div>
    </form>
  );
}

export default Admin;
