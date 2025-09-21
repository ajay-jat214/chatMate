import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import { withStyles } from "material-ui/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import "../App.css";

export default class UserPersonalDetails extends React.Component {
  continue = (e) => {
    e.preventDefault();
    this.props.nextStep("next");
  };
  prev = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  render() {
    const { values } = this.props;
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div>
            {this.props.admin === "user" ? (
              <AppBar title='Enter Personal Details' />
            ) : null}
          </div>
          <Box className='box'>
            <TextField
              hintText='Enter Your Username'
              floatingLabelText='Username'
              onChange={this.props.handleChange("username")}
              defaultValue={values.username}
            />
            <br />
            <TextField
              hintText='Enter Your Field'
              floatingLabelText='Field'
              onChange={this.props.handleChange("field")}
              defaultValue={values.field}
            />
            <br />
            <TextField
              hintText='Enter Your Organization'
              floatingLabelText='Organization'
              multiline={true}
              onChange={this.props.handleChange("company")}
              defaultValue={values.company}
            />
            <br />
            <TextField
              hintText='Enter Placed Year'
              floatingLabelText='Placed Year'
              multiline={true}
              onChange={this.props.handleChange("placedYear")}
              defaultValue={values.placedYear}
            />
            <br />

            <Button
              label='continue'
              primary={true}
              onClick={this.continue}
              variant='outlined'
            >
              Continue
            </Button>
            <Button
              label='Back'
              primary={false}
              onClick={this.prev}
              style={{ margin: "10px" }}
              variant='outlined'
              className='prev'
            >
              prev
            </Button>
          </Box>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}
