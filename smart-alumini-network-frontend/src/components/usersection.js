import React, { useState, useEffect } from "react";
import Schedule from "./schedule";
import { connect } from "react-redux";
import "./usersection.css";
import { Avatar } from "antd";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import { Backdrop } from "@material-ui/core";
import { Fade, Button, IconButton } from "@material-ui/core";
import { IKUpload,IKImage,IKContext } from "imagekitio-react";
import { setProfileForAccount } from "./redux/actions";

const axios = require("axios");

const mapStateToProps = (state) => {
  const email = state.emailDetails.emailCredentials;
  const x = { email };
  return x;
};

const mapDispatchToProps = (dispatch) =>{
  return {profileUpdateHandler: (image) => dispatch(setProfileForAccount(image))};
}

let prof = "";

var cardstyle = {
  display: "block",
  width: "100%",
  transitionDuration: "0.35s",
};

var cardstyle1 = {
  display: "block",
  width: "100%",
  transitionDuration: "0.35s",
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "250px",
    margin: "auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function UserSection(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [image, setImage] = React.useState({ preview: "", raw: "" });
  const [profile, setProfile] = React.useState("");
  const [fileName,setFileName]=useState("");
  
  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };
  


  React.useEffect(() => {
    props.setupAutoLogout();
    fetch("http://localhost:3001/getImage", {
      method: "get",
      headers: { 
        Authentication: "Content-Type:multipart/form-data", 
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.values.length; i++) {
          if (data.values[i].email === props.email) {
            prof = data.values[i].image;
            setProfile(prof);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpload = async (response) => {
      console.log("userSection.js:handleUpload")
      fetch(`http://localhost:3001/uploadImage?email=${props.email}&token=${localStorage.getItem("token")}`, {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/text", 
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          imagePath: response.url,
          email: props.email,
          fileId: response.fileId,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        prof = res.image;
        setProfile(prof);
        props.profileUpdateHandler(res.image);
      })
      .catch((err) => alert(err));
  };

  const handleOpen = (id) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const IKUploadHandleChange= (e)=>{
    // console.log("FileName changed successfully");
    // var ext=e.target.files[0].name.split('.')[1];
    // var localFile="";
    // localFile=Math.floor(Math.random()*1000000000000000)+10000000000000;
    // var emailInitial=props.email.split('@')[0];
    // localFile=localFile+emailInitial+"."+ext;
    // setFileName(localFile);
    // console.log(localFile,fileName);
  }
  return (
    <div className=''>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <label htmlFor='profileImage'>
              {profile.length ? (
                <img
                  src={profile}
                  alt='profile'
                  height='200'
                  width='200'
                  className='br-100 '
                />
              ) : (
                <Avatar
                  src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                  className='  h5 w5 grow  profile db w-80 h-auto '
                  style={{ height: "100px", width: "100px" }}
                />
              )}
            </label>
            {/* <input
              type='file'
              id='profileImage'
              style={{ display: "none" }}
              onChange={handleChange}
            /> */}
            <br />
            {/* <Button
              onClick={handleUpload}
              style={{ position: "relative", marginLeft: "50px" }}
            > */}
            <IKContext
              publicKey="public_RELv2MmXmSGi+gzUXw/BJwsnAzw="
              urlEndpoint="https://ik.imagekit.io/jatajay004"
              authenticationEndpoint={`http://localhost:3001/auth?email=${props.email}&token=${localStorage.getItem("token")}`}
              >
              <IKUpload 
              fileName={fileName}
              filePath=""
              useUniqueFileName={true}
              onSuccess={(response)=> handleUpload(response)}
              onError={(error)=>console.log(error)}
              />
            </IKContext>
            {/* </Button> */}
          </div>
        </Fade>
      </Modal>

      {/* <div className='mt6'>{<Button onClick={handleOpen}>UPLOAD</Button>}</div> */}
      <div style={{marginTop:"60px"}}></div>
      <Schedule />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSection);

// <br />
