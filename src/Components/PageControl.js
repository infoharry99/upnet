import React from "react";
// import "./PageControl.css";

const PageControl = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="page-control">
      {pages.map((page) => (
        <div
          key={page}
          className={
            currentPage === page ? "page-indicator active" : "page-indicator"
          }
          onClick={() => onPageChange(page)}
        ></div>
      ))}
    </div>
  );
};

export default PageControl;
