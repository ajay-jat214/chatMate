import React from "react";
import Items from "./items";

function ItemContainer({ element }) {
  return element.map((element, id) => <Items key={id} element={element} />);
}

export default ItemContainer;
