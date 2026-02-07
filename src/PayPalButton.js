import React, { useEffect } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  useEffect(() => {
    const buttonContainer = document.getElementById("paypal-button-container");
    if (buttonContainer) {
      buttonContainer.innerHTML = ""; // Clear existing buttons
    }
    let isMounted = true;

    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              if (onSuccess) {
                onSuccess(details);
              }
              // alert(
              //   `Transaction completed by ${details.payer.name.given_name}`
              // );
            });
          },
          onError: (err) => {
            console.error("PayPal Checkout error:", err);
          },
        })
        .render("#paypal-button-container")
        .catch((err) => {
          console.error("PayPal Button rendering failed:", err);
        });
    }
    return () => {
      isMounted = false; // Avoid updating state after unmount
    };
  }, [amount, onSuccess]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;