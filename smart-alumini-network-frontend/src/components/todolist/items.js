import React from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "./items.css";

function Items({ element }) {
  return (
    <div className='flex '>
      <h1 className='f5 lh-copy'>{element}</h1>
      <div className='input'></div>
    </div>
  );
}

export default Items;
