import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import { List, ListItem } from "material-ui/List";
import { withStyles } from "material-ui/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import "../App.css";

export default class UserFormDetails extends React.Component {
  continue = async (e) => {
    e.preventDefault();

    const {
      values: {
        firstName,
        lastName,
        email,
        contact,
        username,
        password,
        company,
        field,
        placedYear,
      },
    } = this.props;
    let data = {};

    await fetch("http://localhost:3001/admin", {
      method: "post",
      headers: { 
        Authentication: "Content-Type:application/json", 
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userName: username,
        phone: contact,
        field: field,
        company: company,
        placementYear: placedYear,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        localStorage.setItem("routes", "unsuccess");
        data = user;
      })
      .catch((err) => console.log(err));
  
    if (data !== undefined)
      if (data.message !== undefined) {
        this.props.nextStep("success");
      } else {
        this.props.nextStep(data);
      }
  };
  prev = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  render() {
    const {
      values: {
        firstName,
        lastName,
        email,
        contact,
        username,
        password,
        company,
        field,
        placedYear,
      },
    } = this.props;
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div>
            {this.props.admin === "user" ? (
              <AppBar title='Confirm User Details' />
            ) : null}
          </div>
          <Box className='box'>
            <List>
              <ListItem primaryText='FirstName' secondaryText={firstName} />
              <ListItem primaryText='LastName' secondaryText={lastName} />
              <ListItem primaryText='Email' secondaryText={email} />
              <ListItem primaryText='Contact' secondaryText={contact} />
              <ListItem primaryText='Password' secondaryText={password} />
              <ListItem primaryText='Username' secondaryText={username} />
              <ListItem primaryText='Field' secondaryText={field} />
              <ListItem primaryText='Company' secondaryText={company} />
              <ListItem primaryText='Placed Year' secondaryText={placedYear} />
            </List>
            <Button
              label='Confirm'
              primary={true}
              onClick={this.continue}
              variant='outlined'
            >
              Confirm
            </Button>
            <Button
              label='Back'
              primary={false}
              onClick={this.prev}
              variant='outlined'
              style={{ margin: "10px" }}
              className='prev'
            >
              Prev
            </Button>
          </Box>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}
