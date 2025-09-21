import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import { withStyles } from "material-ui/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import "../App.css";

export default class UserFormDetails extends React.Component {
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep("next");
  };
  con = (e) => {
    e.preventDefault();
    this.props.funCalling2(e);
  };
  render() {
    const { values } = this.props;
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div>
            {this.props.admin === "user" ? (
              <AppBar title='Enter User Details' />
            ) : null}
          </div>
          <Box className='box'>
            <TextField
              hintText='Enter Your First Name'
              floatingLabelText='First Name'
              className='textField'
              onChange={this.props.handleChange("firstName")}
              defaultValue={values.firstName}
              variant='outlined'
            />
            <br />
            <TextField
              hintText='Enter Your Last Name'
              floatingLabelText='Last Name'
              error={true}
              onChange={this.props.handleChange("lastName")}
              defaultValue={values.lastName}
            />
            <br />
            <TextField
              hintText='Email'
              floatingLabelText='Email'
              onChange={this.props.handleChange("email")}
              defaultValue={values.email}
            />
            <br />
            <TextField
              hintText='Contact'
              floatingLabelText='Contact'
              onChange={this.props.handleChange("contact")}
              defaultValue={values.contact}
            />
            <br />
            <TextField
              hintText='Password'
              floatingLabelText='Password'
              type='password'
              onChange={this.props.handleChange("password")}
              defaultValue={values.password}
            />
            <br />
            <Button primary={true} onClick={this.continue} variant='outlined'>
              Continue
            </Button>
            <Button
              className='pointer ml1'
              onClick={this.con}
              variant='outlined'
              style={{ margin: "10px" }}
            >
              Log In
            </Button>
          </Box>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}
