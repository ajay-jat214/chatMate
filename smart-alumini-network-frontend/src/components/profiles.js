import React, { useState, useEffect } from "react";
import ProfileItem from "./profileitem";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import values from "./values";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import { Backdrop } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import { Avatar, Image } from "antd";
let prof = "";
let profile = [];

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

export default function Profiles({ currentPost }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [contact, setContact] = useState("");
  const [photo, setPhoto] = useState("");
  
  const handleOpen = (id) => {
    setId(id);
    setUserName(currentPost[id].userName);
    setName(currentPost[id].name);
    setField(currentPost[id].field);
    setContact(currentPost[id].contact);
    setPhoto(currentPost[id].photo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const funCall = (values, i) => {
    return (
      <Grid item xs={10} sm={4} md={4} lg={3} >
        <ProfileItem
          i={i}
          key={i}
          values={values}
          handleOpen={handleOpen}
          name={currentPost[i].name}
          photo={currentPost[i].photo}
        />
      </Grid>
    );
  };

  return (
    <div className='center tc'>
    
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
              <h2 id='transition-modal-title' style={{textAlign:"center"}}>{userName}</h2>
              <div>
                {photo.length ? (
                  <img
                    src={photo}
                    className=' grow  profile db xs'
                    style={{ height:"100px",width:"100px",borderRadius:"100%",margin:"auto" }}
                  />
                ) : (
                  <AccountCircleIcon
                  style={{ height: "100px", width: "100px",color:"#D3D3D3",borderRadius:"100%",margin:"auto" }}
                  />
                )}
              </div>
              <p id='transition-modal-description'>Name : {name}</p>
              <p id='transition-modal-description'>Field : {field}</p>
              <p id='transition-modal-description' className='center b ' style={{textAlign:"center"}}>
                {contact}
              </p>
            </div>
          </Fade>
        </Modal>
    
      <Grid container direction='column' justifyContent="center" alignItem="center">
        <Grid item container spacing={3} justifyContent="center" alignItem="center">
          {
            (currentPost.length)
            ?
              currentPost.map((values, i) => funCall(values, i))
            :
              <></>
            }
        </Grid>
      </Grid>
    </div>
  );
}
