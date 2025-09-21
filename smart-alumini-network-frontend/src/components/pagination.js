import React from "react";
import { Button } from "@material-ui/core";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <Button color='primary'>
      <div className='pagination flex flex-row '>
        {pageNumbers.map((number) => (
          <div key={number} className='page-item  ma2'>
            <a onClick={() => paginate(number)} className=' pointer page-link'>
              {number}
            </a>
          </div>
        ))}
      </div>
    </Button>
  );
};

export default Pagination;
