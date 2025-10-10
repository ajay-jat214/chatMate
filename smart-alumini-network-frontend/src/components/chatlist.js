import React, { useState, useEffect } from "react";
import {connect} from "react-redux";
import values from "./values";
import ChatItem from "./chatitem";
import "./homepage.css";
import { Grid } from "@material-ui/core";
import { setChatUsers,setImageArray } from "./redux/actions";
import UserPersonalDetails from "./userPersonalDetails";
let data2;
let userValues1 = [],
  imageArray = [],
  prof = "",
  chat = [];
let timeStamp1 = [],
  notificationLength = 0;

const mapStateToProps=(state)=>{
  return state;
}

const mapDispatchToProps=(dispatch)=>{
  return {
    dispatchChatUsers: (users) => dispatch(setChatUsers(users)),
    handleImagesArray: (array) => dispatch(setImageArray(array)),
  }
}
function ChatList(props) {
  const [values, setValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [timeStamp, setTimeStamp] = useState([]);
  let dataObjects=                  {
    email: "",
    firstName: "",
    userName: "",
    field: "",
    lastName: "",
    contact: "",
    photo: "",
  };

  useEffect(() => {
    chat = [];
    setUserValues([]);
    imageArray = [];
    userValues1 = [];
    timeStamp1 = [];
    notificationLength = 0;
    chat = 0;

    for (let i = 0; i < userValues1.length; i++) userValues1.pop();
    for (let i = 0; i < userValues.length; i++) userValues.pop();
    for (let i = 0; i < timeStamp1.length; i++) timeStamp1.pop();
    for (let i = 0; i < timeStamp.length; i++) timeStamp.pop();
    for (let i = 0; i < imageArray.length; i++) imageArray.pop();
    for (let i = 0; i < chat.length; i++) chat.pop();
    
      const fetchData=async()=>{
        await fetch("http://localhost:3001/getImage", {
          method: "get",
          headers: { 
            Authentication: "Content-Type:multipart/form-data", 
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => response.json())
        .then((data1) => {
        
          if(data1.values.length){
              imageArray = data1;
              props.handleImagesArray(data1.values);
          } 
        })
        .catch((err) => console.log(err));
      
        await fetch("http://localhost:3001/fetchUsers", {
          method: "get",
          headers: { 
            Authentication: "Content-Type:application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            //console.log("data fetched from backend: ",data);
            if (data.values.length) {
            
              for (let i = 0; i < data.values.length; i++)
                // if (props.emailCredentials !== data.values[i].email)
                //   fetch("http://localhost:3001/fetchStamp/", {
                //     method: "post",
                //     headers: { 
                //       Authentication: "Content-Type:application/json", 
                //       "x-access-token": localStorage.getItem("token"),
                //     },
                //     body: JSON.stringify({
                //       email: data.values[i].email,
                //       emailCredentials: props.emailCredentials,
                //     }),
                //   })
                //   .then((res) => res.json())
                //   .then((data1) => {
                //     if (data1.length &&
                //       !timeStamp1.includes({
                //         emailCredentialsOfLastMessage:
                //           data1[0].message[data1[0].message.length - 1]
                //             .emailCredentials,
                //       })
                //     ) {
                //       timeStamp1 = [
                //         ...timeStamp1,
                //         {
                //           timeStamp:
                //             data1[0].message[data1[0].message.length - 1]
                //               .timeStamp,
                //           emailCredentialsOfLastMessage:
                //             data1[0].message[data1[0].message.length - 1]
                //               .emailCredentials,
                //         },
                //       ];
                //       // setTimeStamp([
                //       //   ...timeStamp,
                //       //   {
                //       //     timeStamp:
                //       //       data1[0].message[data1[0].message.length - 1]
                //       //         .timeStamp,
                //       //     emailCredentialsOfLastMessage:
                //       //       data1[0].message[data1[0].message.length - 1]
                //       //         .emailCredentials,
                //       //   },
                //       // ]);
                //     }
                //   })
                //   .catch((err) => console.log(err));

              timeStamp1.sort((a, b) =>
                a.timeStamp > b.timeStamp ? 1 : b.timeStamp > a.timeStamp ? -1 : 0
              );

              let sizeOfUsers=data.values.length;
              let sizeOfUsersImages=imageArray.values.length;
              for (let i = 0; i < sizeOfUsers; i++) {
                let j = 0;
               
                dataObjects.email= data.values[i].email;
                dataObjects.firstName= data.values[i].firstName;
                dataObjects.userName= data.values[i].userName;
                dataObjects.field= data.values[i].field;
                dataObjects.lastName= data.values[i].lastName;
                dataObjects.contact= data.values[i].phone;
                
                for (j; j < sizeOfUsersImages; j++) {
                 
                  if (data.values[i].email === props.handleImageArray.imageArray[j].email) {
                    dataObjects.photo = props.handleImageArray.imageArray[j].image;
                    setUserValues([...userValues, 
                    {
                      email: data.values[i].email,
                      firstName: data.values[i].firstName,
                      userName: data.values[i].userName,
                      field: data.values[i].field,
                      lastName: data.values[i].lastName,
                      contact: data.values[i].phone,
                      photo: props.handleImageArray.imageArray[j].image,
                    },]);
                  
                    if (data.values[i].email !== props.emailCredentials)
                      if (!userValues1.includes({ email: data.values[i].email })){
                        userValues1 = [
                          ...userValues1,
                          {
                            email: data.values[i].email,
                            firstName: data.values[i].firstName,
                            userName: data.values[i].userName,
                            field: data.values[i].field,
                            lastName: data.values[i].lastName,
                            contact: data.values[i].phone,
                            photo: props.handleImageArray.imageArray[j].image,
                          },
                        ];
                      
                      }
                    break;
                  }
                }

                if (j !== props.handleImageArray.imageArray.length) continue;
                if (!userValues1.includes({ email: data.values[i].email }))
                  setUserValues([...userValues,                          
                  {
                    email: data.values[i].email,
                    firstName: data.values[i].firstName,
                    userName: data.values[i].userName,
                    field: data.values[i].field,
                    lastName: data.values[i].lastName,
                    contact: data.values[i].phone,
                    photo: "",
                  },]);
                userValues1 = [
                  ...userValues1,
                  {
                    email: data.values[i].email,
                    firstName: data.values[i].firstName,
                    userName: data.values[i].userName,
                    field: data.values[i].field,
                    lastName: data.values[i].lastName,
                    contact: data.values[i].phone,
                    photo: "",
                  },
                ];

              }
              
              props.dispatchChatUsers(userValues1);
            } else {
              alert(data);
            }
        
          })
          .catch((err) => console.log(err));
      }
      //console.log("chat:",userValues1);
      fetchData();
  }, []);

  timeStamp1.sort((a, b) =>
    b.timeStamp > a.timeStamp ? 1 : a.timeStamp > b.timeStamp ? -1 : 0
  );
 
  chat = userValues1.filter((values, i) => {
    return values.firstName
      .toLowerCase()
      .includes(props.chatSearch.toLowerCase());
  });
  let x1=[];

  let k = timeStamp1.length - 1;
  let demoArray = [];

  x1=props.networkProfiles.profileArray;

  //if(!x1){
    x1=chat.filter((values, i) => {
      return values.firstName
        .toLowerCase()
        .includes(props.chatSearch.toLowerCase());
    });
  //}
  
  return (
    <div
      style={{
        overflowY: "scroll",
        overflow: "top",
        boxShadow: `1px 1px 2px 2px #D3D3D3`,
        height: "496.28px",
      }}
      className='ghumao'
    >
      {x1.map((values, id) => (
        <ChatItem
          values={x1}
          id={id}
          notificationLength={notificationLength}
          online={props.online}
          setCurrentSelectedEmail={props.setCurrentSelectedEmail}
        />
      ))}
    </div>
  );
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatList);


