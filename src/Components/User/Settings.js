import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import instance, { apiEncryptRequest, decryptData } from "../../Api";
import { useAuth } from "../../AuthContext";
import Loader from "../common/Loader";
import { useNavigate } from "react-router-dom";
import AppToast from "../../AppToast";
import toast, { Toaster } from "react-hot-toast";

const SettingsPage = (props) => {
  const { smuser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [isHovered, setIsHovered] = useState(false);
  const [is2faStatus, set2FAStatus] = useState(0);

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }
  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    set2FAStatus(smuser["2fa_status"]);
    // console.log(smuser["2fa_status"], "smuser");

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, is2faStatus]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const StatusChange = async () => {
    setLoading(true);

    const payload = {
      user_id: smuser.id,
      status: is2faStatus === 1 ? 0 : 1,
    };
    try {
      const encryptedResponse = await apiEncryptRequest(payload);
      const loginUserResponse = await instance.post(
        "/statuschange",
        encryptedResponse
      );
      const loginResponse = await decryptData(loginUserResponse.data);
      // console.log(loginResponse, "statusRes");

      if (loginResponse.success) {
        toast((t) => (
          <AppToast
            id={t.id}
            message={loginResponse.message}
            isMobile={isMobile}
          />
        ));

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast((t) => (
          <AppToast
            id={t.id}
            message={loginResponse.message}
            isMobile={isMobile}
          />
        ));
      }
    } catch (error) {
      console.error("Error during the login process:", error);
      toast((t) => <AppToast id={t.id} message={error} />);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: isMobile ? "50rem" : "65rem",
        position: "relative",
        backgroundImage: isMobile ? `url(./main-bg.jpg)` : `url(./main-bg.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "round",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="apptoast-align">
        <Toaster
          position={isMobile ? "top-center" : "bottom-right"}
          reverseOrder={false}
        />
      </div>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: "999999999" }}>
          <Loader isLoading={loading} />
        </div>
      )}
      {isMobile ? (
        <>
          <div className="heading-dotted-support" style={{ left: "4%" }}>
            Settings <span></span>
          </div>
          <div
            style={{
              justifyItems: "center",
            }}
          >
            <div className="stat" style={{ width: "13rem" }}>
              <div className="machine-icon-edit-profile">
                <img src={"/admin/images/admin/13-Profile/user-white.png"} />
              </div>
              <div className="machine-title theme-bg-orange">Child Users</div>
              <div className="mid-portion" />
              <div
                className="machine-subtitle theme-bg-blue"
                style={{ width: "190px", cursor: "pointer" }}
                onClick={() => {
                  navigate("/childuser");
                }}
              >
                Create User
              </div>
            </div>

            <div
              className="stat"
              style={{
                width: "11rem",
              }}
            >
              <div className="machine-icon-edit-profile">
                <img src={"/images/admin/06-View-Stats/switch.svg"} />
              </div>
              <div
                className="machine-title"
                style={{
                  backgroundColor:
                    is2faStatus && is2faStatus === 1 ? "green" : "red",
                }}
              >
                {is2faStatus && is2faStatus === 1 ? "2FA ON" : "2FA OFF"}
              </div>
              <div className="mid-portion" />
              <div
                className="machine-subtitle theme-bg-blue"
                style={{ width: "170px", cursor: "pointer" }}
                onClick={() => StatusChange()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {isHovered
                  ? is2faStatus === 1
                    ? "Disable"
                    : "Enable"
                  : is2faStatus === 1
                  ? "Enable"
                  : "Disable"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="heading-dotted-support"
            style={{ left: "5%", marginTop: "3.5rem" }}
          >
            Settings <span></span>
          </div>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              justifyContent: "center",
              marginTop: "-6rem",
            }}
          >
            <Row>
              {/* <div className="col-md-2"></div> */}
              <div className="col-md-10" style={{ marginLeft: "-100%" }}>
                <div className="details-profile-edit">
                  <>
                    <div className="stat" style={{ width: "13rem" }}>
                      <div className="machine-icon-edit-profile">
                        <img
                          src={"/admin/images/admin/13-Profile/user-white.png"}
                        />
                      </div>
                      <div className="machine-title theme-bg-orange">
                        Child Users
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "190px", cursor: "pointer" }}
                        onClick={() => {
                          navigate("/childuser");
                        }}
                      >
                        Create User
                      </div>
                    </div>

                    <div
                      className="stat"
                      style={{
                        width: "11rem",
                      }}
                    >
                      <div className="machine-icon-edit-profile">
                        <img src={"/images/admin/06-View-Stats/switch.svg"} />
                      </div>
                      <div
                        className="machine-title"
                        style={{
                          backgroundColor:
                            is2faStatus && is2faStatus === 1 ? "green" : "red",
                        }}
                      >
                        {is2faStatus && is2faStatus === 1
                          ? "2FA ON"
                          : "2FA OFF"}
                      </div>
                      <div className="mid-portion" />
                      <div
                        className="machine-subtitle theme-bg-blue"
                        style={{ width: "170px", cursor: "pointer" }}
                        onClick={() => StatusChange()}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {isHovered
                          ? is2faStatus === 1
                            ? "Disable"
                            : "Enable"
                          : is2faStatus === 1
                          ? "Enable"
                          : "Disable"}
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </Row>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
