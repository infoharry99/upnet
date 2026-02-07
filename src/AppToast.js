// NotificationItem.js
import React from "react";
import toast from "react-hot-toast";

const AppToast = ({ id, message, isMobile }) => {
  const handleDismiss = () => {
    toast.dismiss(id);
  };

  return (
    <div
      className="table-row-noti"
      style={{ boxShadow: "0px 11px 75px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bar"></div>
      <button
        style={{
          position: "absolute",
          right: "0px",
          top: "-30px",
          fontSize: "15px",
          color: "white",
          border: "1px solid #e9773000",
          backgroundColor: "#e97730",
          borderRadius: "8px",
        }}
        onClick={handleDismiss}
      >
        X
      </button>
      <div
        className="message"
        style={{ minHeight: "100px", minWidth: isMobile ? "250" : "450px" }}
      >
        <p style={{ fontSize: "23px" }}>{message}</p>
      </div>
    </div>
  );
};

export default AppToast;

// toast(
//   (t) => (
//     <div className="table-row-noti">
//       <div className="bar"></div>
//       <button
//         style={{
//           position: "absolute",
//           right: "15px",
//           top: "15px",
//           fontSize: "15px",
//           color: "white",
//           border: "1px solid #e9773000",
//           backgroundColor: "#07528b",
//           borderRadius: "8px",
//         }}
//         onClick={() => toast.dismiss(t.id)}
//       >
//         {" "}
//         X
//       </button>
//       <div
//         className="message"
//         style={{ minHeight: "100px", minWidth: "450px" }}
//       >
//         <p style={{ marginTop: "8%", fontSize: "23px" }}>ABCD</p>
//       </div>
//     </div>
//     // <span>
//     //   Custom and <b>bold</b>
//     //   <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
//     // </span>
//   ),
//   { duration: 60000000 }
// );
// toast(
//   "This toast is super big. I don't think anyone could eat it in one bite.\n\nIt's larger than you expected. You eat it but it does not seem to get smaller.",
//   {
//     duration: 600000,
//   }
// );
