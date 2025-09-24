import React from "react";
import { connect } from "react-redux";
import MessagePlacing from "./messageplacing";
import Chat from "./chat";
import ScrollToBottom from "react-scroll-to-bottom";
//import ReactEmoji from 'react-emoji';
import "./homepage.css";
let messages = [];
let i = 1;

const mapStateToProps = (state) => {
  const emailCredentials = state.emailDetails.emailCredentials;
  const email = state.searchChat.chatSearch.email;
  const userName = state.searchChat.chatSearch.userName;
  const userNameCredentials = state.userNameDetails.userNameCredentials;
  const x = { emailCredentials, userNameCredentials, email, userName };
  return x;
};

class Messaging extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      email: "",
    };
  }
  componentDidMount() {
    this.setState({ email: this.props.email });
  }

  call = () => {
    fetch("https://chatmate-kle0.onrender.com/messaging", {
      method: "post",
      headers: { 
        Authentication: "Content-Type:application/json", 
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        emailCredentials: this.props.emailCredentials,
        email: this.props.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.length){
          messages = data[0].message;
          this.setState({ messages: data[0].message });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ messages: [] });
      });
  };

  render() {
    
    if (this.state.email !== this.props.email) {
      this.setState({ email: this.props.email });
      this.call();
    }
    
    if (
      this.props.array.length &&
      this.state.messages.length !== this.props.array.length
    ) {
      this.setState({ messages: this.props.array });
    }
    
    return (
      <div className="wall messaging" style={{overflowY:"scroll",scrollbarWidth:"none",overflow:"top"}} >
        <div className="rotate">
        {
          this.state.email === this.props.email
          ? 
            this.props.array.map((message, i) => {
              return <MessagePlacing value={this.props.array[i]}/>;
            })
          : 
            null
        }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Messaging);

// <div>{
//   this.props.messages.length
//   ?
//   <div  className="blue right">{this.props.messages[this.props.messages[this.props.messages.length-1]]}</div>
//   :
//   null
// }</div>
