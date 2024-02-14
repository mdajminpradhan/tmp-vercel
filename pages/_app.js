import Script from "next/script";
import React, { useState } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";
import {
  ConnectPayments,
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from "@stripe/react-connect-js";
import "./styles.css";

export default function App() {
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      // Fetch the AccountSession client secret
      const response = await fetch("/api/account_session", {
        method: "POST",
      });
      if (!response.ok) {
        // Handle errors on the client side here
        const { error } = await response.json();
        console.log("An error occurred: ", error);
        return undefined;
      } else {
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      }
    };
    return loadConnectAndInitialize({
      // This is your test publishable API key.
      publishableKey:
        "pk_test_51OCNCUDqTe2dKZTf0kJVp0MXZlw41ziGstVCtf2197glYuVmOF9GmJvywdVVDa0O0O51HnjW1aNGj5ne80FboRdD00odttkm0y",
      fetchClientSecret: fetchClientSecret,
      appearance: {
        overlays: "dialog",
        variables: {
          colorPrimary: "black",
        },
      },
    });
  });

  return (
    <div>
      <div className="container">
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectPayments />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
}
