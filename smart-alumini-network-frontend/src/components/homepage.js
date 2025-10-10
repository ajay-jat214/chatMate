import React, { useState, useEffect,useRef } from "react";
import { Card } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { CHANGE_CHAT_SEARCH } from "./redux/constants";
import ChatList from "./chatlist";
import "./homepage.css";
import Typewriter from "typewriter-effect";
import { setChatSearch, setChatBackGround } from "./redux/actions";
import values from "./values";
import Messaging from "./messaging";
import Chat from "./chat";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { messageSearch,setImageArray,setProfileForAccount, joinUser } from "./redux/actions";
import io from "socket.io-client";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";
import Grid from "@material-ui/core/Grid";
import NotificationSound from "./iPhone - 1 Sec Message Sound.mp3";
import { IKUpload,IKImage,IKContext } from "imagekitio-react";
import { ThreeSixty } from "@material-ui/icons";  

let dataArray = [];
let socket;
let prof = "";
let userValuse1 = [];
let imageArray = [];
let photo = "",chatProfile="";
let firstName = "";
let userValues = [];
let length = 0;

var cardstyle = {
  display: "block",
  height: "470px",
};
var cardd = {
  background: "rgba(85, 205, 232, 1)",
};

var carddd = {
  boxShadow: `1px 2px 2px 2px #d3d3d3ff`,
};

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

const mapStateToProps = (state) => {
  const emailCredentials = state.emailDetails.emailCredentials;
  const email = state.searchChat.chatSearch.email;
  const userName = state.searchChat.chatSearch.userName;
  const userNameCredentials = state.userNameDetails.userNameCredentials;
  const imageArray = state.handleImageArray.imageArray;
  const networkProfiles = state.networkProfiles;
  const profileForAccount = state.profileForAccount;
  const userJoined = state.setUserJoin.userJoined;
  const chatBGImage = state.chatBG.chatBGImage;
  const x = { emailCredentials, userNameCredentials, email, userName,imageArray, networkProfiles, userJoined, chatBGImage };
  return x;
};

const mapDispatchToProps = (dispatch) => {
  return { 
    //search: (values) => dispatch(messageSearch(values)),
    handleImagesArray: (values) =>dispatch(setImageArray(values)),
    profileUpdateHandler : (image) => dispatch(setProfileForAccount(image)),
    joinUser : (user) => dispatch(joinUser(user)),
    setChatImage : (user) => dispatch(setChatBackGround(user)),
   };
};

function HomePage(props) {
  const dispatch  = useDispatch();
  let currentSelectedEmail = useRef("");
  const selectedEmail = useSelector((state) => state.searchChat.chatSearch.email);
  const emailSelected = selectedEmail;
  const [chatSearch, setChatSearch] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [sentMessage, setSentMessage] = useState("");
  const [array, setArray] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [select, setSelect] = useState(-1);
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [demo, setDemo] = useState("");
  const [value, setValue] = useState([]);
  const [mess, setMess] = useState([]);
  const [online,setOnline] = useState({});
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [selectedFile,setSelectedFile] = useState(null);
  const [fileName,setFileName] = useState("");
  const [sessionMessages, setSessionMessages] = useState([]);
  const ENDPOINT = "http://localhost:3001/";
  const scrollToBottom = useScrollToBottom();
  
  //to be corrected
  const [aluminiSearch, SetAluminiSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(1);
  const indexOfLastPage = currentPage * postsPerPage;
  const indexOfFirstPage = indexOfLastPage - postsPerPage;
  const [demoArray, setDemoArray] = useState([]);
  const [userValues1, setUserValues1] = useState([]);
  const [profile,setProfile] = useState("");
  const audioPlayer = React.useRef(null);

  function playAudio() {
    if(audioPlayer.current)
      audioPlayer.current.play();
  }
  const setCurrentSelectedEmail = (email) =>{
    currentSelectedEmail.current= email;
  }
  //to be corrected
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

    const email = props.email;
    const name = props.userNameCredentials;
    const userNameCredentials = props.userNameCredentials;
    
    fetch("http://localhost:3001/messaging", {
      method: "post",
      headers: { 
        Authentication: "Content-Type:application/json", 
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        emailCredentials: props.emailCredentials,
        email: props.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length){ 
          setMessageList(data[0].message);
          setArray(data[0].message);
        }else{
          setArray([]);
        }
      })
      .catch((err) => {
        setMessageList([]);
      });
  }, [props.email]);

  useEffect(() => {
    setCurrentSelectedEmail(props.email);
    socket = io(ENDPOINT);
    //console.log("tokenExpiry:",localStorage.getItem("tokenExpiry"));
    props.setupAutoLogout();
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
          // if (data.values.length  &&
          //   data.values[i].email === this.props.emailDetails.emailCredentials
          // ) {
          //   this.state.prof = data.values[i].image;
          //   // localStorage.setItem("prof", this.state.prof);
          //   this.props.profileUpdateHandler(data.values[i].image);
          // }
          
          if (data.values.length  &&
            data.values[i].email === `${props.emailCredentials}:chat`
          ) {
              props.setChatImage(data.values[i].image);
          }
        }
      })
      .catch((err) => console.log(err));

      fetch("http://localhost:3001/messaging", {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/json", 
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          emailCredentials: props.emailCredentials,
          email: props.email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length) {
            //console.log("data:",data)
            //dataArray = data[0].message;
            setArray(data[0].message);
          } else setArray([]);
        })
        .catch((err) => {
          console.log(err);
        });

  }, []);


  useEffect(() => {
    
    socket.on("recieveMessage", ({ emailCredentials, email, message }) => {
      //console.log("currentSelectedEmail:",currentSelectedEmail);
      playAudio();
      if((email===props.emailCredentials)&&(currentSelectedEmail.current===emailCredentials)){
        //setArray([]);
        specialFunction1(email, emailCredentials, message);
        //setArray((prev)=>[...prev,{email,emailCredentials,message}]);
      }
    });

    
    let x=-1;
    socket.on("online",({status})=>{
      if((x==-1 || Date.now()>x)){
        if(status && online!=status)
          setOnline(status);
        x=Date.now()+10000;
      }
      //console.log("check online:",online);
    });
    //specialFunction1(props.email,props.emailCredentials);

  }, [dispatch]);

  const specialFunction1 =async (email,emailCredentials, message) => {

      await fetch("http://localhost:3001/messaging", {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/json", 
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          emailCredentials: emailCredentials,
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length && (props.email==emailCredentials)) {
            setArray([...data[0].messages]);
          } 
          else{ 
            setArray((prev)=>[...prev,{email:email,emailCredentials:emailCredentials,message:message}]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const toggleModal = (event) => {
    event.preventDefault();
    setIsModalOpen(!isModalOpen);
    //this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
  };

  const handleUpload = async (response) => {
      //console.log("homepage.js:handleUpload");
      fetch(`http://localhost:3001/uploadChattingImage?email=${props.emailCredentials}&token=${localStorage.getItem("token")}`, {
        method: "post",
        headers: { 
          Authentication: "Content-Type:application/text", 
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          imagePath: response.url,
          email: props.emailCredentials,
          fileId: response.fileId,
        }),
      })
      .then((response) => response.json())
      .then((res) => {
        prof = res.image;
        setProfile(prof);
      })
      .catch((err) => alert(err));
  };

  const sendMessage = (event) => {
    // setDemo("kdfjl");
    event.preventDefault();
    if (message.length) {
      event.preventDefault();
      // setSentMessage(message);
      if (message) {
        const email = props.email;
        const userName = props.userName;
        const userNameCredentials = props.userNameCredentials;
        const emailCredentials = props.emailCredentials;
        localStorage.setItem("email", email);
        socket.emit(
          "sendMessage",
          { email, message, userName, emailCredentials, userNameCredentials },
          () =>{ setArray([...array, {email,emailCredentials,message}]);}
        );
        setMessage("");
      }
      //specialFunction1(props.emailCredentials, props.email, message);
    }
  };

  const chatt = values.filter((values, i) => {
    return values.name.toLowerCase().includes(chatSearch.toLowerCase());
  });
 
  for (let i = 0; i < props.imageArray.length; i++) {
    //console.log("props.email:",props.email);
    chatProfile = props.email;
    if (props.imageArray[i].email === props.email) {
      photo = props.imageArray[i].image;
      break;
    } 
    else {
        photo = "";
        //console.log("chatProfile:",chatProfile);
    }
  }
  
  // for(let i in props.networkProfiles.profileArray.email){
  //   console.log("index",i);
  //   if(online[i])
  //     console.log("online[i]",online[i],",onine[i].date:",online[i].date)
  //   if( online[i] && online[i].date>Date.now-10000){
  //     console.log("logout called for ",i);
  //     socket.emit("logout", { email: this.props.emailDetails.emailCredentials });
  //   }
  // }

 
  return (
    <div style={{ marginTop: "30px"}}>
      <audio ref={audioPlayer} src={NotificationSound} />
      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        justifyContent="center"
      >   
        <div className='courier f2 lh-copy rok ' style={{ color: "#F75990" }}>
          <Typewriter
            options={{
              strings: ["CHAT..."],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </Grid>

      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        justifyContent="center"
      >        

          <Grid item xs={2} sm={4} md={3} lg={2} xl={2}>
{/* Search someone bar */}
            <Grid>
              <input
                className='h2 glow:hover input-reset b--white hover-bg-white hover-black  black pl4'
                placeholder='    search'
                style={{ width: "95%",height:"44px",background:"white",borderRadius:"99px",borderColor:"black" }}
                onChange={(event) => setChatSearch(event.target.value)}
              />
            </Grid>
{/* Profile section  */}
            <Grid>
              <ChatList
                demo={demo}
                chatSearch={chatSearch}
                array={messageList}
                currentPost={props.networkProfiles.profileArray}
                emailCredentials={props.emailCredentials}
                email={props.email}
                online={online}
                setCurrentSelectedEmail={setCurrentSelectedEmail}
              />
            </Grid>
          </Grid>


          <Grid
            item
            container
            direction='column'
            xl={4}
            lg={5}
            md={6}
            sm={8}
            xs={9}
          >

{/* Profile on top of Someone's chat         */}
            <Grid >
              {
              photo.length 
              ? 
                (
                  <Card style={cardd} className='flex row w-100'>
                    <div style={{position:"relative",display:"inline-block"}}>
                      <img
                        src={photo}
                        height='50px'
                        width='50px'
                        className='br-pill ml2'
                      />
                      <div style={{position:"absolute",top:"30px",left:"40px",fontSize:"20px"}}>{
                        (chatProfile in online)&&(online[chatProfile])&&(online[chatProfile].online) 
                        ?
                          <span style={{color: "green"}}>●</span>
                        :
                          ""
                      }</div>
                    </div>
                    <div className='white pl2 h-100-ns f3 measure-wide ml2 mt2'>
                      {(props.userName) && (props.userName.charAt(0).toUpperCase()+props.userName.slice(1))}
                    </div>
                    {
                      (online[chatProfile] && online[chatProfile].online)
                      ?
                      <>
                        <div style={{color:"white",width:"100%",paddingTop:"30px",marginRight:"10px",textAlign:"right"}}>online</div>
                        <img src='/upload.svg' alt="upload" className="pointer" onClick={toggleModal} style={{width:"37px",color:"white",maxWidth:"100%",marginLeft:"auto",paddingRight:"40px"}}/>
                      </>
                      :
                        <img src='/upload.svg' alt="upload" className="pointer" onClick={toggleModal} style={{width:"25px",color:"white",maxWidth:"100%",marginLeft:"auto",paddingRight:"40px"}}/>
                    }
                  </Card>
                ) 
              : 
                (
                  <Card style={cardd} className='white flex row'>
                    <div style={{position:"relative",display:"inline-block"}}>
                    <AccountCircleIcon
                      style={{ height: "50px", width: "50px",color:"white",background:"F75990" }}
                    />
                    <div style={{position:"absolute",top:"30px",left:"40px",fontSize:"20px"}}>{
                      (chatProfile in online)&&(online[chatProfile])&&(online[chatProfile].online) 
                      ?
                        <span style={{color: "green"}}>●</span>
                      :
                        ""
                    }</div>
                    </div>
                    <div className='white pl2 h-100-ns f3 measure-wide ml2 mt2'>
                      {(props.userName)&&(props.userName.charAt(0).toUpperCase()+props.userName.slice(1))}
                    </div>
                    {
                      (online[chatProfile] && online[chatProfile].online)
                      ?
                        <div style={{color:"white",width:"100%",paddingTop:"30px",marginRight:"10px",textAlign:"right"}}>online</div>
                      :
                        ""
                    }
                    <img src='/upload.svg' alt="upload" className="pointer" onClick={toggleModal} style={{width:"25px",color:"white",maxWidth:"100%",marginLeft:"auto",paddingRight:"40px"}}/>
                  </Card>
                )}
            </Grid>

{/* MessageBox */}

            <Grid>
              <div className='scroll'>
                <Card className="cover" style={props.chatBGImage?{background:`url(${props.chatBGImage})`,backgroundSize:"cover",height:"442px"}:{background:"url('../../assets/wall.jpg')",backgroundSize:"cover",height:"442px"}}>
                  {array.length ? (
                    <div className="rotate">
                        <Messaging
                          array={array}
                          // messages={messageList}
                          from={from}
                          to={to}
                          emailCredentials={props.emailCredentials}
                          email={props.email}
                        />
                    </div>
                  ) : (
                    <div className=' white b pl2 pt2' style={{height:"442px"}} >
                      Hey, Welcome to the Chat!!
                    </div>
                  )}
                </Card>
              </div>
            </Grid>

{/* Input message  */}

            <Grid>
              <div className='w-100 ajay'>
                <Card style={carddd}>
                  <input
                    placeholder='type message...'
                    style={{ height: "20px", width: "100%" }}
                    className='pa2 ma2 ba b--near-white'
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={(event) =>
                      event.key === "Enter" ? sendMessage(event) : null
                    }
                  />
                </Card>
              </div>
            </Grid>

          </Grid>
      </Grid>

      <div>
        {/* Profile Icon */}

        {/* Modal */}
        {isModalOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Upload Profile Picture</h3>
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
              {/* <input
                type="file"
                accept="image/*"
                onChange={this.handleFileChange}
              /> */}
              <div style={{ marginTop: "10px" }}>
                <button onClick={toggleModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
