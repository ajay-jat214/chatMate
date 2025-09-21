import React from "react";
import { connect } from "react-redux";
import { setProfileForAccount, setRoute } from "./redux/actions";
import { setEmailCredentials } from "./redux/actions";
import { setUserNameCredentials } from "./redux/actions";
import io from "socket.io-client";
import "./usersection.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

let socket;
const ENDPOINT = "http://localhost:3001/";

const mapStateToProps = (state) => {return state};

const mapDispatchToProps = (dispatch) => {
  return {
    search: (data) => dispatch(setRoute(data)),
    search2: (data) => dispatch(setEmailCredentials(data)),
    search3: (data) => dispatch(setUserNameCredentials(data)),
    search4: (data) => dispatch(setProfileForAccount(data)),
    profileUpdateHandler : (image) => dispatch(setProfileForAccount(image)),
  };
};

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      signInUserName: "",
      data2: "",
      signUp: false,
    };
  }

  componentDidMount(){
    socket = io(ENDPOINT);
  }

  componentDidUpdate() {
    this.props.rerender(this.state.data2);
  }
  funCalling = () => {
    this.setState({ signUp: !this.state.signUp });
  };
  onButtonSubmit = (props) => {
    this.props.rerender(this.state.data2);
    this.props.search2(this.state.signInEmail);
    this.props.search4("");

      socket.emit("join", { email: this.state.signInEmail, name: this.props.userName });

    fetch("http://localhost:3001/signin", {
      method: "post",
      headers: { 
        "Authentication": "Content-Type:application/json", 
        "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWYzZWI0NTExNjI1M2MyYWQ4NDkxMzE1IiwiZW1haWwiOiJkZW1vQGdtYWlsLmNvbSIsImlhdCI6MTY5MzE0OTc2MCwiZXhwIjoxNjkzMTU2OTYwfQ.No9e08d6ARY6Poo-ydJnfLSq_GTRateTl1K_52b6CFc"
      },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          this.setState({ signInUserName: data.userName });
          props.search3(this.state.signInUserName);
          this.setState({ data2: data.message });
          localStorage.setItem("token",data.token);
          localStorage.setItem("tokenExpiry",data.exp);
        } else {
          alert(data);
        }
      })
      .catch((err) => console.log(err));

    fetch(`http://localhost:3001/getImage?email=${this.state.signInEmail}`, {
      method: "get",
      headers: { 
        Authentication: "Content-Type:multipart/form-data", 
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data1) => {
        this.props.profileUpdateHandler(data1.values[0].image);
      })
      .catch((err) => console.log(err));
    // props.search2(this.state.signInEmail);
  };

  onSubmit1 = () => {
    if (this.state.signInEmail === "jatajay004@gmail.com")
      if (this.state.signInPassword === "ajstyles89") {
        this.props.rerender("admin");
        this.setState({ data2: "admin" });
      } else alert("invalid password");
  };

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  render() {
    return (
      <article className='vh-90 br2 ba dark-gray b--black-10 mv8 w-90 mt4  mw6 center shadow-5'>
        {
          <main className='white pa4 black-80 '>
            <div className='measure center tc parent'>
              <MuiThemeProvider>
                <React.Fragment>
                  <Box className='box'>
                    <TextField
                      hintText='Enter Your Email'
                      floatingLabelText='Email'
                      className='textField'
                      onChange={this.onEmailChange}
                      variant='outlined'
                    />
                    <br />
                    <TextField
                      type='password'
                      hintText='Enter Your Password'
                      floatingLabelText='Password'
                      error={true}
                      onChange={this.onPasswordChange}
                    />
                    <br />
                  </Box>
                </React.Fragment>
              </MuiThemeProvider>

              <div className='black'>
                <Button
                  style={{ color: "black" }}
                  onClick={() => {
                    this.onButtonSubmit(this.props);
                    this.props.rerender(this.state.data2);
                  }}
                >
                  Social Sign In
                </Button>
                <div className='black'>
                  <Button
                    style={{ color: "black" }}
                    onClick={() => {
                      this.onSubmit1(this.state.data2);
                      this.props.rerender(this.state.data2);
                    }}
                  >
                    Admin Sign In
                  </Button>
                </div>

                <Button
                  className='pointer grow'
                  variant='outlined'
                  onClick={this.props.funCalling}
                >
                  Sign Up!
                </Button>
              </div>
            </div>
          </main>
        }
      </article>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
