import React, { useState, useEffect } from "react";
import ProfileItem from "./profileitem";
import values from "./values";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import { Backdrop } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Fade, IconButton } from "@material-ui/core";
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

  const fun = () => {
    fetch("http://localhost:3001/deleteUser", {
      method: "post",
      headers: { 
        Authentication: "Content-Type:application/json",
        "x-access-token": localStorage.getItem("token"), 
      },
      body: JSON.stringify({
        email: currentPost[id].email,
        array: currentPost,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data);
      })
      .catch((err) => console.log(err));
  };

  const funCall = (values, i) => {
    return (
      <Grid item xs={12} sm={4}>
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
      <div>
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
              <h2 id='transition-modal-title'>{userName}</h2>
              <div onClick={fun}>
                <IconButton
                  aria-label='delete'
                  className={classes.margin}
                  onClick={fun}
                >
                  <DeleteIcon fontSize='large' />
                </IconButton>
              </div>
              <div>
                {
                  <IconButton>
                    <Avatar
                      src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                      className=' pr2 h5 w5 grow  profile db'
                    />
                  </IconButton>
                }
              </div>

              <p id='transition-modal-description'>Name : {name}</p>
              <p id='transition-modal-description'>Field : {field}</p>
              <p id='transition-modal-description' className='center pl5 b'>
                {contact}
              </p>
            </div>
          </Fade>
        </Modal>
      </div>
      <Grid container direction='row'>
        <Grid item sm={0} xs={0} />
        <Grid item container spacing={3}>
          {currentPost.map((values, i) => funCall(values, i))}
        </Grid>
      </Grid>
    </div>
  );
}
