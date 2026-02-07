import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "./StripePayment";
import instance from "./Api";
import { useAuth } from "./AuthContext";

const stripePromise = loadStripe(
  "pk_test_51OuUXdSJRv4SF2lDndvO2OGpb6PDwa9RM52p0ZtysACVET8x6di0EfKdvkA1j3nGMJEBjTFHrWbBuHoYeY038vU300tPGRTYei"
); // Replace with your Publishable Key

const StripePaymentPage = () => {
  const location = useLocation();
  const { smuser } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const amount = location.state ? location.state.amount : null;

  const options = {
    mode: "payment",
    amount: amount,
    currency: "usd",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  useEffect(() => {
    // Fetch the clientSecret from your backend
    // fetch("/create-payment-intent", {
    //   method: "POST",
    // })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret));
    const fetchSecret = async () => {
      try {
        const payload = {
          user_id: smuser.id,
          amount: "1",
        };
        const response = await instance.post("/create-payment-intent", payload);
        console.log(response.data, "response.data");
        console.log(response.data.clientSecret, "secret");
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error fetching HTML content:", error);
      }
    };

    fetchSecret();
  }, []);

  if (!clientSecret) {
    return <div>Loading...</div>; // Show a loader until clientSecret is fetched
  }

  return (
    <Elements stripe={stripePromise} options={{ options, clientSecret }}>
      <StripePayment amount={amount} />
    </Elements>
  );
};

export default StripePaymentPage;
