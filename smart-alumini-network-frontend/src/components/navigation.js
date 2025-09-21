import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { List } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { ListItemIcon } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";
//import InboxIcon from '@material-ui/icons/MoveToInbox';
//import MailIcon from '@material-ui/icons/Mail';
import { Link } from "react-router-dom";
import Network from "./network";
import HomePage from "./homepage";
import UserSection from "./usersection";
import "./hero.css";
import { Grid } from "@material-ui/core";
import { Card, Tooltip, IconButton } from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import DehazeIcon from '@material-ui/icons/Dehaze';

const useStyles = makeStyles({
  list: {
    width: 250,
    height: window.innerHeight,
  },
  fullList: {
    width: "auto",
  },
});

export default function Navigation(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <div className=' anchor1'>
      <div
        className={clsx(classes.list, {
          [classes.fullList]: anchor === "top" || anchor === "bottom",
        })}
        role='presentation'
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List store={props.store}>
          {" "}
          {["Network"].map((text, index) => (
            <Link to='/network' className='link'>
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>{" "}
            </Link>
          ))}{" "}
        </List>
        <Divider />
        <List>
          {" "}
          {["HomePage"].map((text, index) => (
            <Link to='/' className='link'>
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}{" "}
        </List>
        <Divider />
        <List>
          {" "}
          {["UserSection"].map((text, index) => (
            <Link to='/usersection' className='link'>
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}{" "}
        </List>
        <Divider />
      </div>
    </div>
  );

  return (
        <div style={{backgroundColor:"rgba(190, 242, 253, 1)" }}>
          {" "}
          {["right"].map((anchor) => (
            <React.Fragment key={anchor} >
              <img src='/assets/network.svg' alt="Network" class="pointer pl2 pt3" style={{height:"80px"}} onClick={toggleDrawer(anchor, true)}/>
             {/* <Tooltip title='Section' style={{backgroundColor : 'white',color:"black" }}>
                <IconButton>
                  <DehazeIcon
                    onClick={toggleDrawer(anchor, true)}
                    fontSize='large'
                  />
                </IconButton>
              </Tooltip> */}
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {" "}
                {list(anchor)}{" "}
              </Drawer>
            </React.Fragment>
          ))}{" "}
        </div>
  );
}
