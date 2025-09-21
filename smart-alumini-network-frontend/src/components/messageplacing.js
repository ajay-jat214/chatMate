import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./homepage.css";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import "./homepage.css";

const mapStateToProps = (state) => {
  const state1 = state;
  const emailCredentials = state1.emailDetails.emailCredentials;
  const email = state1.searchChat.chatSearch.email;
  const x = { emailCredentials, email };
  return x;
};

class MessagePlacing extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount(){
  }
  
  render() {
    
    return (
      <div className="">
        {this.props.emailCredentials === this.props.value.emailCredentials ? (
          <div className='white right bg-black ' >
            {this.props.value.message}
          </div>
        ) :
         (
          <div className='left ml2'>{this.props.value.message}</div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(MessagePlacing);
