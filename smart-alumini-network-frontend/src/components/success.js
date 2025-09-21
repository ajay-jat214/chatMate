import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Box from "@material-ui/core/Box";
import AppBar from "material-ui/AppBar";
import Button from "@material-ui/core/Button";
import "../App.css";

export default function Success(props) {
  const functionCall = (e) => {
    e.preventDefault();
    props.funCalling2(e);
  };
  return (
    <MuiThemeProvider>
      <React.Fragment>
        <Box className='box'>
          <div>
            {props.admin === "user" ? (
              <div>
                <h1 style={{ color: "black" }}>
                  Thank you for your submission
                </h1>
                <div className='mb3'>
                  You have Completed all the Steps successfully<span>🥳🥳</span>
                  !! Now You may log in{" "}
                </div>
                <Button variant='outlined' onClick={functionCall}>
                  Sign In
                </Button>
              </div>
            ) : (
              <div>
                <h1 style={{ color: "black" }}>
                  Thank you for your submission
                </h1>
                <div className='mb3'>
                  You have Completed all the Steps successfully<span>🥳🥳</span>
                  !! Now registered user may log in{" "}
                </div>
              </div>
            )}
          </div>
        </Box>
      </React.Fragment>
    </MuiThemeProvider>
  );
}
