import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { currencyReturn } from "./Api";
import { useAuth } from "./AuthContext";

const StripePayment = (props) => {
  const { clientSecret } = props;
  const { amount } = props;
  const { smuser, appCurrency } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [errorMessage, setErrorMessage] = useState(null);
  //   const [clientSecret, setClientSecret] = useState("");

  function isMobileDevice() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  useEffect(() => {
    function handleResize() {
      setIsMobile(isMobileDevice());
    }
    // fetch("/create-payment-intent", {
    //   method: "POST",
    // })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret));

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  //   if (!clientSecret) {
  //     return <div>Loading...</div>; // Show a loader until clientSecret is fetched
  //   }

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (elements == null) {
  //     return;
  //   }

  //   // Trigger form validation and wallet collection
  //   const { error: submitError } = await elements.submit();
  //   if (submitError) {
  //     // Show error to your customer
  //     setErrorMessage(submitError.message);
  //     return;
  //   }

  //   // Create the PaymentIntent and obtain clientSecret from your server endpoint
  //   // const res = await fetch("/create-intent", {
  //   //   method: "POST",
  //   // });

  //   // const { client_secret: clientSecret } = await res.json();

  //   const { error } = await stripe.confirmPayment({
  //     //`Elements` instance that was used to create the Payment Element
  //     elements,
  //     clientSecret,
  //     confirmParams: {
  //       return_url: "https://example.com/order/123/complete",
  //     },
  //   });

  //   if (error) {
  //     // This point will only be reached if there is an immediate error when
  //     // confirming the payment. Show error to your customer (for example, payment
  //     // details incomplete)
  //     setErrorMessage(error.message);
  //     console.log(error.message);
  //   } else {
  //     // Your customer will be redirected to your `return_url`. For some payment
  //     // methods like iDEAL, your customer will be redirected to an intermediate
  //     // site first to authorize the payment, then redirected to the `return_url`.
  //   }
  //   console.log(error);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      console.error(error.message);
    } else {
      console.log("Payment successful!");
    }
  };

  return (
    <>
      <div
        className="heading-dotted-support"
        style={{ left: "5%", marginTop: "3%" }}
      >
        Stripe Payment<span></span>
      </div>
      <div
        className="features-page-solution"
        style={{
          height: isMobile ? "45rem" : "75rem",
          padding: isMobile ? "" : "5rem",
          width: isMobile ? "100%" : "80%",
          marginLeft: isMobile ? "0%" : "12%",
          marginTop: isMobile ? "0%" : "1%",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: isMobile ? "" : "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <PaymentElement />

          <button
            style={{
              color: "white",
              width: "15rem",
              height: "45px",
              marginTop: isMobile ? "5rem" : "20px",
              backgroundColor: "#9B5BB2",
              borderRadius: "25px",
              border: "2px solid #ffff",
              outline: "2px solid #035189",
              fontWeight: "600",
              fontSize: "20px",
              textAlign: "center",
              marginLeft: isMobile ? "15%" : "",
            }}
            type="submit"
            disabled={!stripe || !elements}
          >
            {currencyReturn({
              price: amount,
              symbol: smuser.prefer_currency,
              rates: appCurrency,
            })}
          </button>
          <button
            style={{
              color: "white",
              width: "15rem",
              height: "45px",
              marginTop: "20px",
              backgroundColor: "#9B5BB2",
              borderRadius: "25px",
              border: "2px solid #ffff",
              outline: "2px solid #035189",
              fontWeight: "600",
              fontSize: "20px",
              textAlign: "center",
              marginLeft: isMobile ? "15%" : "",
            }}
            type="submit"
            disabled={!stripe || !elements}
          >
            Pay Now
          </button>
          {/* Show error message to your customers */}
          {errorMessage && <div>{errorMessage}</div>}
        </form>
      </div>
    </>
  );
};

export default StripePayment;