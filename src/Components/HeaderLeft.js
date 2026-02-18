import React, { useEffect, useState } from "react";
import "./HeaderLeft.css"; // Assuming you have a CSS file for styling
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const HeaderLeft = () => {
  const { smuser, isLoginByParentUser } = useAuth();
  function isMobileDevice() {
    return window.matchMedia("(max-width: 1000px)").matches;
  }

  const urlPathName = window.location.pathname;
  const urlParts = urlPathName.split("/");
  const lastElement = urlParts[urlParts.length - 2];

  //reset_password
  const [showFooter, setShowFooter] = useState(true);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("/");
  const [isLogged, setIsLogged] = useState(true);
  const pathname = window.location.pathname;
  const newUserTabs = !isMobile
    ? [
        {
          title: "Home",
          name: "/",
          normalImg: "/images/home-icon.svg",
          selectedImg: "/images/home-icon-orange.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Product",
          name: "/product",
          normalImg: "/images/products-icon.svg",
          selectedImg: "/images/products-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Solutions",
          name: "/solutions",
          normalImg: "/images/solutions-icon.svg",
          selectedImg: "/images/solutions-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Pricing",
          name: "/pricing",
          normalImg: "/images/price-icon.svg",
          selectedImg: "/images/price-orange.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Blog",
          name: "/blog",
          normalImg: "/images/blog-icon.svg",
          selectedImg: "/images/blog-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "T&S",
          name: "/termsConditions",
          normalImg: "/contract-white.png",
          selectedImg: "/contract-orange.png",
          normalClass: "",
          selectedClass: "",
        },
      ]
    : [
        {
          title: "Home",
          name: "/",
          normalImg: "/images/home-icon.svg",
          selectedImg: "/images/home-icon-orange.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Product",
          name: "/product",
          normalImg: "/images/products-icon.svg",
          selectedImg: "/images/products-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Solutions",
          name: "/solutions",
          normalImg: "/images/solutions-icon.svg",
          selectedImg: "/images/solutions-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Pricing",
          name: "/pricing",
          normalImg: "/images/price-icon.svg",
          selectedImg: "/images/price-orange.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Blog",
          name: "/blog",
          normalImg: "/images/blog-icon.svg",
          selectedImg: "/images/blog-orange-icon.svg",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "T&S",
          name: "/termsConditions",
          normalImg: "/contract-white.png",
          selectedImg: "/contract-orange.png",
          normalClass: "",
          selectedClass: "",
        },
        {
          title: "Close",
          name: "",
          normalImg: "/up-Arrow.png",
          selectedImg: "/up-Arrow.png",
          normalClass: "",
          selectedClass: "",
        },
      ];

  const UserTabs =
    isLoginByParentUser == 1
      ? [
          {
            title: "VM",
            name: "/vm/create",
            normalImg: "/admin/images/admin/menu/vm-white.png",
            selectedImg: "/admin/images/admin/menu/vm-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          {
            title: "CDN",
            name: "/vm/cdn",
            normalImg: "/admin/images/admin/menu/cdn.svg",
            selectedImg: "/images/cdn-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          {
            title: "Billing",
            name: "/bill",
            normalImg: "/admin/images/admin/menu/price-tag.svg",
            selectedImg: "/admin/images/admin/menu/price-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          {
            title: "Support",
            name: "/create-ticket",
            normalImg: "/admin/images/admin/menu/online_support.svg",
            selectedImg: "/admin/images/admin/menu/online_support-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          {
            title: "Monitoring",
            name: "/vm/monitor",
            normalImg: "/admin/images/admin/menu/monitoring.svg",
            selectedImg: "/admin/images/admin/menu/monitoring-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
        ]
      : [
          // {
          //   title: "VM",
          //   name: "/vm/create",
          //   normalImg: "/admin/images/admin/menu/vm-white.png",
          //   selectedImg: "/admin/images/admin/menu/vm-orange.svg",
          //   normalClass: "",
          //   selectedClass: "",
          // },
          {
            title: "CDN",
            name: "/vm/cdn",
            normalImg: "/admin/images/admin/menu/cdn.svg",
            selectedImg: "/images/cdn-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          // {
          //   title: "Billing",
          //   name: "/bill",
          //   normalImg: "/admin/images/admin/menu/price-tag.svg",
          //   selectedImg: "/admin/images/admin/menu/price-orange.svg",
          //   normalClass: "",
          //   selectedClass: "",
          // },
          {
            title: "Support",
            name: "/create-ticket",
            normalImg: "/admin/images/admin/menu/online_support.svg",
            selectedImg: "/admin/images/admin/menu/online_support-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
          {
            title: "Monitoring",
            name: "/vm/monitor",
            normalImg: "/admin/images/admin/menu/monitoring.svg",
            selectedImg: "/admin/images/admin/menu/monitoring-orange.svg",
            normalClass: "",
            selectedClass: "",
          },
        ];

  const navigate = useNavigate();

  useEffect(() => {
    smuser ? setIsLogged(true) : setIsLogged(false);
    isMobile ? setMenuVisible(false) : setMenuVisible(true);
    if (lastElement === "reset_password") {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
    function handleResize() {
      setIsMobile(isMobileDevice());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    // if (isLogged) {
    if (location.pathname === "/vm/create") {
      setActiveTab("/vm/create");
    } else if (location.pathname === "/vm/cdn") {
      setActiveTab("/vm/cdn");
    } else if (
      location.pathname === "/bill" ||
      location.pathname === "/billreport" ||
      location.pathname === "/paymentdata"
    ) {
      setActiveTab("/bill");
    } else if (location.pathname === "/create-ticket") {
      setActiveTab("/create-ticket");
    } else if (location.pathname === "/vm/monitor") {
      setActiveTab("/vm/monitor");
    }
    // } else {
    if (location.pathname === "/product") {
      setActiveTab("/product");
    } else if (location.pathname === "/solutions") {
      setActiveTab("/solutions");
    } else if (location.pathname === "/pricing") {
      setActiveTab("/pricing");
    } else if (location.pathname === "/blog") {
      setActiveTab("/blog");
    } else if (location.pathname === "/termsConditions") {
      setActiveTab("/termsConditions");
    }
    // }
  }, [activeTab, location.pathname]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      {showFooter && (
        <>
          {isMobile ? (
            <>
              {isLogged ? null : (
                <>
                  <div className="header-left h-auto">
                    <div className="main see-full">
                      <div
                        className="menu"
                        style={{
                          position: "relative",
                          zIndex: "999999999999",
                        }}
                      >
                        <a onClick={toggleMenu}>
                          <figure
                            style={{
                              padding: "5px",
                              marginTop: "15px",
                              marginBottom: "20px",
                            }}
                          >
                            <img
                              src="/images/menu.svg"
                              alt="Menu"
                              style={{
                                width: "20px",
                                marginLeft: "25px",
                              }}
                            />
                          </figure>
                        </a>
                      </div>
                      <div
                        className={`listing see-full ${
                          menuVisible ? "" : "hide"
                        }`}
                        // style={{ display: menuVisible ? "block" : "none" }}
                      >
                        <ul
                          className="see-full listing-mob"
                          style={{
                            paddingLeft: "0rem",
                            paddingBottom: "10px",
                            marginLeft: "11px",
                          }}
                        >
                          {newUserTabs.map((item, idx) => (
                            <li key={idx}>
                              <a>
                                <div
                                  className={`${
                                    activeTab === item.name
                                      ? "border-selected"
                                      : "border"
                                  }`}
                                  onClick={() => {
                                    setActiveTab(item.name);
                                    navigate(item.name);
                                    toggleMenu();
                                  }}
                                >
                                  <figure
                                    style={{
                                      // marginBottom: "2px",
                                      textAlign: "center",
                                      paddingTop: "15px",
                                    }}
                                  >
                                    <img
                                      // className="img-menu"
                                      src={`${
                                        activeTab === item.name
                                          ? item.selectedImg
                                          : item.normalImg
                                      }`}
                                      alt={`${
                                        activeTab === item.name
                                          ? item.selectedImg
                                          : item.normalImg
                                      }`}
                                      style={{
                                        height: "28px",
                                        width: "28px",
                                        marginLeft:
                                          item.title === "T&S"
                                            ? "5px"
                                            : item.title === "Solutions"
                                            ? "3px"
                                            : "0px",
                                      }}
                                    />
                                  </figure>
                                  <div className="heading">{item.title}</div>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="header-left h-auto">
              <div className="main see-full">
                <div style={{}}>
                  <div className="menu">
                    <a onClick={toggleMenu}>
                      <figure style={{ padding: "25px" }}>
                        <img
                          src="/images/menu.svg"
                          alt="Menu"
                          style={{
                            padding: "10px",
                            width: "60px",
                            marginTop: "4px",
                          }}
                        />
                      </figure>
                    </a>
                  </div>
                </div>
                <div
                  className={`listing see-full ${menuVisible ? "" : "hide"}`}
                  style={{ display: menuVisible ? "block" : "none" }}
                >
                  <ul
                    className="see-full listing-mob"
                    style={{ paddingLeft: "12px", paddingBottom: "15px" }}
                  >
                    {isLogged ? (
                      <>
                        {" "}
                        {UserTabs.map((item, idx) => (
                          <li key={idx}>
                            <a>
                              <div
                                className={`${
                                  activeTab === item.name
                                    ? "border-selected"
                                    : "border"
                                }`}
                                onClick={() => {
                                  setActiveTab(item.name);
                                  navigate(item.name);
                                }}
                              >
                                <figure style={{ marginBottom: "2px" }}>
                                  <img
                                    className="img-menu"
                                    src={`${
                                      activeTab === item.name
                                        ? item.selectedImg
                                        : item.normalImg
                                    }`}
                                    alt="Home"
                                  />
                                </figure>
                                <div className="heading">{item.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </>
                    ) : (
                      <>
                        {" "}
                        {newUserTabs.map((item, idx) => (
                          <li key={idx}>
                            <a>
                              <div
                                className={`${
                                  activeTab === item.name
                                    ? "border-selected"
                                    : "border"
                                }`}
                                onClick={() => {
                                  setActiveTab(item.name);
                                  navigate(item.name);
                                }}
                              >
                                <figure style={{ marginBottom: "2px" }}>
                                  <img
                                    className="img-menu"
                                    src={`${
                                      activeTab === item.name
                                        ? item.selectedImg
                                        : item.normalImg
                                    }`}
                                    alt="Home"
                                  />
                                </figure>
                                <div className="heading">{item.title}</div>
                              </div>
                            </a>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HeaderLeft;