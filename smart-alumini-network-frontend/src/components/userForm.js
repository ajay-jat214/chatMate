import React from "react";
import UserFormDetails from "./userFormDetails";
import UserPersonalDetails from "./userPersonalDetails";
import ConfirmUserDetails from "./confirmUserDetails";
import Success from "./success";

export default class UserForm extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      username: "",
      password: "",
      field: "",
      company: "",
      placedYear: "",
    };
  }

  nextStep = async (data) => {
    if (data === "next") await this.setState({ step: this.state.step + 1 });
    if (this.state.step === 3 && data !== "next") {
      if (data === "success") this.setState({ step: this.state.step + 1 });
      else {
        this.setState({ step: 1 });
        alert(data);
      }
    }
  };
  prevStep = () => {
    this.setState({ step: this.state.step - 1 });
  };
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };
  funCalling2 = (e) => {
    e.preventDefault();
    this.props.funCalling();
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      contact,
      username,
      password,
      field,
      company,
      placedYear,
    } = this.state;
    const values = {
      firstName,
      lastName,
      email,
      contact,
      username,
      password,
      field,
      company,
      placedYear,
    };

    switch (this.state.step) {
      case 1:
        return (
          <UserFormDetails
            nextStep={this.nextStep}
            values={values}
            handleChange={this.handleChange}
            funCalling2={this.funCalling2}
            admin={this.props.admin}
          />
        );
      case 2:
        return (
          <UserPersonalDetails
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            values={values}
            handleChange={this.handleChange}
            admin={this.props.admin}
          />
        );
      case 3:
        return (
          <ConfirmUserDetails
            prevStep={this.prevStep}
            nextStep={this.nextStep}
            values={values}
            admin={this.props.admin}
          />
        );
      case 4:
        return (
          <Success
            values={values}
            funCalling2={this.funCalling2}
            admin={this.props.admin}
          />
        );
      default:
        return (
          <UserFormDetails
            nextStep={this.nextStep}
            values={values}
            handleChange={this.handleChange}
            funCalling2={this.funCalling2}
            admin={this.props.admin}
          />
        );
    }
  }
}
