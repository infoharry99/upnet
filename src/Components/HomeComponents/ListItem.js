import React from "react";

const ListItem = ({ imgSrc, altText, title }) => {
  return (
    <div
      className="list-item see-sm-6 see-xsm-12"
      style={{
        padding: "15px 0",
        display: "inline-block",
        float: "unset",
        width: "50%",
        wordWrap: "break-word",
      }}
    >
      <div
        className="in-border"
        style={{
          alignContent: "center",
          height: "90px",
          width: "90px",
          // padding: "5px",
          borderColor: "yellow",
          border: "2px solid #E97730",
          borderRadius: "50%",
          // display: "table",
          margin: "auto",
          backgroundColor: "transparent",
          padding: "0",
        }}
      >
        <div
          className="in-border"
          style={{
            height: "75px",
            width: "75px",
            padding: "1px",
            borderColor: "yellow",
            border: "2px solid #E97730",
            borderRadius: "50%",
            // display: "table",
            margin: "auto",
            backgroundColor: "#E97730",
          }}
        >
          {/* <div
          className="in-border"
          style={{
            padding: "5px",
            // border: "2px solid #E97730",
            borderRadius: "50%",
            display: "table",
            margin: "auto",
            backgroundColor: "#E97730",
          }}
        ></div> */}
          <figure
            style={{
              background: "#e97730",
              borderRadius: "50%",
              padding: "10px",
              width: "70px",
              height: "70px",
              objectFit: "cover",
              display: "table",
              margin: "auto",
            }}
          >
            <img src={imgSrc} alt={altText} />
          </figure>
        </div>
      </div>

      <div
        className=""
        style={{
          // text-wrap: nowrap;
          // text-align: center;
          // text-transform: capitalize;
          // color: rgb(21, 78, 122);
          // font-size: 22px;
          // font-weight: 500;
          // padding: 10px;

          textTransform: "capitalize",
          textWrap: "nowrap",
          textAlign: "center",
          color: "#154e7a",
          fontSize: "17px",
          fontWeight: "600",
          padding: "10px",
        }}
      >
        {title}
      </div>
    </div>
  );
};

export default ListItem;
