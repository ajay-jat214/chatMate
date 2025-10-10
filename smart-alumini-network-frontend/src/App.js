import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import Particles from "react-particles-js";
import io from "socket.io-client";
import { AppBar, Toolbar, IconButton, Tooltip } from "@material-ui/core";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Grid from "@material-ui/core/Grid";
import { Card } from "@material-ui/core";
import { IKUpload,IKImage,IKContext } from "imagekitio-react";
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';

import { setAluminiSearch, setProfileForAccount, joinUser, setFilteredSearch,setChatBackGround } from "./components/redux/actions";
import { searchAlumini, searchFiltered, chatBG } from "./components/redux/reducer";

import Admin from "./admin";
import Navigation from "./components/navigation";
import ProfileIcon from "./components/profileIcon";
import Network from "./components/network";
import HomePage from "./components/homepage";
import UserSection from "./components/usersection";
import UserForm from "./components/userForm";
import Signin from "./components/signin";
import Register from "./components/register";
import values from "./components/values";
import "./App.css";

let socket;
const ENDPOINT = "https://chatmate-kle0.onrender.com/";

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) =>{
  return {
    profileUpdateHandler : (image) => dispatch(setProfileForAccount(image)),
    joinedUser : (user) => dispatch(joinUser(user)),
    chatBGImage : (user) => dispatch(setChatBackGround(user)),
  };
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
};
  
let prof='';

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      routes: "unsuccess",
      signUp: false,
      prof: "",
      open: false,
      isModalOpen: false,
      selectedFile: null,
      profile:"",
      fileName:"",
    };
  }

  componentDidUpdate() {
    fetch("https://chatmate-kle0.onrender.com/getImage", {
      method: "get",
      headers: { 
        Authentication: "Content-Type:multipart/form-data",
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.values.length; i++) {
          if ( data.values.length &&
            data.values[i].email === this.props.emailDetails.emailCredentials
          ) {
            this.state.prof = data.values[i].image;
            localStorage.setItem("prof", this.state.prof);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    //console.log("localStorage:",localStorage);
    socket = io(ENDPOINT);
    this.setupAutoLogout();
    fetch("https://chatmate-kle0.onrender.com/getImage", {
      method: "get",
      headers: { 
        Authentication: "Content-Type:multipart/form-data",
        "x-access-token": localStorage.getItem("token"), 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.values.length; i++) {
          if (data.values.length  &&
            data.values[i].email === this.props.emailDetails.emailCredentials
          ) {
            this.state.prof = data.values[i].image;
            this.props.profileUpdateHandler(data.values[i].image);
          }
          
          if (data.values.length  &&
            data.values[i].email === `${this.props.emailDetails.emailCredentials}:chat`
          ) {
              this.props.chatBGImage(data.values[i].image);
          }
        }
      })
      .catch((err) => console.log(err));
  }


  rerender = (routes) => {
    this.setState({ routes: routes });
    localStorage.setItem("routes", routes);
  };

  toggleModal = () => {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  };

  handleUpload = async (response) => {
      fetch(`https://chatmate-kle0.onrender.com/uploadImage?email=${this.props.emailDetails.emailCredentials}&token=${localStorage.getItem("token")}`, {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/text", 
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          imagePath: response.url,
          email: this.props.emailCredentials,
          fileId: response.fileId,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        prof = res.image;
        this.state.profile=prof;
        this.props.profileUpdateHandler(res.image);
      })
      .catch((err) => {alert(err);});
  };

  // Handle file select
  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // this.setState({ selectedFile: file });
      //console.log("Selected file:", file);

      // 🔹 Call your custom function here
      if (this.props.onFileSelect) {
        this.props.onFileSelect(file);
      }
    }
  };
 
  handleOpen = (id) => {
    this.state.open = true;
    // setOpen(true);
  };

  timer=null;
  logout = async () => {
    //console.trace("*********log out called");
    let r;
    if (this.timer) {
      clearTimeout(this.timer); // ✅ stop pending auto logout
      this.timer = null;
    }
    //console.log("APPjs Props:",this.props.emailDetails.emailCredentials);
    socket.emit("logout", { email: this.props.emailDetails.emailCredentials });
    this.props.joinedUser(-1);
    //console.log("logout jonieduser:",this.props.setUserJoin.userJoined);
    await fetch("https://chatmate-kle0.onrender.com/logout", {
      method: "post",
      headers: { 
        Authentication: "Content-Type:application/json", 
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((user) => {
        r = user;
        this.props.profileUpdateHandler("");
        //console.log("logout value:",this.props.profileForAccount);
        localStorage.setItem("routes", user);
        localStorage.removeItem("prof");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        this.props.chatBGImage("");
      });
    this.setState({ routes: r });
    localStorage.clear();
  };

  funCalling = () => {
    this.setState({ signUp: !this.state.signUp });
  };
  

  setupAutoLogout = () => {
    const expiry = localStorage.getItem("tokenExpiry");
    //console.log("expiry:",expiry);
    //console.log("current dat:",Date.now()/1000);
    // try { 
      let remainingTime=7200000 ;
      if(expiry)
        remainingTime = (expiry - (Date.now())/1000)*1000;
      //console.log("remaining TIme:",remainingTime);
      if (remainingTime <= 0) {
        this.logout();
      } else {
        this.timer = setTimeout(() => {
          this.logout();
        }, remainingTime);
      }
    // }
    // catch (err) {
    //   this.logout();
    // }
  };

  buttonClick = (event) => {
    addNotification({
        title: 'Error',
        subtitle: 'This is a subtitle',
        message: "Failed to Upload",
        theme: 'red',
        native: true // when using native, your OS will handle theming.
    });
  };

  render() {


    return localStorage.getItem("routes") === "admin" 
    ? 
    //Admin Login
      (
        <Admin logout={this.logout} />
      )
    : 
    //User Login
      (localStorage.getItem("routes") === "success") 
      ? 
      // Signed In Page
        (
          <div>

            <Toolbar class="flex center tc" style={{ }}> 

              <Grid
              container
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              justifyContent="center"
              > 
                <Grid xl={2} lg={2} md={3} sm={4} xs={2} className="gridItem-navigation">
                  <Navigation />
                </Grid>
                <Grid xl={4} lg={5} md={6} sm={8} xs={9} className="gridItem-user">
                  <Tooltip title="Upload">
                    <IconButton aria-label='Image' onClick={this.toggleModal}>
                      <ProfileIcon profileAccount={this.props.profileForAccount}/>
                    </IconButton>
                  </Tooltip>

                  <div>
                    {/* Profile Icon */}

                    {/* Modal */}
                    {this.state.isModalOpen && (
                      <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                          <h3>Upload Profile Picture</h3>
                          <IKContext
                            publicKey="public_RELv2MmXmSGi+gzUXw/BJwsnAzw="
                            urlEndpoint="https://ik.imagekit.io/jatajay004"
                            authenticationEndpoint={`https://chatmate-kle0.onrender.com/auth?email=${this.props.emailDetails.emailCredentials}&token=${localStorage.getItem("token")}`}
                            >
                            <IKUpload 
                            fileName={this.state.fileName}
                            filePath=""
                            useUniqueFileName={true}
                            onSuccess={(response)=> this.handleUpload(response)}
                            onError={(error)=>{this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));this.buttonClick(error)}}
                            />
                          </IKContext>
                          {/* <input
                            type="file"
                            accept="image/*"
                            onChange={this.handleFileChange}
                          /> */}
                          <div style={{ marginTop: "10px" }}>
                            <button onClick={this.toggleModal}>Close</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Tooltip title='Log Out' >
                    <Button
                      onClick={this.logout}
                      style={{color: "black" }}
                    >
                      <ExitToAppOutlinedIcon />
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
          
            </Toolbar>

            <div>
              <Switch>
                <Route path='/usersection' render={(props)=><UserSection setupAutoLogout={this.setupAutoLogout} />}  />
                <Route path='/network' render={(props)=><Network setupAutoLogout={this.setupAutoLogout} />} />
                <Route path='/' render={(props)=><HomePage   setupAutoLogout={this.setupAutoLogout} />} />
              </Switch>
            </div>
            
          </div>
        ) 
      : 
      // Login/Signup Page
        (
          <div>
            {!this.state.signUp && this.state.SignUp !== false 
            ? 
              (
                <div class='particles'>
                  <Particles
                    className='particles'
                    params={{
                      particles: {
                        number: {
                          value: 45,
                          density: {
                            enable: true,
                            value_area: 800,
                          },
                        },
                      },
                      shape: {
                        type: "circle",
                        stroke: {
                          width: 1,
                          color: "tomato",
                        },
                      },
                      size: {
                        value: 8,
                        random: true,
                        anim: {
                          enable: true,
                          speed: 10,
                          size_min: 0.1,
                          sync: true,
                        },
                      },
                    }}
                  />
                  <div className='bgds'>
                    <Signin
                      onEmailChange={this.onEmailChange}
                      onStateChange={this.onStateChange}
                      rerender={this.rerender}
                      funCalling={this.funCalling}
                    />
                  </div>
                </div>
              ) 
            : 
              (
                <UserForm funCalling={this.funCalling} admin='user' />
              )
            }
          </div>
        );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
