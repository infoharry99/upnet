import React from "react";
import Solution from "./Solution";

const SolutionsList = () => {
  const solutions = [
    {
      icon: "💻",
      title: "Windows Cloud",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde nostrum ipsa ullam error odit quos omnis non incidunt repellendus suscipit!",
    },
    {
      icon: "📀",
      title: "Windows SQL Cloud",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde nostrum ipsa ullam error odit quos omnis non incidunt repellendus suscipit!",
    },
    {
      icon: "🖥️",
      title: "Windows Smart Dedicated",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde nostrum ipsa ullam error odit quos omnis non incidunt repellendus suscipit!",
    },
    {
      icon: "💻",
      title: "Plesk Windows Cloud",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde nostrum ipsa ullam error odit quos omnis non incidunt repellendus suscipit!",
    },
  ];

  return (
    <div className="solutions-list">
      {solutions.map((solution, index) => (
        <div className="solution-card" key={index}>
          <div
            className="in-border"
            style={{
              alignContent: "center",
              height: "110px",
              width: "110px",
              // padding: "5px",
              borderColor: "yellow",
              border: "2px solid #e97730",
              borderRadius: "50%",
              // display: "table",
              margin: "auto",
              backgroundColor: "transparent",
            }}
          >
            <div
              className="in-border"
              style={{
                height: "100px",
                width: "100px",
                padding: "10px",
                borderColor: "yellow",
                border: "2px solid #e97730",
                borderRadius: "50%",
                // display: "table",
                margin: "auto",
                backgroundColor: "red",
              }}
            >
              {/* <div
          className="in-border"
          style={{
            padding: "5px",
            // border: "2px solid #e97730",
            borderRadius: "50%",
            display: "table",
            margin: "auto",
            backgroundColor: "red",
          }}
        ></div> */}
              <figure>
                <img
                  src={"/images/self-control.svg"}
                  alt={"/images/self-control.svg"}
                />
              </figure>
            </div>
          </div>
          {/* <div className="icon-container">
            <span className="icon">{solution.icon}</span>
          </div> */}
          <div className="content">
            <h3 className="title">{solution.title}</h3>
            <p className="description">{solution.description}</p>
          </div>
        </div>
        // <Solution
        //   key={index}
        //   icon={solution.icon}
        //   title={solution.title}
        //   description={solution.description}
        // />
      ))}
    </div>
  );
};

export default SolutionsList;
