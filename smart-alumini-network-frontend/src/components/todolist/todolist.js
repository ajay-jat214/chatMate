import React from "react";
import ItemContainer from "./itemcontainer";

export default class ToDoList extends React.Component {
  constructor() {
    super();
    this.state = {
      variable: "",
      element: [],
      value: "",
    };
  }

  onAdd = (event) => {
    this.setState({ variable: event.target.value });
    this.setState({ value: event.target.value });
  };

  onclick = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      //e.preventDefault();
      this.setState({ value: "" });
      this.setState({ element: [...this.state.element, this.state.variable] });
    } //console.log(this.state.element)
  };
  render() {
    return (
      <div>
        <ItemContainer element={this.state.element} />
      </div>
    );
  }
}
