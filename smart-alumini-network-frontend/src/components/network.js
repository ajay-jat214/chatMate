import React, { useState, useEffect } from "react";
import values from "./values";
import { Card } from "@material-ui/core";
import Profiles from "./profiles";
import { setAluminiSearch, setNetworkProfiles, setImageArray } from "./redux/actions";
import { connect } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { CHANGE_ALUMINI_SEARCH } from "./redux/constants";
import Pagination from "./pagination";
import { withRouter } from "react-router-dom";
import { setFilteredSearch } from "./redux/actions";
import Typewriter from "typewriter-effect";
import Grid from "@material-ui/core/Grid";
import "./usersection.css";
import { handleImageArray } from "./redux/reducer";
let userValues = [];
let length = 0;
let imageArray = [];
let prof = "";
let state = "";
var cardstyle = {
  width: "100%",
  height: "window.innerHeight",
  margin: "32px",
};
const mapStateToProps = (state) => {
  state = state;
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: (aluminiSearch) => dispatch(setAluminiSearch(aluminiSearch)),
    search2: (aluminiSearch) => dispatch(setFilteredSearch(aluminiSearch)),
    networkProfilesHandler: (userValues) => dispatch(setNetworkProfiles(userValues)),
    handleImagesArray: (array) => dispatch(setImageArray(array)),
  };
};

function Network(props) {
  const [aluminiSearch, SetAluminiSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(1);
  const indexOfLastPage = currentPage * postsPerPage;
  const indexOfFirstPage = indexOfLastPage - postsPerPage;
  const [demoArray, setDemoArray] = useState([]);
  const [userValues1, setUserValues1] = useState([]);
 
  const profileHandler = (data,i) => {
      return {
          name:
            data.values[i].firstName.charAt(0).toUpperCase() +
            data.values[i].firstName.slice(1) +
            " " +
            data.values[i].lastName.charAt(0).toUpperCase() +
            data.values[i].lastName.slice(1),
          email: data.values[i].email,
          firstName: data.values[i].firstName,
          userName: data.values[i].userName,
          field: data.values[i].field,
          lastName: data.values[i].lastName,
          contact: data.values[i].phone,
          photo: "",
      }
  }
  useEffect(() => {
    props.setupAutoLogout();
    userValues = [];
    setUserValues1([]);
  
    fetch("http://localhost:3001/getImage",{
          method: "get",
          headers: { 
            Authentication: "Content-Type:multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
    })
    .then((response) => response.json())
    .then((data1) =>{
        //console.log("data1:::::::::",data1)
        props.handleImagesArray(data1.values);
    })
    .catch((err) => console.log(err));


    fetch("http://localhost:3001/fetchUsers", {
      method: "get",
      headers: { 
        Authentication: "Content-Type:application/json", 
        "x-access-token": localStorage.getItem("token"),
      },
    })
    .then((response) => response.json())
    .then((data) => {
        length = data.values.length;
  
        if (length) {
            for (let i = 0; i < length; i++) {
                let j = 0, jLength=props.handleImageArray.imageArray.length;

                const detailsObject=profileHandler(data,i);
              
                for (j; j < jLength; j++) {
                    if (data.values[i].email === props.handleImageArray.imageArray[j].email) {
                        detailsObject.photo=props.handleImageArray.imageArray[j].image;
                        userValues = [...userValues,detailsObject,];
                        setUserValues1([...userValues1,detailsObject,]);
                        setDemoArray(data.values);
                        break;
                    }
                }
               
                if (j !== props.handleImageArray.imageArray.length){ continue };

                //detailsObject.photo="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";
                userValues = [...userValues,detailsObject];
                setUserValues1([...userValues1,detailsObject]);
                setDemoArray(data.values);
            }
           
            props.networkProfilesHandler(userValues);
        } else {
            alert(data);
        }
    })
    .catch(err=>console.log(err));

  }, []);
  //console.log(props.networkProfiles);
  var currentPost=[];
  //console.log("props::::",props);
  if(props.networkProfiles.profileArray.length){
    //console.log("props.networkProfiles:",props.networkProfiles);
    currentPost = props.networkProfiles.profileArray.filter((Values) => {
      return Values.field.toLowerCase().includes(aluminiSearch.toLowerCase());
    });
  }
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    //console.log("pagenumber:", pageNumber);
  };

  const search1 = (event) => {
    SetAluminiSearch(event.target.value);
  };
 
  return (
    <div className="center tc" >
      <div className='courier f2 lh-copy ' style={{ color: "#F75990" }}>
        <Typewriter
          options={{
            strings: ["WELCOME"],
            autoStart: true,
            loop: true,
            cursorClassName: "Typewriter_cursor ",
          }}
          cursorClassName='Typewriter_cursor'
        />
      </div>
      <div className='relative pt4 dib mt4'>
        <input
          className=' tc w-100 ba b--black-20 h2  input-reset newStyle searchAlumini'
          placeholder='search alumini'
          onChange={(event) => search1(event)}
          style={{borderRadius:"20px"}}
        />
        <div className='dib relative bottom-1 left-2'>
          <div className='relative left-2'>
            <div className='relative left-2'>
              <InputAdornment>
                <IconButton>
                  <SearchIcon/>
                </IconButton>
              </InputAdornment>
            </div>
          </div>
        </div>
      </div>
      <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item direction="column" justifyContent="center" alignItems="center"  xs={10} sm={10} md={8} lg={7} xl={6} style={{marginTop:"50px"}}>
            <Profiles currentPost={currentPost} />
          </Grid>
      </Grid>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Network));


//<Pagination postsPerPage={postsPerPage} totalPosts={length} paginate={paginate}/>
