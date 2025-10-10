import React, { useState, useEffect } from "react";
import values from "./values";
import { Card } from "@material-ui/core";
import Profiles1 from "./profiles1";
import { setAluminiSearch } from "./redux/actions";
import { connect } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { CHANGE_ALUMINI_SEARCH } from "./redux/constants";
import Pagination from "./pagination";
import { withRouter } from "react-router-dom";
import { setFilteredSearch } from "./redux/actions";
import Typewriter from "typewriter-effect";
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
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: (aluminiSearch) => dispatch(setAluminiSearch(aluminiSearch)),
    search2: (aluminiSearch) => dispatch(setFilteredSearch(aluminiSearch)),
  };
};

function DeleteUsers(props) {
  const [aluminiSearch, SetAluminiSearch] = useState("d");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(1);
  const indexOfLastPage = currentPage * postsPerPage;
  const indexOfFirstPage = indexOfLastPage - postsPerPage;
  const [demoArray, setDemoArray] = useState([]);
  const [userValues1, setUserValues1] = useState([]);
  useEffect(() => {
    userValues = [];
    setUserValues1([]);
    fetch("http://localhost:3001/getImage", {
      method: "get",
      headers: { Authentication: "Content-Type:multipart/form-data" },
    })
      .then((response) => response.json())
      .then((data1) => {
        imageArray = data1;
      })
      .catch((err) => console.log(err));
    fetch("http://localhost:3001/fetchUsers", {
      method: "get",
      headers: { Authentication: "Content-Type:application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        length = data.values.length;
        if (data.values.length) {
          for (let i = 0; i < data.values.length; i++) {
            let j = 0;
            for (j; j < imageArray.values.length; j++) {
              if (data.values[i].email === imageArray.values[j].email) {
                prof = imageArray.values[j].image;
                prof = prof.substring(15, prof.length);
                prof = "http://localhost:3001/uploads/" + prof;
                userValues = [
                  ...userValues,
                  {
                    name:
                      data.values[i].firstName + " " + data.values[i].lastName,
                    email: data.values[i].email,
                    firstName: data.values[i].firstName,
                    userName: data.values[i].userName,
                    field: data.values[i].field,
                    lastName: data.values[i].lastName,
                    contact: data.values[i].phone,
                    photo: prof,
                  },
                ];
                setUserValues1([
                  ...userValues1,
                  {
                    name:
                      data.values[i].firstName + " " + data.values[i].lastName,
                    email: data.values[i].email,
                    firstName: data.values[i].firstName,
                    userName: data.values[i].userName,
                    field: data.values[i].field,
                    lastName: data.values[i].lastName,
                    contact: data.values[i].phone,
                    photo: prof,
                  },
                ]);
                setDemoArray(data.values);
                break;
              }
            }

            if (j !== imageArray.values.length) continue;
            userValues = [
              ...userValues,
              {
                name: data.values[i].firstName + " " + data.values[i].lastName,
                email: data.values[i].email,
                firstName: data.values[i].firstName,
                userName: data.values[i].userName,
                field: data.values[i].field,
                lastName: data.values[i].lastName,
                contact: data.values[i].phone,
                photo: "",
              },
            ];

            setUserValues1([
              ...userValues1,
              {
                name: data.values[i].firstName + " " + data.values[i].lastName,
                email: data.values[i].email,
                firstName: data.values[i].firstName,
                userName: data.values[i].userName,
                field: data.values[i].field,
                lastName: data.values[i].lastName,
                contact: data.values[i].phone,
                photo: "",
              },
            ]);
            setDemoArray(data.values);
          }
        } else {
          alert(data);
        }
      });
  }, []);

  let currentPost = userValues.filter((Values) => {
    return Values.firstName.toLowerCase().includes(aluminiSearch.toLowerCase());
  });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log("pagenumber:", pageNumber);
  };

  const search1 = (event) => {
    SetAluminiSearch(event.target.value);
  };

  return (
    <div className='tc pb1 pt4 calisto'>
      <div className='relative pt4 dib'>
        <input
          className=' tc w-100 ba b--black-20 h2  input-reset '
          placeholder='search alumini'
          onChange={(event) => search1(event)}
        />
        <div className='dib relative bottom-1 left-2'>
          <div className='relative left-2'>
            <div className='relative left-2'>
              <InputAdornment>
                <IconButton>
                  <SearchIcon
                    onClick={() => {
                      props.search(aluminiSearch);
                      props.search2(aluminiSearch);
                    }}
                  />
                </IconButton>
              </InputAdornment>
            </div>
          </div>
        </div>
      </div>

      <div className=''>
        <Profiles1 currentPost={currentPost} demoArray={demoArray} />
      </div>
      <div></div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUsers);
//<Pagination postsPerPage={postsPerPage} totalPosts={length} paginate={paginate}/>

// useEffect(()=>{
//     fetch('http://localhost:3001/fetchUsers', {
//                method: 'get',
//                headers: { Authentication: 'Content-Type:application/json' },
//            })
//            .then(response => response.json())
//            .then(data => {
//                 console.log(data);
//                 let j=1;
//                 userValues=[];
//                 for(let i of data.values){
//                 	userValues=[...userValues,{userName:i.userName,field:i.field,name:i.firstName+" "+ i.lastName,lastName:i.lastName,id:j++,contact:i.phone}];
//                 	setUserValues1([...userValues1,{userName:i.userName,field:i.field,name:i.firstName+" "+ i.lastName,lastName:i.lastName,id:j++,contact:i.phone}])
//                 }
//                 console.log(userValues);
//            })
//            .catch(err=>console.log(err))

// },[])
